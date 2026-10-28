#!/usr/bin/env python3
"""
Generator flowchart alur aplikasi Kelana -> SVG mandiri (tanpa dependensi).

Dua diagram: sisi wisatawan dan sisi mitra. Node ditempatkan dengan koordinat
piksel eksplisit; edge digambar sebagai garis/elbow dengan panah + label.
Warna mengikuti palet brand Kelana.

Output: docs/flowcharts/wisatawan.svg, docs/flowcharts/mitra.svg
"""

import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUTDIR = os.path.join(ROOT, 'docs', 'flowcharts')

# ---- palet ----
OCEAN = '#35A8FF'; OCEAN7 = '#1574BF'; ICE = '#EAF5FF'; OCEAN1 = '#D3EBFF'
KBLUE = '#4087C4'
ORANGE = '#FF6B24'; ORANGE1 = '#FFE1D4'; ORANGE3 = '#FF9E76'; ORANGE7 = '#BC410A'
NAVY = '#0F172A'; SLATE = '#64748B'; SLATE2 = '#E2E8F0'; SLATE4 = '#94A3B8'
WHITE = '#FFFFFF'; CLOUD = '#F8FAFC'
GREEN = '#16A34A'; GREEN1 = '#C8EED8'; GREEN7 = '#15803D'

FONT = ('font-family="Plus Jakarta Sans, Inter, -apple-system, Segoe UI, '
        'Roboto, sans-serif"')

# ---- gaya per tipe node ----
STYLE = {
    'start':   dict(fill=OCEAN,   stroke=OCEAN7, text=WHITE, rx=26, weight=700),
    'end':     dict(fill=OCEAN7,  stroke=OCEAN7, text=WHITE, rx=26, weight=700),
    'process': dict(fill=WHITE,   stroke=SLATE2, text=NAVY,  rx=12, weight=600),
    'accent':  dict(fill=ORANGE1, stroke=ORANGE3,text=ORANGE7,rx=12,weight=700),
    'key':     dict(fill=ICE,     stroke=OCEAN,  text=OCEAN7,rx=12, weight=700),
    'success': dict(fill=GREEN1,  stroke=GREEN,  text=GREEN7,rx=12, weight=700),
    'decision':dict(fill=ICE,     stroke=OCEAN,  text=NAVY,  rx=0,  weight=700),
}


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


class Node:
    def __init__(self, nid, typ, text, cx, cy, w=210, h=58):
        self.id, self.type, self.text = nid, typ, text
        self.cx, self.cy, self.w, self.h = cx, cy, w, h
        if typ == 'decision':
            self.w = max(w, 180); self.h = max(h, 96)

    def anchor(self, side):
        if side == 'top':    return (self.cx, self.cy - self.h / 2)
        if side == 'bottom': return (self.cx, self.cy + self.h / 2)
        if side == 'left':   return (self.cx - self.w / 2, self.cy)
        if side == 'right':  return (self.cx + self.w / 2, self.cy)
        return (self.cx, self.cy)

    def svg(self):
        s = STYLE[self.type]
        lines = self.text.split('\n')
        lh = 17
        ty = self.cy - (len(lines) - 1) * lh / 2
        tspans = ''.join(
            f'<tspan x="{self.cx}" y="{ty + i*lh:.0f}">{esc(l)}</tspan>'
            for i, l in enumerate(lines))
        fs = 13
        label = (f'<text text-anchor="middle" dominant-baseline="middle" '
                 f'{FONT} font-size="{fs}" font-weight="{s["weight"]}" '
                 f'fill="{s["text"]}">{tspans}</text>')
        if self.type == 'decision':
            x, y, w, h = self.cx, self.cy, self.w / 2, self.h / 2
            pts = f'{x},{y-h} {x+w},{y} {x},{y+h} {x-w},{y}'
            shape = (f'<polygon points="{pts}" fill="{s["fill"]}" '
                     f'stroke="{s["stroke"]}" stroke-width="2"/>')
        else:
            x = self.cx - self.w / 2; y = self.cy - self.h / 2
            shape = (f'<rect x="{x}" y="{y}" width="{self.w}" height="{self.h}" '
                     f'rx="{s["rx"]}" fill="{s["fill"]}" stroke="{s["stroke"]}" '
                     f'stroke-width="2"/>')
        return shape + label


