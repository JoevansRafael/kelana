# Flow mitra (login) + flow wisatawan (itinerary + pemandu)

## A. Flow mitra — mulai dari login
mitra.html (landing)
  ├─ "Masuk" ───────────► mitra-login.html ──(login)──► mitra-dashboard.html
  └─ "Daftar jadi mitra" ► mitra-daftar.html ──(selesai)─► mitra-dashboard.html
mitra-login.html:
  - email + password + "Masuk dengan Google"
  - "Belum punya akun? Daftar" → mitra-daftar.html
  - "Lupa password" (toast)
  - submit → mitra-dashboard.html

## B. Flow wisatawan — susun itinerary + tambah pemandu
explore.html (Jelajah)
  └─ "Susun sendiri" ► builder.html (L1 Dasar → L2 Minat → L3 Rencana)
        └─ "Selesai" ► MODAL "mau ditemani pemandu?"
              ├─ "Pilih pemandu" ► booking.html (tab pemandu)
              │       └─ modal profil "Tambahkan ke trip" ► checkout.html
              └─ "Nanti saja"    ► trips.html
checkout.html (BARU):
  - ringkasan: itinerary + pemandu (bisa dihapus) + rincian biaya + total
  - "Konfirmasi & bayar" → trips.html (+toast)

## Halaman baru
- [ ] mitra-login.html  (shell minimal: logo + konten tengah)
- [ ] checkout.html     (navbar wisatawan + <main>)
- [ ] docs/03-user-flows.md

## Wiring
- [ ] app.js: partner navbar tambah "Masuk" → mitra-login.html
- [ ] app.js PAGES: + mitra-login, + checkout (proto-bar)
- [ ] builder.html: tombol selesai → modal "trip-done"
- [ ] booking.html: guide modal "Booking pemandu" → checkout.html
- [ ] build-single-file.py: + checkout (bundel wisatawan)
- [ ] build-mitra-file.py: + mitra-login (bundel mitra)

## Verifikasi
- render 1440 & 390, klik ujung-ke-ujung tiap flow, rebuild 2 bundel, push PR.
