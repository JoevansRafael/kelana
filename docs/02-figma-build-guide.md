# Panduan Membangun di Figma

Urutan kerja supaya file Figma-nya rapi dan nggak perlu dirapikan ulang nanti. Estimasi total
6–9 jam untuk satu orang.

---

## Langkah 0 — Siapkan file (15 menit)

Buat file bernama `Kelana — Web App v1`, lalu buat 5 page:

| Page | Isi |
|---|---|
| `🎨 Foundations` | Warna, tipografi, spacing, elevasi, grid |
| `🧩 Components` | Semua komponen + variant |
| `🖥 Desktop` | Frame 01–08 |
| `📱 Mobile` | Frame 09–12 |
| `🗄 Archive` | Eksplorasi yang nggak dipakai — jangan dihapus, berguna saat ditanya "kenapa nggak begini?" |

Install font **Plus Jakarta Sans** ([Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans),
lisensi OFL — bebas dipakai komersial). Butuh weight 400, 500, 600, 700, 800.

---

> **Jalan pintas:** kalau kamu tidak mau menyusun manual, pakai plugin di `figma-plugin/`.
> Plugin itu membangun Langkah 1 sampai 3 secara otomatis (variables, styles, ikon, dan
> komponen inti), lalu kamu lanjut dari Langkah 4. Lihat `figma-plugin/README.md`.
> Panduan manual di bawah tetap berguna untuk memahami strukturnya, dan untuk menyusun
> halaman yang belum dibangun plugin.

## Langkah 1 — Import token (20 menit)

Cara cepat, tanpa bikin variable manual satu-satu:

1. Install plugin **Tokens Studio for Figma** (gratis)
2. Buka plugin → tab **Tools** → **Load from file/folder**
3. Pilih `tokens/kelana.tokens.json`
4. Plugin akan mendeteksi 4 token set: `primitive`, `semantic`, `typography`, `layout`
5. Set `primitive` sebagai **source**, tiga lainnya **enabled**
6. Klik **Export to Figma** → pilih *Variables* + *Styles*

Hasilnya: 145 token jadi Figma Variables dan Text/Effect Styles, dengan nama yang sama persis
seperti di CSS. Saat handoff, engineering lihat `semantic.bg.brand` di Figma dan
`var(--bg-brand)` di kode — nggak ada penerjemahan.

> **Kalau nggak mau pakai plugin:** buka `prototype/styleguide.html` di browser. Semua nilai hex,
> ukuran font, dan spacing tertulis di bawah tiap contoh, siap diketik manual.

---

## Langkah 2 — Grid per frame (10 menit)

Pasang Layout Grid di setiap frame sesuai ukurannya:

| Frame | Lebar | Columns | Margin | Gutter |
|---|---|---|---|---|
| Desktop | 1440 | 12 | 80 | 24 |
| Laptop | 1280 | 12 | 40 | 24 |
| Tablet | 768 | 8 | 32 | 20 |
| Mobile | 390 | 4 | 20 | 16 |

Konten maksimal **1280px** dan selalu di tengah. Di atas 1440px yang melebar cuma area tepi,
bukan kontennya — supaya panjang baris teks tetap nyaman dibaca.

---

## Langkah 3 — Bangun komponen (3–4 jam)

Urutannya dari kecil ke besar. Komponen besar menyusun yang kecil, jadi kalau dibalik kamu bakal
kerja dua kali.

### 3.1 Icon set — 38 ikon
Grid 24×24, stroke **1.8px**, corner & cap **round**. Jadikan component dengan nama
`Icon/{nama}`. Daftar lengkap ada di `styleguide.html` → bagian **Ikon**.

Penting: setelah outline, pakai *stroke* (jangan di-flatten jadi fill) supaya warnanya bisa
dioverride lewat instance.

