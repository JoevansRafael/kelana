# Sisi Mitra (UMKM / Tour Guide) — rencana kerja

Kelana adalah marketplace dua sisi. Yang sudah ada = sisi **wisatawan**.
Yang dibangun sekarang = sisi **mitra** (penyedia): pemandu wisata, UMKM lokal,
operator open trip.

## Halaman baru
1. `mitra.html` — Landing "Jadi Mitra Kelana"
   - Value props: jangkau wisatawan, kelola booking, pembayaran aman & tepat waktu
   - Tipe mitra: Pemandu Wisata · UMKM Lokal · Operator Open Trip
   - Statistik, testimoni mitra, CTA daftar
2. `mitra-daftar.html` — Wizard pendaftaran (pola stepper spt builder)
   - L1 pilih tipe mitra (select-card)
   - L2 data usaha/diri
   - L3 verifikasi dokumen (dropzone placeholder)
   - L4 layanan & tarif
   - Selesai → status "menunggu verifikasi"
3. `mitra-dashboard.html` — Dashboard mitra
   - Sidebar: Dashboard, Booking, Layanan, Kalender, Pendapatan, Ulasan, Profil
   - Stat cards + grafik pendapatan (SVG) + booking masuk (terima/tolak) + jadwal

## Teknis
- Tambah shell terpisah di app.js: `partnerNavbarHTML()` + `partnerFooterHTML()`,
  slot `data-slot="partner-navbar"` / `partner-footer`. JANGAN ubah navbar wisatawan.
- Daftarkan 3 halaman ke PAGES (proto-bar) + ke build-single-file.py.
- Tambah tautan "Jadi Mitra" di footer wisatawan.
- Pakai komponen yang ada: card, badge, chip, stepper, select-card, input,
  timeline, stat, budget-bar. Palet brand baru (ocean/kblue/orange).
- Komponen baru kalau perlu: sidebar dashboard, stat-card, dropzone, chart bar,
  toggle switch (ketersediaan).

## Verifikasi
- Render di headless Chrome: ikon/scene mounted, nol overflow 360–1440.
- Wizard pindah langkah, dashboard sidebar nav aktif.
- Rebuild LENGKAP, audit palet, lalu sync ke repo + PR.

## Status
- [x] app.js shell mitra (partnerNavbarHTML/partnerFooterHTML + slot + PAGES)
- [x] mitra.html — landing, render OK, mobile OK
- [x] mitra-daftar.html — wizard 4 langkah + selesai, step nav OK
- [x] mitra-dashboard.html — sidebar+stat+chart+booking terima/tolak OK
- [x] CSS komponen baru (stat-card, dropzone, toggle, dash shell, chart,
      booking-req, service-row, dash-split)
- [x] footer wisatawan -> tautan "Jadi mitra Kelana"
- [x] verifikasi render 1440 & 390 (screenshot), interaksi wizard+dashboard
- [x] bundle LENGKAP tetap 8 frame (mitra sengaja di luar bundle)
- [ ] sync ke repo /projects/sandbox/kelana + branch + PR

## Catatan keputusan
- Mitra TIDAK dibundel ke kelana-prototype-LENGKAP.html: bundle pakai satu
  navbar wisatawan persisten; sisi mitra butuh shell beda + dashboard tanpa
  <main>. Partner pages = file mandiri, terjangkau via proto-bar & cross-link.
- Dashboard pakai shell sidebar sendiri (bukan partner-navbar).