def edge(a, aside, b, bside, label='', via=None, color=SLATE4, dash=False):
    """Edge dari sisi node a ke sisi node b. `via` = daftar titik (x,y) elbow."""
    p0 = a.anchor(aside)
    p1 = b.anchor(bside)
    pts = [p0] + (via or []) + [p1]
    d = ' '.join(f'{x:.0f},{y:.0f}' for x, y in pts)
    dash_attr = ' stroke-dasharray="6 6"' if dash else ''
    poly = (f'<polyline points="{d}" fill="none" stroke="{color}" '
            f'stroke-width="2"{dash_attr} marker-end="url(#arrow)"/>')
    lab = ''
    if label:
        # label di titik tengah segmen pertama (atau di via[0] bila ada)
        if via:
            lx, ly = via[0]
        else:
            lx, ly = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
        w = 8 + len(label) * 7
        lab = (f'<g><rect x="{lx-w/2:.0f}" y="{ly-11:.0f}" width="{w}" height="22" '
               f'rx="11" fill="{WHITE}" stroke="{SLATE2}"/>'
               f'<text x="{lx:.0f}" y="{ly:.0f}" text-anchor="middle" '
               f'dominant-baseline="middle" {FONT} font-size="11" '
               f'font-weight="700" fill="{SLATE}">{esc(label)}</text></g>')
    return poly + lab


def render(title, subtitle, nodes, edges, w, h, fname):
    body = []
    body.append(
        f'<rect width="{w}" height="{h}" fill="{CLOUD}"/>')
    # judul
    body.append(f'<text x="48" y="54" {FONT} font-size="26" font-weight="800" '
                f'fill="{NAVY}">{esc(title)}</text>')
    body.append(f'<text x="48" y="80" {FONT} font-size="14" '
                f'fill="{SLATE}">{esc(subtitle)}</text>')
    # legenda
    lg = [('Mulai/Selesai', OCEAN), ('Proses', WHITE), ('Keputusan', ICE),
          ('Aksi penting', ORANGE1)]
    lx = 48
    body.append(f'<text x="{w-48}" y="54" text-anchor="end" {FONT} '
                f'font-size="12" font-weight="700" fill="{SLATE}">KELANA · alur aplikasi</text>')
    for e in edges:
        body.append(e)
    for n in nodes:
        body.append(n.svg())
    defs = (f'<defs><marker id="arrow" markerWidth="10" markerHeight="10" '
            f'refX="8" refY="3" orient="auto" markerUnits="strokeWidth">'
            f'<path d="M0,0 L8,3 L0,6 z" fill="{SLATE4}"/></marker></defs>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
           f'viewBox="0 0 {w} {h}">{defs}{"".join(body)}</svg>')
    os.makedirs(OUTDIR, exist_ok=True)
    with open(os.path.join(OUTDIR, fname), 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f'  {fname}  ({w}x{h})')


# ======================================================================
# WISATAWAN
# ======================================================================
def wisatawan():
    SX = 330      # x spine
    RX = 720      # x branch kanan
    W = 980; H = 1180
    n = {}
    def add(nid, typ, text, cx, cy, **kw): n[nid] = Node(nid, typ, text, cx, cy, **kw); return n[nid]

    add('start', 'start', 'Buka Kelana (Beranda)', SX, 120, w=230)
    add('jelajah', 'process', 'Jelajah itinerary', SX, 220)
    add('d1', 'decision', 'Pakai template\natau susun sendiri?', SX, 340)
    add('tmpl', 'process', 'Buka template\n(Detail trip)', RX, 340)
    add('builder', 'key', 'Builder 3 langkah:\nDasar · Minat · Rencana', SX, 480, w=250)
    add('siap', 'process', 'Rencana harian siap', SX, 600)
    add('d2', 'decision', 'Tambah\npemandu wisata?', SX, 720)
    add('booking', 'accent', 'Booking pemandu', RX, 720)
    add('checkout', 'accent', 'Checkout & bayar', RX, 840)
    add('simpan', 'process', 'Tersimpan di Trip Saya', SX, 880, w=230)
    add('jalan', 'process', 'Mode jalan (offline)\nsaat trip berlangsung', SX, 1000, w=250)
    add('end', 'end', 'Trip selesai, beri ulasan', SX, 1110, w=250)

    e = []
    e.append(edge(n['start'], 'bottom', n['jelajah'], 'top'))
    e.append(edge(n['jelajah'], 'bottom', n['d1'], 'top'))
    e.append(edge(n['d1'], 'right', n['tmpl'], 'left', 'Template'))
    e.append(edge(n['d1'], 'bottom', n['builder'], 'top', 'Susun sendiri'))
    e.append(edge(n['builder'], 'bottom', n['siap'], 'top'))
    # template rejoin ke "siap"
    e.append(edge(n['tmpl'], 'bottom', n['siap'], 'right',
                  via=[(RX, 600)]))
    e.append(edge(n['siap'], 'bottom', n['d2'], 'top'))
    e.append(edge(n['d2'], 'right', n['booking'], 'left', 'Ya'))
    e.append(edge(n['booking'], 'bottom', n['checkout'], 'top'))
    e.append(edge(n['d2'], 'bottom', n['simpan'], 'top', 'Nanti saja'))
    e.append(edge(n['checkout'], 'bottom', n['simpan'], 'right',
                  via=[(RX, 880)]))
    e.append(edge(n['simpan'], 'bottom', n['jalan'], 'top'))
    e.append(edge(n['jalan'], 'bottom', n['end'], 'top'))

    render('Alur Wisatawan',
           'Susun itinerary, tambah pemandu (opsional), lalu jalan',
           list(n.values()), e, W, H, 'wisatawan.svg')


