#!/usr/bin/env python3
"""
Bundel prototype multi-halaman jadi SATU file HTML mandiri.

Kenapa perlu: reviewer (dan bos) sering nggak punya akses ke folder project.
Satu file bisa dikirim lewat chat atau email, diklik dua kali, dan semua
interaksi tetap jalan — termasuk drag-and-drop di day planner.

Cara pakai:
    python3 tools/build-single-file.py

Keluaran:
    kelana-prototype-LENGKAP.html
"""

import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'prototype')
OUT = os.path.join(ROOT, 'kelana-prototype-LENGKAP.html')

PAGES = [
    ('index',      'Beranda'),
    ('explore',    'Jelajah'),
    ('builder',    'Builder'),
    ('itinerary',  'Detail Trip'),
    ('trips',      'Trip Saya'),
    ('booking',    'Booking'),
    ('mobile',     'Mobile'),
    ('styleguide', 'Design System'),
]

ROUTER = r'''
/* ==========================================================================
   SINGLE-FILE ROUTER
   Tiap <main> dari versi multi-halaman menjadi satu .kframe. Semua tautan
   *.html dialihkan jadi pergantian frame, bukan navigasi dokumen.
   ========================================================================== */
(function () {
  'use strict';

  function show(slug, hash) {
    var found = false;
    document.querySelectorAll('.kframe').forEach(function (f) {
      var match = f.dataset.frame === slug;
      f.hidden = !match;
      if (match) found = true;
    });
    if (!found) return false;

    document.querySelectorAll('.proto-bar a').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === slug + '.html');
    });
    /* Menu utama menyala berdasarkan data-match, supaya membuka Builder atau
       Detail Trip tetap menandai "Jelajah" sebagai menu aktif. */
    document.querySelectorAll('.nav-link').forEach(function (a) {
      var match = (a.getAttribute('data-match') || a.getAttribute('href') || '').split(',');
      a.classList.toggle('is-active', match.indexOf(slug + '.html') !== -1);
    });

    if (hash) {
      var t = document.querySelector(hash);
      if (t) { t.scrollIntoView({ behavior: 'smooth' }); return true; }
    }
    window.scrollTo(0, 0);
    return true;
  }

  document.addEventListener('click', function (e) {
    /* Jangan rebut klik dari kontrol interaktif — tanpa guard ini, tombol
       simpan (♡) di dalam kartu <a> ikut memicu pergantian frame. */
    if (e.target.closest('button, [data-save], [data-modal-open], [data-modal-close],' +
                         ' [data-toast], input, select, textarea, label')) return;

    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!/\.html(#|$)/.test(href)) return;

    e.preventDefault();
    var parts = href.split('#');
    if (show(parts[0].replace('.html', ''), parts[1] ? '#' + parts[1] : null)) {
      history.replaceState(null, '', '#' + parts[0].replace('.html', ''));
    }
  }, false);

  /* Dukung deep link, mis. kelana-prototype-LENGKAP.html#builder */
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
    app_css    = read('assets', 'css', 'app.css')
    scenes_js  = read('assets', 'js', 'scenes.js')
    app_js     = read('assets', 'js', 'app.js')

    page_styles, frames, page_scripts = [], [], []
    modals = {}

    for slug, label in PAGES:
        src = read(f'{slug}.html')

        # CSS khusus halaman
        for m in re.finditer(r'<style>(.*?)</style>', src, re.S):
            page_styles.append(f'/* ===== dari {slug}.html ===== */\n' + m.group(1).strip())

        # Isi <main> menjadi satu frame
        main = re.search(r'<main[^>]*>(.*?)</main>', src, re.S)
        if not main:
            sys.exit(f'ERROR: {slug}.html tidak punya <main>')
        frames.append((slug, label, main.group(1)))

        # Modal diangkat ke level global. Kalau tetap di dalam frame yang
        # hidden, overlay-nya nggak akan pernah bisa muncul.
        for m in re.finditer(r'<div class="overlay"[^>]*data-modal="([^"]+)"[^>]*>.*?\n</div>', src, re.S):
            modals.setdefault(m.group(1), m.group(0))

        # Script inline (bukan src)
        for m in re.finditer(r'<script>(?!\s*$)(.*?)</script>', src, re.S):
            body = m.group(1).strip()
            if body and ('icon-gallery' in body or body.startswith('/*')
                         or 'goStep' in body or 'kelana-new-trip' in body):
                page_scripts.append(f'/* ===== script dari {slug}.html ===== */\n' + body)

    frame_html = '\n'.join(
        '<section class="kframe" data-frame="{s}"{h} aria-label="{l}">\n{c}\n</section>'.format(
            s=slug, l=label, c=content, h='' if i == 0 else ' hidden')
        for i, (slug, label, content) in enumerate(frames))

    nav_html = '\n  '.join(
        '<a href="{s}.html"{c}>{l}</a>'.format(
            s=slug, l=label, c=' class="is-active"' if i == 0 else '')
        for i, (slug, label, _) in enumerate(frames))

    nl = '\n'
    html = f'''<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kelana — Prototype Lengkap</title>
<meta name="description" content="Prototype web app Kelana: 7 frame, design system, dan penyusun itinerary drag-and-drop. Satu file, tanpa dependensi.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
/* ========================= TOKENS ========================= */
{tokens_css}
/* ======================= COMPONENTS ======================= */
{app_css}
/* =================== PAGE-SPECIFIC STYLES ================= */
{nl.join(page_styles)}
/* ===================== SINGLE-FILE SHELL ================== */
.kframe[hidden] {{ display: none; }}
</style>
</head>
<body>

<div data-slot="navbar"></div>

{frame_html}

<div data-slot="footer"></div>

{nl.join(modals.values())}

<nav class="proto-bar" aria-label="Navigasi frame prototype">
  <span class="proto-bar-label">Frame</span>
  {nav_html}
</nav>

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
    print(f'modal  : {", ".join(modals)}')
    print(f'script : {len(page_scripts)} blok halaman')


if __name__ == '__main__':
    build()
