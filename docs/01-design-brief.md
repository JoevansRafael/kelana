# Kelana — Design Brief

Dokumen keputusan desain. Dibaca sebelum buka Figma, supaya tiap pilihan visual punya alasan
yang bisa dipertanggungjawabkan saat ditanya bos atau engineering.

---

## 1. Masalah yang dipecahkan

Riset itinerary di internet menghasilkan dua jenis konten, dan dua-duanya nggak kepake:

| Yang ada sekarang | Kenapa gagal |
|---|---|
| Blog "10 tempat wajib di Labuan Bajo" | Daftar tempat, bukan rencana. Nggak ada urutan, jam, atau waktu tempuh. |
| Paket tur agen travel | Jadwalnya fix, nggak bisa diubah, dan harganya nggak transparan. |
| Thread di media sosial | Pengalaman personal, nggak bisa langsung dipakai orang lain. |

Akibatnya traveler buka 40 tab browser, nyusun sendiri di Notes atau spreadsheet, dan tetap salah
estimasi waktu. Hari kedua kelelahan, dua destinasi dilewati.

**Posisi Kelana:** bukan marketplace tur, bukan blog. Kelana adalah **penyusun rencana harian yang
realistis** — dengan jam, rute, dan biaya yang sudah dihitung, tapi tetap bisa digeser.

---

## 2. Target pengguna

### Persona utama — "Perencana yang kebagian"
Rizky, 28, pekerja kantoran di Jakarta. Tiap trip rombongan, dia yang selalu kebagian jadi tukang
riset. Butuh 6–8 jam nyusun rencana 4 hari, lalu masih diprotes temannya.

- **Yang dia butuh:** rencana jadi yang bisa langsung di-share ke grup WhatsApp
- **Yang bikin dia pergi:** kalau harus daftar akun sebelum lihat hasil
- **Metrik sukses:** waktu dari buka web sampai punya rencana utuh — target di bawah 5 menit

### Persona kedua — "Pemakai di lapangan"
Dara, 24. Rencana sudah ada, tapi dia butuh bukanya saat sedang di jalan — di kapal, di jeep,
sering tanpa sinyal.

- **Yang dia butuh:** "sekarang ngapain" dan "berikutnya apa", bukan seluruh dokumen
- **Kendala nyata:** sinyal hilang total di Komodo, Bromo, Raja Ampat
- **Konsekuensi desain:** offline bukan fitur tambahan, tapi syarat dasar

---

## 3. Arsitektur informasi

Navigasi utama **hanya 4 menu**. Ini keputusan sadar: versi sebelumnya punya
"Jelajah Itinerary", "Buat Itinerary", "Trip Saya", dan "Cara Kerja" — empat menu yang dua di
antaranya sebenarnya satu aktivitas, dan satu lagi cuma anchor ke bawah halaman. Pengguna jadi
bingung harus mulai dari mana.

```
Kelana
├── BERANDA ..................... halaman informasi, bukan alat kerja
│   ├── Informasi destinasi ..... musim terbaik, kisaran biaya, daya tarik
│   ├── Itinerary unggulan ...... template siap pakai & populer
│   ├── About Kelana ............ apa ini, apa bedanya, 3 pintu masuk
│   └── Review .................. ringkasan rating + testimoni
│
├── JELAJAH ..................... tempat kerja: cari ATAU bikin
│   ├── Cari template ........... filter + hasil + peta
│   │   └── Detail Itinerary .... rencana harian, biaya, tips, ulasan
│   └── Buat sendiri ............ Builder 3 langkah → simpan ke Trip Saya
│
├── TRIP SAYA ................... akan datang · draf · disimpan · selesai
│   └── Mode Jalan (mobile) ..... dipakai saat trip berlangsung, offline
│
└── BOOKING ..................... transaksi dengan manusia
    ├── Pemandu wisata .......... sewa pemandu lokal terverifikasi
    └── Open trip patungan ...... gabung trip publik, biaya dibagi rata
```

Pembagiannya mengikuti **niat pengguna**, bukan struktur fitur:

| Menu | Niat pengguna |
|---|---|
| Beranda | "Saya belum tahu mau ke mana — kasih saya ide" |
| Jelajah | "Saya mau menyusun rencana" |
| Trip Saya | "Saya mau buka rencana yang sudah saya simpan" |
| Booking | "Saya mau jalan bareng orang lain" |

