#!/usr/bin/env python3
"""
Audit proporsi warna dari screenshot — verifikasi keseimbangan visual Kelana.

Target brand:
    65–75%  permukaan putih & netral terang
    15–25%  elemen biru + permukaan bernuansa biru
     5–10%  aksen oranye & warna pendukung

Dipakai untuk membuktikan keseimbangan dengan data piksel sungguhan, bukan
perkiraan. Decoder PNG ditulis manual karena sandbox tidak punya PIL/numpy.

Cara pakai:
    python3 tools/audit-palette.py <file.png> [file2.png ...]
"""

import sys
import zlib
import struct


# ---------------------------------------------------------------- PNG decode
def decode_png(path):
    """Kembalikan (width, height, pixels) dengan pixels = list of (r,g,b)."""
    data = open(path, 'rb').read()
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError(f'{path}: bukan file PNG')

    pos = 8
    w = h = depth = ctype = interlace = None
    idat = bytearray()

    while pos < len(data):
        (length,) = struct.unpack('>I', data[pos:pos + 4])
        ctag = data[pos + 4:pos + 8]
        body = data[pos + 8:pos + 8 + length]
        pos += 12 + length  # 4 len + 4 tag + body + 4 crc

        if ctag == b'IHDR':
            w, h, depth, ctype, _, _, interlace = struct.unpack('>IIBBBBB', body)
        elif ctag == b'IDAT':
            idat += body
        elif ctag == b'IEND':
            break

    if depth != 8:
        raise ValueError(f'{path}: bit depth {depth} tidak didukung')
    if interlace != 0:
        raise ValueError(f'{path}: PNG interlaced tidak didukung')
    channels = {0: 1, 2: 3, 4: 2, 6: 4}.get(ctype)
    if channels is None:
        raise ValueError(f'{path}: color type {ctype} tidak didukung')

    raw = zlib.decompress(bytes(idat))
    stride = w * channels
    out = []
    prev = bytearray(stride)
    p = 0

    for _ in range(h):
        f = raw[p]; p += 1
        line = bytearray(raw[p:p + stride]); p += stride

        if f == 1:    # Sub
            for i in range(channels, stride):
                line[i] = (line[i] + line[i - channels]) & 0xFF
        elif f == 2:  # Up
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 0xFF
        elif f == 3:  # Average
            for i in range(stride):
                a = line[i - channels] if i >= channels else 0
                line[i] = (line[i] + ((a + prev[i]) >> 1)) & 0xFF
        elif f == 4:  # Paeth
            for i in range(stride):
                a = line[i - channels] if i >= channels else 0
                b = prev[i]
                c = prev[i - channels] if i >= channels else 0
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pr) & 0xFF
        elif f != 0:
            raise ValueError(f'{path}: filter {f} tidak dikenal')

        out.append(bytes(line))
        prev = line

    return w, h, out, channels


# ----------------------------------------------------------- klasifikasi warna
def classify(r, g, b):
    mx, mn = max(r, g, b), min(r, g, b)
    chroma = mx - mn
    light = (mx + mn) / 510.0  # 0..1

    # hue dalam derajat
    if chroma == 0:
        hue = 0.0
    elif mx == r:
        hue = (60 * (((g - b) / chroma) % 6))
    elif mx == g:
        hue = (60 * (((b - r) / chroma) + 2))
    else:
        hue = (60 * (((r - g) / chroma) + 4))

    # Netral terang: putih, Cloud White, border slate terang
    if chroma <= 14 and light >= 0.88:
        return 'terang'
    # Gelap: Midnight Navy, slate gelap, seksi gelap
    if light < 0.45:
        if chroma >= 60 and 180 <= hue <= 250:
            return 'biru'
        return 'gelap'
    # Biru, termasuk Ice Blue dan permukaan bernuansa biru
    if 180 <= hue <= 250 and chroma >= 15:
        return 'biru'
    # Oranye / Sunset
    if 8 <= hue <= 45 and chroma >= 25:
        return 'oranye'
    # Netral menengah: slate 300/400/500
    if chroma <= 45:
        return 'netral'
    return 'lain'


def audit(path, step=3):
    w, h, rows, ch = decode_png(path)
    counts = {}
    total = 0
    for y in range(0, h, step):
        row = rows[y]
        for x in range(0, w, step):
            i = x * ch
            r, g, b = row[i], row[i + 1], row[i + 2]
            if ch == 4 and row[i + 3] == 0:
                continue
            counts[classify(r, g, b)] = counts.get(classify(r, g, b), 0) + 1
            total += 1
    return w, h, total, counts


TARGET = {'terang': (65, 75), 'biru': (15, 25), 'oranye': (0, 10)}


def main():
    files = sys.argv[1:]
    if not files:
        print(__doc__)
        sys.exit(1)

    agg = {}
    agg_total = 0

    print(f'{"frame":34s} {"terang":>8s} {"biru":>7s} {"oranye":>7s} {"gelap":>7s} {"netral":>7s} {"lain":>6s}')
    print('-' * 80)

    for f in files:
        try:
            w, h, total, c = audit(f)
        except Exception as e:
            print(f'{f}: GAGAL — {e}')
            continue
        for k, v in c.items():
            agg[k] = agg.get(k, 0) + v
        agg_total += total
        name = f.split('/')[-1].replace('.png', '')[:33]
        pct = lambda k: 100.0 * c.get(k, 0) / total
        print(f'{name:34s} {pct("terang"):7.1f}% {pct("biru"):6.1f}% {pct("oranye"):6.1f}% '
              f'{pct("gelap"):6.1f}% {pct("netral"):6.1f}% {pct("lain"):5.1f}%')

    if agg_total:
        print('-' * 80)
        pct = lambda k: 100.0 * agg.get(k, 0) / agg_total
        print(f'{"GABUNGAN":34s} {pct("terang"):7.1f}% {pct("biru"):6.1f}% {pct("oranye"):6.1f}% '
              f'{pct("gelap"):6.1f}% {pct("netral"):6.1f}% {pct("lain"):5.1f}%')
        print()
        print('Terhadap target brand:')
        for k, (lo, hi) in TARGET.items():
            v = pct(k)
            status = 'sesuai' if lo <= v <= hi else ('di bawah' if v < lo else 'di atas')
            print(f'  {k:7s} {v:5.1f}%   target {lo}-{hi}%   -> {status}')


if __name__ == '__main__':
    main()