### 3.2 Button
```
Component: Button
Properties:
  variant : primary | accent | secondary | ghost | on-ink
  size    : sm (38px) | md (48px) | lg (56px)
  state   : default | hover | pressed | disabled
  icon-l  : boolean
  icon-r  : boolean
  label   : text
```
Auto-layout horizontal, corner radius **999** (selalu pil), padding horizontal 24 (md).
Gap ikon–teks: 8.

### 3.3 Input & Field
```
Component: Input
Properties: state = default | hover | focus | filled | error | disabled
```
Tinggi 52, radius 12, border 1.5px.
State `focus`: border `ocean/500` + efek ring luar 4px `ocean/100`.

Bungkus jadi `Field` = Label + Input + Hint/Error (auto-layout vertical, gap 8).

### 3.4 Badge, Chip, Rating, Avatar
- `Badge` — property `tone`: brand | accent | neutral | success | warning | info | glass | ink.
  Varian `glass` & `ink` khusus di atas foto: background putih/hitam 92%/72% + background blur 8.
- `Chip` — property `state`: default | selected. Tinggi 40, radius 999.
- `Avatar` — property `size` (sm/md/lg) + `color` (5 pilihan). Border putih 2px (penting untuk
  AvatarStack dengan margin negatif −12).

### 3.5 Card/Itinerary — komponen paling penting
Dipakai di 6 frame berbeda, jadi property-nya harus lengkap dari awal:
```
Component: Card/Itinerary
Properties:
  layout     : vertical | horizontal   (horizontal untuk hasil Jelajah)
  badge      : boolean
  badge-text : text
  saved      : boolean                 (ikon ♡ vs ♥)
  state      : default | hover | loading
  title / price / duration / rating : text
```
Struktur layer:
```
Card/Itinerary  [auto-layout V, radius 24, border 1px ink/100]
├── Media  [aspect 4:3, clip content]
│   ├── Image fill          ← ganti ilustrasi SVG dengan foto di sini
│   ├── TopRow     [auto-layout H, space-between, inset 12]
│   │   ├── Badge (glass)
│   │   └── Button/icon (save)
│   └── BottomRow  [inset 12]
│       └── Badge (ink) — lokasi
└── Body   [auto-layout V, padding 20, gap 12]
    ├── Title     (text/h5, max 2 baris, truncate)
    ├── MetaRow   [auto-layout H, gap 12]
    ├── RatingRow [auto-layout H]
    └── Footer    [border-top 1px, space-between]
        ├── Price  [V: value + note]
        └── Button/icon (arrow)
```
State `hover`: Y −2px + shadow `md` + border `kelana-blue/200`. Sambungkan di tab Prototype dengan
trigger **While hovering** → **Smart animate**, durasi 240ms, easing *Ease out*.

### 3.6 ActivityRow — dipakai di timeline & builder
```
Component: ActivityRow
Properties:
  type       : activity | transit
  thumbnail  : boolean
  drag-handle: boolean      (true hanya di Builder)
  state      : default | hover | dragging | drop-target
```
Varian `transit`: background `sand/100`, border **dashed**, tanpa thumbnail.
State `dragging`: opacity 45% + border dashed `kelana-blue/400`.

Garis vertikal timeline dan titik bulatnya **jangan** dimasukkan ke dalam komponen — taruh
sebagai layer terpisah di frame induk, supaya tingginya bisa menyesuaikan jumlah item.

### 3.7 Komponen sisanya
`Navbar`, `Footer`, `SearchBar` (layout: hero | compact), `Tabs`, `Stepper`,
`FilterPanel`, `Modal` (base | wide), `Toast`, `BottomNav` (property `active`), `MapPin`,
`BudgetBreakdown`, `SelectCard`, `DayHeader`.

Semua spesifikasinya ada di `styleguide.html` — buka berdampingan dengan Figma saat mengerjakan.

---

## Langkah 4 — Susun frame (2–3 jam)

Kerjakan **03 Itinerary Detail** lebih dulu, bukan landing page. Alasannya: layar itu paling
padat komponen. Begitu dia selesai, 80% komponen sudah teruji dan frame lain jadi cepat.

