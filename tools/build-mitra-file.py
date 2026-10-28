#!/usr/bin/env python3
"""
Bundel sisi MITRA jadi satu file HTML mandiri: kelana-mitra-LENGKAP.html

Sisi mitra tidak masuk ke kelana-prototype-LENGKAP.html (bundel itu memakai
satu navbar wisatawan yang persisten). Sisi mitra punya shell sendiri —
mitra.html & mitra-daftar.html pakai partner-navbar/footer, dan dashboard
pakai layout sidebar tanpa <main>. Karena itu mitra punya bundel terpisah.

Tiap halaman mitra jadi satu .kframe; tautan antar-halaman (*.html) dialihkan
jadi pergantian frame oleh router kecil di bawah.
"""

import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'prototype')
OUT = os.path.join(ROOT, 'kelana-mitra-LENGKAP.html')

PAGES = [
    ('mitra',           'Beranda Mitra'),
    ('mitra-daftar',    'Daftar'),
    ('mitra-dashboard', 'Dashboard'),
]

ROUTER = r'''
/* Router bundel mitra: tiap halaman = satu .kframe. Tautan *.html antar
   halaman mitra dialihkan jadi pergantian frame. Tautan ke frame yang tidak
   ada (mis. index.html "ke sisi wisatawan") dibiarkan apa adanya. */
(function () {
  'use strict';
  function show(slug, hash) {
    var target = document.querySelector('.kframe[data-frame="' + slug + '"]');
    if (!target) return false;
    document.querySelectorAll('.kframe').forEach(function (f) {
      f.hidden = (f.dataset.frame !== slug);
    });
    document.querySelectorAll('.proto-bar a').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === slug + '.html');
    });
    if (hash) {
      var t = document.querySelector(hash);
      if (t) { t.scrollIntoView({ behavior: 'smooth' }); return true; }
    }
    window.scrollTo(0, 0);
    return true;
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('button, [data-save], [data-modal-open], [data-modal-close],' +
                         ' [data-toast], input, select, textarea, label')) return;
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!/\.html(#|$)/.test(href)) return;
    var parts = href.split('#');
    var slug = parts[0].replace('.html', '');
    /* Hanya cegat kalau framenya memang ada di bundel ini. */
    if (!document.querySelector('.kframe[data-frame="' + slug + '"]')) return;
    e.preventDefault();
    if (show(slug, parts[1] ? '#' + parts[1] : null)) {
      history.replaceState(null, '', '#' + slug);
    }
  }, false);
  document.addEventListener('DOMContentLoaded', function () {
    var h = (location.hash || '').replace('#', '');
    if (h) show(h, null);
  });
})();
'''


def read(*parts):
    with open(os.path.join(SRC, *parts), encoding='utf-8') as f:
        return f.read()


def build():
    tokens_css = read('assets', 'css', 'tokens.css')
    app_css = read('assets', 'css', 'app.css')
    scenes_js = read('assets', 'js', 'scenes.js')
    app_js = read('assets', 'js', 'app.js')

    page_styles, page_scripts, frames = [], [], []

    for slug, label in PAGES:
        src = read(f'{slug}.html')

        # <style> dari <head> halaman
        for m in re.finditer(r'<style>(.*?)</style>', src, re.S):
            page_styles.append(f'/* ===== {slug}.html ===== */\n' + m.group(1).strip())

        # Isi <body>
        mb = re.search(r'<body[^>]*>(.*)</body>', src, re.S)
        if not mb:
            sys.exit(f'ERROR: {slug}.html tidak punya <body>')
        body = mb.group(1)

        # Script inline (tanpa src) -> kumpulkan, jalankan sekali di akhir
        for m in re.finditer(r'<script>(.*?)</script>', body, re.S):
            page_scripts.append(f'/* ===== script {slug}.html ===== */\n' + m.group(1).strip())
        body = re.sub(r'<script>.*?</script>', '', body, flags=re.S)

        # Buang <script src="..."> (scenes.js/app.js ditaruh sekali global)
        body = re.sub(r'\s*<script src="[^"]*"></script>', '', body)

        # Buang slot protobar bawaan (bundel pakai protobar sendiri)
        body = re.sub(r'<div data-slot="protobar"></div>', '', body)

        frames.append((slug, label, body.strip()))

    nl = '\n'
    frame_html = nl.join(
        '<section class="kframe" data-frame="{s}"{h} aria-label="{l}">\n{c}\n</section>'.format(
            s=slug, l=label, c=content, h='' if i == 0 else ' hidden')
        for i, (slug, label, content) in enumerate(frames))

    protobar = (
        '<nav class="proto-bar" aria-label="Navigasi frame mitra">\n'
        '  <span class="proto-bar-label">Mitra</span>\n  '
        + '\n  '.join(
            '<a href="{s}.html"{c}>{l}</a>'.format(
                s=slug, l=label, c=' class="is-active"' if i == 0 else '')
            for i, (slug, label, _) in enumerate(frames))
        + '\n  <a href="index.html" style="opacity:.6">↗ Sisi wisatawan</a>\n</nav>')

    html = f'''<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kelana Mitra — Prototype Lengkap (UMKM / Tour Guide)</title>
<meta name="description" content="Sisi mitra Kelana dalam satu file: landing jadi mitra, wizard pendaftaran, dan dashboard pengelolaan.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
/* ===== TOKENS ===== */
{tokens_css}
/* ===== COMPONENTS ===== */
{app_css}
/* ===== PAGE STYLES ===== */
{nl.join(page_styles)}
/* ===== SHELL ===== */
.kframe[hidden] {{ display: none; }}
</style>
</head>
<body>

{frame_html}

{protobar}

<script>
{scenes_js}
</script>
<script>
{app_js}
</script>
<script>
{nl.join(page_scripts)}
</script>
<script>
{ROUTER}
</script>
</body>
</html>
'''
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f'dibuat : {OUT}')
    print(f'ukuran : {len(html) / 1024:.1f} KB')
    print(f'frame  : {len(frames)} ({", ".join(s for s, _, _ in frames)})')
    print(f'style  : {len(page_styles)} blok halaman')
    print(f'script : {len(page_scripts)} blok halaman')


if __name__ == '__main__':
    build()