Builder dan Detail Itinerary **bukan menu sendiri** — keduanya anak dari Jelajah. Saat dibuka,
menu "Jelajah" tetap menyala sebagai penanda posisi.

---

## 4. Alur utama (prototype connection di Figma)

### Flow A — Ambil template yang sudah ada
```
01 Beranda
  └─ "Jelajahi itinerary" ──▶ 02 Jelajah (mode: ambil yang sudah ada)
                                └─ klik kartu ──▶ 06 Detail
                                                    ├─ klik hati ──▶ Toast "Disimpan"
                                                    └─ "Pesan sekarang" ──▶ Alur pembayaran
```

### Flow B — Susun sendiri
```
02 Jelajah
  └─ kartu "Susun sendiri dari nol" ──▶ 03 Builder/Dasar
                                          └─ Lanjut ──▶ 04 Builder/Minat
                                                          └─ Susun ──▶ 05 Builder/Rencana
                                                                         └─ Selesai ──▶ 07 Trip Saya
```

### Flow C — Sewa pemandu
```
01 Beranda
  └─ "Booking pemandu" ──▶ 08 Booking/Pemandu
                             └─ "Lihat profil" ──▶ Modal Profil Pemandu
                                                     └─ "Booking pemandu" ──▶ Toast konfirmasi
```

### Flow D — Gabung open trip patungan
```
08 Booking
  └─ tab "Open trip patungan" ──▶ 09 Booking/Patungan
                                    ├─ "Lihat rencana harian" ──▶ 06 Detail
                                    └─ "Gabung trip ini" ──▶ Modal Gabung Trip
                                                               └─ "Gabung & bayar" ──▶ Toast
                                                                  "Kursi 6 dari 8"
```

### Flow E — Mobile, saat trip berlangsung
```
10 Mobile Home ──▶ 13 Mobile Trip (mode jalan, status offline)
                     └─ Tandai selesai ──▶ aktivitas berikutnya naik jadi kartu utama
```

---

## 5. Lima keputusan desain yang perlu dibela

### 5.1 Hasil dulu, akun belakangan
Builder bisa diselesaikan tanpa login. Akun baru diminta di titik **menyimpan** — saat pengguna
sudah punya sesuatu yang sayang kalau hilang. Minta daftar di awal membunuh konversi persona
utama yang cuma mau cek apakah produknya berguna.

### 5.2 Konflik jadwal ditampilkan, bukan disembunyikan
Di Builder langkah 3 ada kartu peringatan kuning: *"Pink Beach → Komodo butuh 75 menit, jadwalmu
menyisakan 0 menit."* Ini fitur pembeda paling tajam Kelana. Kompetitor menampilkan jadwal cantik
yang mustahil dijalani; Kelana mengaku kalau rencananya terlalu padat. Jujur di titik ini membangun
kepercayaan yang nggak bisa dibeli lewat iklan.

### 5.3 Dua biru dengan pembagian tugas, bukan satu biru dua tingkat
Ocean Blue (`#35A8FF`) dan Kelana Blue (`#4087C4`) punya peran terpisah dan tidak boleh
dipakai bergantian sembarangan:

| Peran | Warna |
|---|---|
| Tombol primer, ring fokus, bar progres | Ocean `500` |
| Teks & tautan biru | Ocean `700` (kontras 4,9:1) |
| Chip terpilih, tab aktif, pin peta, chip hari | Kelana Blue `500` |
| Teks tombol sekunder | Kelana Blue `600` (kontras 5,3:1) |
| Panel pencarian, kartu terpilih | Ice Blue `#EAF5FF` |

Alasannya praktis: di satu layar bisa ada belasan chip filter aktif sekaligus. Kalau semuanya
memakai Ocean, deretan chip itu akan seterang tombol "Pesan sekarang" dan mata kehilangan
prioritas. Kelana Blue menurunkan bobotnya tanpa keluar dari keluarga brand.