Urutan yang disarankan:
1. `03 Itinerary Detail` — paling kompleks
2. `06 Builder / Rencana` — day planner
3. `02 Explore` — filter + daftar hasil
4. `01 Landing` — banyak section, tapi tiap section sederhana
5. `07 Trip Saya`
6. `04`, `05` Builder langkah 1 & 2
7. Frame mobile `09`–`12`

Semua frame pakai **auto-layout vertical** di level teratas, dengan tiap section sebagai child.
Ini membuat frame ikut memanjang sendiri saat konten ditambah — nggak perlu atur tinggi manual.

---

## Langkah 5 — Wiring prototype (45 menit)

Buat 3 flow starting point (klik kanan frame → **Add starting point**):

**Flow A · Temukan itinerary**
| Dari | Elemen | Aksi | Ke | Animasi |
|---|---|---|---|---|
| 01 | Tombol cari | On click | 02 | Smart animate 300ms |
| 02 | Card/Itinerary | On click | 03 | Smart animate 300ms |
| 03 | Tombol ♡ | On click | — | Overlay Toast, 2,6s lalu hilang |
| 03 | "Pesan sekarang" | On click | Overlay konfirmasi | Move in bawah |

**Flow B · Susun sendiri**
| Dari | Elemen | Aksi | Ke | Animasi |
|---|---|---|---|---|
| 01 | "Susun itinerary saya" | On click | 04 | Smart animate |
| 04 | "Lanjut ke minat" | On click | 05 | Smart animate 240ms |
| 05 | "Susun rencana saya" | On click | 06 | Smart animate 400ms |
| 06 | "Selesai & simpan" | On click | 07 | Smart animate |

**Flow C · Mobile**
| Dari | Elemen | Aksi | Ke |
|---|---|---|---|
| 09 | Kartu trip aktif | On click | 12 |
| 09 | Bottom nav "Jelajah" | On click | 10 |
| 10 | Kartu hasil | On click | 11 |

Smart animate bekerja kalau **nama layer sama di kedua frame**. Jadi Stepper di frame 04, 05, 06
harus punya nama layer identik — baru transisinya mulus.

Drag-and-drop di Builder nggak bisa diprototipekan di Figma. Dua pilihan:
- Pasang **While hovering** di drag handle untuk menampilkan state siap-geser, lalu sambungkan
  klik ke frame hasil urutan baru (`06b Builder/Reordered`)
- Saat demo ke bos, pakai prototype HTML di folder `prototype/` — di sana drag-drop-nya benar-benar
  jalan dan jam aktivitas ikut dihitung ulang

---

## Langkah 6 — Siapkan handoff (30 menit)

1. Di `🎨 Foundations`, tulis catatan kontras warna (sudah terangkum di `styleguide.html` →
   bagian **Warna**)
2. Beri anotasi di frame untuk hal yang nggak terlihat dari visual:
   - aturan truncate judul (maks 2 baris)
   - perilaku responsif tiap section
   - sumber data tiap angka (mis. "waktu tempuh dari Google Directions API")
3. Rapikan nama layer. Layer bernama `Frame 427` di file handoff adalah sumber pertanyaan
   engineering yang sebenarnya nggak perlu ada.
4. Set semua komponen ke **Published** kalau tim punya Figma Organization, supaya bisa dipakai
   lintas file.

---

## Checklist sebelum presentasi

- [ ] Semua teks pakai Text Style, bukan ukuran font manual
- [ ] Semua warna pakai Variable, bukan hex yang diketik langsung
- [ ] Tiap komponen punya state `hover` dan `disabled`
- [ ] State `loading` (skeleton) dan `empty` sudah dibuat
- [ ] Tiga flow prototype bisa diklik dari awal sampai akhir tanpa dead end
- [ ] Frame mobile diuji di Figma Mirror pakai HP sungguhan
- [ ] Nama layer bersih, nggak ada `Group 12` atau `Rectangle 3`
