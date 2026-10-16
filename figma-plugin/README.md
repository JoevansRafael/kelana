# Kelana Design System Builder — Figma Plugin

Membangun desain Kelana sebagai **layer Figma asli yang bisa kamu edit** — bukan gambar,
bukan SVG mati. Variables, Styles, Components dengan auto-layout, dan Frame halaman 1440px.

Plugin ini berjalan **sepenuhnya lokal**. Tidak mengirim atau mengambil data apa pun.

---

## Cara pasang (sekali saja, ±2 menit)

Butuh **Figma desktop app** — browser tidak bisa memuat plugin dari file lokal.
Unduh di [figma.com/downloads](https://www.figma.com/downloads/).

1. Simpan folder `figma-plugin/` ini ke komputermu
2. Buka Figma desktop → buat file baru (atau buka file kosong)
3. Menu **Plugins → Development → Import plugin from manifest…**
4. Pilih file `figma-plugin/manifest.json`
5. Plugin muncul di **Plugins → Development → Kelana Design System Builder**

## Cara pakai

Jalankan plugin, lalu klik **"Bangun semuanya"**. Prosesnya beberapa detik.

Hasilnya tiga halaman Figma baru:

| Halaman | Isi |
|---|---|
| `🎨 Foundations` | 38 ikon sebagai component 24px |
| `🧩 Components` | Button (36 varian), Badge, Chip, Input, Card/Itinerary, Card/Guide, Navbar, Footer |
| `🖥 Screens` | Frame 1440px: Beranda, Jelajah, Booking |

Plus, di panel kiri file:
- **Local variables** → koleksi `Kelana Color` (51 primitif + 30 alias semantik) dan `Kelana Layout` (spacing + radius)
- **Local styles** → 81 paint style, 12 text style, 7 effect style

Kalau satu fase gagal, fase lain tetap bisa dijalankan sendiri lewat tombol bernomor.
Log di panel plugin akan memberi tahu bagian mana yang bermasalah.

---

## Yang perlu kamu tahu

**Aman dijalankan berulang.** Setiap fase memeriksa dulu apakah hasilnya sudah ada. Kalau
sudah, fase itu dilewati — jadi tidak ada komponen atau style ganda. Mau bangun ulang dari
nol? Hapus dulu halaman dan koleksi variable-nya.

**Font.** Plugin mencoba Plus Jakarta Sans lebih dulu. Kalau belum terpasang di Figma-mu, dia
otomatis jatuh ke Inter dan memberi peringatan di log. Untuk hasil sesuai brand, pasang
Plus Jakarta Sans ([Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans),
lisensi OFL) lewat Figma desktop, lalu jalankan ulang.

**Gambar destinasi.** Semua foto dibuat sebagai frame biru bernama
`Image fill — ganti dengan foto`. Pilih frame itu, lalu isi dengan foto destinasi sungguhan
(Fill → Image). Ini disengaja: prototype HTML memakai ilustrasi SVG agar bebas lisensi, dan
di Figma kamu yang menentukan fotonya.

**Variables beralias.** Token semantik seperti `bg/brand` dan `text/primary` menunjuk ke
primitif (`ocean/500`, `navy/900`), bukan menyalin nilainya. Jadi mengubah `ocean/500` sekali
akan mengubah semua komponen yang memakainya. Ini yang membuat file-nya benar-benar bisa
kamu atur ulang.

---

## Cakupan — apa yang dibangun dan apa yang belum

**Dibangun otomatis:** seluruh fondasi (variables, styles, ikon), komponen inti, dan tiga
frame halaman sebagai titik awal.

**Belum dibangun otomatis:** Detail Trip, Builder 3 langkah, Trip Saya, dan frame mobile.
Alasannya jujur: kode plugin untuk menyusun delapan halaman pixel-perfect jadi sangat panjang
dan tidak bisa saya uji langsung di Figma dari lingkungan kerja saya. Yang saya prioritaskan
adalah bagian yang paling melelahkan kalau dikerjakan manual — 102 variable, 100 style, dan
38 ikon — plus komponen yang jadi bahan penyusun sisanya.

Setelah komponen ada, menyusun halaman sisanya di Figma jauh lebih cepat: tinggal drag
instance dan atur auto-layout. Acuan visualnya ada di `prototype/` (buka
`kelana-prototype-LENGKAP.html`) dan langkah-langkahnya di `docs/02-figma-build-guide.md`.

---

## Kalau ada yang error

Logika plugin sudah diuji dengan Figma API yang dipalsukan
(`node figma-plugin/test/mock-run.js` — 11 pemeriksaan lolos, termasuk jalur fallback font dan
anti-duplikat). Tapi mock bukan Figma sungguhan, jadi masih mungkin ada yang berbeda.

Kalau macet:
1. Catat pesan error di panel log plugin
2. Buka **Plugins → Development → Open console** untuk jejak lengkapnya
3. Coba jalankan fase satu per satu untuk tahu bagian mana yang gagal

Fase Variables dan Styles paling tidak bergantung pada hal lain, jadi biasanya itu yang
paling aman. Fase Screens paling rapuh karena bergantung pada komponen hasil fase 4.