### 5.4 Sunset Orange dibatasi satu aksen per layar
Oranye hanya untuk **satu** hal terpenting di tiap layar, plus titik pada logo dan badge
unggulan. Di daftar open trip yang berisi empat kartu, tombol "Gabung trip ini" justru memakai
biru primer — empat tombol oranye bertumpuk membuat tidak ada yang terlihat penting. Oranyenya
dipindah ke badge "Hampir penuh" pada satu kartu unggulan saja.

Latar halaman memakai Cloud White (`#F8FAFC`), bukan putih datar — cukup sejuk untuk menyatu
dengan dua biru brand, dan tetap membuat foto destinasi jadi elemen paling menonjol.

### 5.5 Patungan: harga turun terlihat, bukan tersembunyi
Di kartu open trip, tier harga ditampilkan terbuka — "4 orang Rp 4,85 jt (tercoret) · 5 orang
Rp 3,90 jt (sekarang) · 8 orang Rp 3,10 jt". Ini mengubah cara pengguna memandang kursi kosong:
dari "kok sepi" jadi "ayo ajak orang biar lebih murah". Peserta jadi punya alasan menyebarkan
tripnya sendiri.

Dua jaminan dicantumkan eksplisit di modal gabung, karena menyerahkan uang untuk jalan bareng
orang asing adalah lompatan kepercayaan yang besar:
1. Kuota minimum tidak tercapai sampai tenggat, uang kembali penuh.
2. Kuota jadi penuh, selisihnya dikembalikan ke semua peserta.

Tanpa poin kedua, pengguna yang gabung lebih awal merasa dirugikan karena bayar lebih mahal.

### 5.6 Offline sebagai kondisi normal
Di frame 12, status "Offline" muncul di status bar sebagai badge netral — bukan error merah.
Di Komodo dan Raja Ampat, offline adalah keadaan yang diharapkan, bukan kegagalan. Menampilkannya
sebagai error bikin pengguna panik di saat yang paling nggak tepat.

---

## 6. Inventaris layar

| # | Frame | Menu induk | Ukuran | Fungsi |
|---|---|---|---|---|
| 01 | Beranda | Beranda | 1440 | Destinasi, itinerary unggulan, about, review |
| 02 | Jelajah | Jelajah | 1440 | Dua mode + filter + hasil + peta |
| 03 | Builder / Dasar | Jelajah | 1440 | Tujuan, tanggal, rombongan, budget |
| 04 | Builder / Minat | Jelajah | 1440 | Minat, tempo, permintaan khusus |
| 05 | Builder / Rencana | Jelajah | 1440 | Day planner drag-drop + peringatan konflik |
| 06 | Itinerary Detail | Jelajah | 1440 | Rencana harian, biaya, tips, ulasan |
| 07 | Trip Saya | Trip Saya | 1440 | Akan datang, draf, disimpan, selesai |
| 08 | Booking / Pemandu | Booking | 1440 | Daftar pemandu + filter + profil |
| 09 | Booking / Patungan | Booking | 1440 | Open trip, kuota, tier harga, gabung |
| — | Modal Auth | global | overlay | Daftar / masuk |
| — | Modal Profil Pemandu | Booking | overlay | Bio, sertifikasi, ulasan, booking |
| — | Modal Gabung Trip | Booking | overlay | Rincian biaya + dua jaminan |
| 10 | Mobile Home | Beranda | 390 | Pencarian + trip aktif + rekomendasi |
| 11 | Mobile Explore | Jelajah | 390 | Filter jadi bottom sheet |
| 12 | Mobile Detail | Jelajah | 390 | Harga + CTA terkunci di bawah |
| 13 | Mobile Trip | Trip Saya | 390 | Mode jalan, offline-first |
| 14 | Design System | — | — | Token + komponen |

State tambahan yang juga perlu dibuat (sering kelupaan saat handoff):
`loading` (skeleton), `empty` (hasil nol), `error` (gagal muat), `disabled`.

---

## 7. Yang belum dikerjakan

Biar ekspektasi jelas saat presentasi — ini di luar lingkup v1:

- Alur pembayaran dan konfirmasi pesanan
- Peta interaktif sungguhan (saat ini placeholder statis)
- Dasbor sisi operator/kreator itinerary
- Pengaturan akun dan metode pembayaran
- Mode gelap — token sudah disiapkan berlapis, jadi tinggal tambah theme di Tokens Studio