# ======================================================================
# MITRA
# ======================================================================
def mitra():
    SX = 380      # spine
    LX = 110      # branch kiri (login)
    RX = 760      # branch kanan (loop / booking)
    W = 980; H = 1320
    n = {}
    def add(nid, typ, text, cx, cy, **kw): n[nid] = Node(nid, typ, text, cx, cy, **kw); return n[nid]

    add('start', 'start', 'Buka Kelana Mitra', SX, 110, w=220)
    add('d1', 'decision', 'Sudah punya\nakun?', SX, 230)
    add('login', 'key', 'Login\n(email / Google)', LX, 230, w=170)
    add('daftar', 'process', 'Daftar: pilih tipe\n& data usaha', SX, 370, w=230)
    add('verif', 'process', 'Unggah verifikasi\n& pasang layanan', SX, 490, w=230)
    add('kirim', 'process', 'Kirim, lalu\nmenunggu verifikasi', SX, 610, w=230)
    add('d2', 'decision', 'Disetujui\ntim Kelana?', SX, 740)
    add('fix', 'process', 'Perbaiki dokumen', RX, 740, w=180)
    add('dash', 'key', 'Dashboard mitra', SX, 880, w=230)
    add('d3', 'decision', 'Ada booking\nmasuk?', SX, 1010)
    add('terima', 'accent', 'Terima lalu konfirmasi', RX, 1010, w=200)
    add('bayar', 'success', 'Jalankan trip,\ndibayar H+2', RX, 1130, w=200)
    add('kelola', 'process', 'Kelola layanan,\nketersediaan & ulasan', SX, 1150, w=240)
    add('end', 'end', 'Usaha berjalan', SX, 1270, w=200)

    e = []
    e.append(edge(n['start'], 'bottom', n['d1'], 'top'))
    e.append(edge(n['d1'], 'left', n['login'], 'top', 'Sudah', via=[(LX, 230)]))
    e.append(edge(n['d1'], 'bottom', n['daftar'], 'top', 'Belum'))
    e.append(edge(n['daftar'], 'bottom', n['verif'], 'top'))
    e.append(edge(n['verif'], 'bottom', n['kirim'], 'top'))
    e.append(edge(n['kirim'], 'bottom', n['d2'], 'top'))
    e.append(edge(n['d2'], 'right', n['fix'], 'left', 'Belum'))
    # loop balik fix -> kirim
    e.append(edge(n['fix'], 'top', n['kirim'], 'right', color=ORANGE3, dash=True,
                  via=[(RX, 610)]))
    e.append(edge(n['d2'], 'bottom', n['dash'], 'top', 'Ya'))
    # login -> dashboard lewat gutter kiri
    e.append(edge(n['login'], 'bottom', n['dash'], 'left', color=KBLUE,
                  via=[(LX, 880)]))
    e.append(edge(n['dash'], 'bottom', n['d3'], 'top'))
    e.append(edge(n['d3'], 'right', n['terima'], 'left', 'Terima'))
    e.append(edge(n['terima'], 'bottom', n['bayar'], 'top'))
    e.append(edge(n['d3'], 'bottom', n['kelola'], 'top', 'Kelola'))
    e.append(edge(n['bayar'], 'bottom', n['kelola'], 'right', via=[(RX, 1150)]))
    e.append(edge(n['kelola'], 'bottom', n['end'], 'top'))

    render('Alur Mitra (UMKM / Tour Guide)',
           'Masuk / daftar · verifikasi · kelola booking · dapat bayaran',
           list(n.values()), e, W, H, 'mitra.svg')


if __name__ == '__main__':
    print('Membangun flowchart:')
    wisatawan()
    mitra()
    print('Selesai →', OUTDIR)
