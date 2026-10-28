/* ==========================================================================
   KELANA — PROTOTYPE RUNTIME
   Nav, footer, icon set, toast, modal, chip/tab, dan drag-drop day planner.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- ICON SET (Figma: Icon / 24px, stroke 1.8) ------------------- */
  const S = (d, extra) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra || ''}>${d}</svg>`;

  const ICONS = {
    search:   S('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    pin:      S('<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
    calendar: S('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>'),
    users:    S('<circle cx="9" cy="8" r="3.4"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M17 8.5a3 3 0 0 1 0 5.6M18 20c0-2 .6-3.6-1-4.8"/>'),
    star:     '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8Z"/></svg>',
    heart:    S('<path d="M12 20s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.9C19.5 15.4 12 20 12 20Z"/>'),
    heartFill:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.9C19.5 15.4 12 20 12 20Z"/></svg>',
    share:    S('<path d="M12 3v11"/><path d="m8 7 4-4 4 4"/><path d="M5 14v4a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4"/>'),
    clock:    S('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    chevR:    S('<path d="m9 5 7 7-7 7"/>'),
    chevL:    S('<path d="m15 5-7 7 7 7"/>'),
    chevD:    S('<path d="m5 9 7 7 7-7"/>'),
    arrowR:   S('<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>'),
    plus:     S('<path d="M12 5v14M5 12h14"/>'),
    check:    S('<path d="m4.5 12.5 5 5 10-11"/>'),
    x:        S('<path d="M6 6l12 12M18 6 6 18"/>'),
    menu:     S('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    sparkle:  S('<path d="M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7Z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z"/>'),
    compass:  S('<circle cx="12" cy="12" r="8.5"/><path d="m15 9-2 4.4-4.4 2 2-4.4Z"/>'),
    route:    S('<circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="6" r="2.4"/><path d="M8.4 18H14a3.6 3.6 0 0 0 0-7.2h-4A3.4 3.4 0 0 1 10 4h5.6"/>'),
    wallet:   S('<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1.2" fill="currentColor" stroke="none"/>'),
    filter:   S('<path d="M4 6h16M7 12h10M10 18h4"/>'),
    grip:     '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>',
    car:      S('<path d="M4 16v-3l2-5h12l2 5v3"/><path d="M3 16h18"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>'),
    plane:    S('<path d="M3 13l18-7-7 18-2.5-7.5L3 13Z"/>'),
    food:     S('<path d="M7 3v8a2.5 2.5 0 0 0 5 0V3"/><path d="M9.5 11v10"/><path d="M16 3c2 1.5 2.5 4 2 6.5-.3 1.6-1 2-1 3.5v8"/>'),
    bed:      S('<path d="M3 18v-7h12a4 4 0 0 1 4 4v3"/><path d="M3 18h18"/><path d="M3 11V7"/><circle cx="7.5" cy="8.5" r="1.8"/>'),
    camera:   S('<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.5" r="3.4"/><path d="M9 7l1.2-2.5h3.6L15 7"/>'),
    shield:   S('<path d="M12 21s7-3 7-9V6l-7-3-7 3v6c0 6 7 9 7 9Z"/><path d="m9 12 2 2 4-4"/>'),
    globe:    S('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.4 2.4 14.6 0 17-2.4-2.4-2.4-14.6 0-17Z"/>'),
    download: S('<path d="M12 4v11"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/>'),
    edit:     S('<path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4 16.5V20Z"/><path d="m14.5 6.5 3 3"/>'),
    trash:    S('<path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6 7l1 13h10l1-13"/>'),
    offline:  S('<path d="M5 18a4 4 0 0 1 .6-8 6 6 0 0 1 11.3-1.3A3.8 3.8 0 0 1 19 18"/><path d="M12 12v6"/><path d="m9.5 15.5 2.5 2.5 2.5-2.5"/>'),
    sun:      S('<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>'),
    info:     S('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/>'),
    chat:     S('<path d="M20 12a7 7 0 0 1-7 7H8l-4 2 1-4.2A7 7 0 0 1 13 5a7 7 0 0 1 7 7Z"/>'),
    logo:     S('<path d="M12 2.8 20.5 12 12 21.2 3.5 12Z" fill="currentColor" stroke="none" opacity="0.28"/><path d="M12 6.4 16.8 12 12 17.6 7.2 12Z" fill="currentColor" stroke="none"/>')
  };

  function icon(name) { return ICONS[name] || ''; }

  /* Ganti <i data-icon="pin"></i> jadi SVG inline */
  function mountIcons(root) {
    (root || document).querySelectorAll('[data-icon]').forEach((el) => {
      if (el.dataset.iconMounted) return;
      el.dataset.iconMounted = '1';
      el.innerHTML = icon(el.dataset.icon);
      el.style.display = 'inline-flex';
      const svg = el.firstElementChild;
      if (svg && !el.dataset.iconSize) { svg.style.width = '1.15em'; svg.style.height = '1.15em'; }
      else if (svg) { svg.style.width = el.dataset.iconSize; svg.style.height = el.dataset.iconSize; }
    });
  }

  /* ---------- SHARED CHROME: Navbar + Footer + Prototype bar -------------- */
  /* Semua frame — dipakai bar navigasi prototype di kanan bawah */
  const PAGES = [
    { href: 'index.html',      label: 'Beranda' },
    { href: 'explore.html',    label: 'Jelajah' },
    { href: 'builder.html',    label: 'Builder' },
    { href: 'itinerary.html',  label: 'Detail Trip' },
    { href: 'trips.html',      label: 'Trip Saya' },
    { href: 'booking.html',    label: 'Booking' },
    { href: 'checkout.html',       label: 'Checkout' },
    { href: 'mitra-login.html',    label: 'Mitra · Login' },
    { href: 'mitra.html',          label: 'Mitra' },
    { href: 'mitra-daftar.html',   label: 'Mitra · Daftar' },
    { href: 'mitra-dashboard.html',label: 'Mitra · Dashboard' },
    { href: 'mobile.html',     label: 'Mobile' },
    { href: 'styleguide.html', label: 'Design System' }
  ];

  /* Halaman sisi mitra memakai shell sendiri (navbar & footer berbeda dari
     sisi wisatawan). Dikenali dari prefix nama file. */
  const PARTNER_PAGES = ['mitra.html', 'mitra-login.html', 'mitra-daftar.html', 'mitra-dashboard.html'];
  function isPartnerPage() { return PARTNER_PAGES.indexOf(currentPage()) !== -1; }

  /* Navigasi utama — hanya 4 menu.
     `match` menentukan menu mana yang menyala saat halaman anak dibuka:
     Builder dan Detail Trip adalah bagian dari Jelajah, bukan menu sendiri. */
  const NAV_LINKS = [
    { href: 'index.html',   label: 'Beranda',   match: ['index.html'] },
    { href: 'explore.html', label: 'Jelajah',   match: ['explore.html', 'builder.html', 'itinerary.html'] },
    { href: 'trips.html',   label: 'Trip Saya', match: ['trips.html'] },
    { href: 'booking.html', label: 'Booking',   match: ['booking.html'] }
  ];

  function currentPage() {
    const f = location.pathname.split('/').pop();
    return f === '' ? 'index.html' : f;
  }

  const LOGO = `
    <a class="logo" href="index.html" aria-label="Kelana — beranda">
      <span class="logo-mark">${icon('logo')}</span>
      <span class="logo-type">kelana<em>.</em></span>
    </a>`;

  function navbarHTML() {
    const page = currentPage();
    const links = NAV_LINKS.map((l) => {
      const match = l.match || [l.href];
      const active = match.indexOf(page) !== -1 ? ' is-active' : '';
      // data-match dibaca juga oleh router versi file tunggal
      return `<a class="nav-link${active}" href="${l.href}" data-match="${match.join(',')}">${l.label}</a>`;
    }).join('');
    return `
      <header class="navbar">
        <div class="container">
          ${LOGO}
          <nav class="nav-links" aria-label="Navigasi utama">${links}</nav>
          <span class="spacer"></span>
          <button class="btn-icon nav-toggle" data-toggle-nav aria-label="Buka menu">
            <i data-icon="menu" data-icon-size="20px"></i>
          </button>
          <button class="btn btn--ghost btn--sm hide-mobile" data-modal-open="auth">Masuk</button>
          <button class="btn btn--primary btn--sm hide-mobile" data-modal-open="auth">Daftar gratis</button>
        </div>
      </header>`;
  }

  function footerHTML() {
    const col = (title, items) =>
      `<div><h5>${title}</h5>${items.map((i) => `<a class="footer-link" href="${i[1] || '#'}">${i[0]}</a>`).join('')}</div>`;
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="stack stack-200">
              ${LOGO}
              <p class="t-body-sm" style="max-width:300px;color:rgba(226,232,240,.72)">
                Rencana perjalanan yang rapi, realistis, dan siap jalan. Dibuat buat yang pengin liburan
                tanpa drama riset 40 tab browser.
              </p>
              <div class="row row-100" style="margin-top:4px">
                <span class="badge badge--glass">${icon('shield')} Mitra terverifikasi</span>
              </div>
            </div>
            ${col('Produk', [['Jelajah itinerary', 'explore.html'], ['Buat itinerary', 'builder.html'], ['Trip saya', 'trips.html'], ['Booking pemandu', 'booking.html'], ['Open trip patungan', 'booking.html']])}
            ${col('Destinasi', [['Labuan Bajo', 'explore.html'], ['Yogyakarta', 'explore.html'], ['Raja Ampat', 'explore.html'], ['Bali', 'explore.html']])}
            ${col('Perusahaan', [['Tentang kami'], ['Jadi mitra Kelana', 'mitra.html'], ['Pusat bantuan'], ['Syarat & privasi']])}
          </div>
          <div class="footer-bottom">
            <span>© 2026 Kelana. Dibuat di Indonesia.</span>
            <span>Prototype v1.0 — design review internal</span>
          </div>
        </div>
      </footer>`;
  }

  /* ---------- SHELL SISI MITRA ----------
     Logo memakai sufiks "mitra", menu berbeda, dan CTA mengarah ke pendaftaran.
     Dipakai di mitra.html & mitra-daftar.html (dashboard pakai sidebar sendiri). */
  const LOGO_MITRA = `
    <a class="logo" href="mitra.html" aria-label="Kelana Mitra — beranda">
      <span class="logo-mark logo-mark--mitra">${icon('logo')}</span>
      <span class="logo-type">kelana<em>.</em></span>
      <span class="logo-chip-mitra">Mitra</span>
    </a>`;

  const PARTNER_NAV = [
    { href: 'mitra.html#kenapa',   label: 'Kenapa Kelana' },
    { href: 'mitra.html#tipe',     label: 'Tipe mitra' },
    { href: 'mitra.html#cara',     label: 'Cara kerja' },
    { href: 'mitra-dashboard.html',label: 'Lihat dashboard' }
  ];

  function partnerNavbarHTML() {
    const links = PARTNER_NAV.map((l) =>
      `<a class="nav-link" href="${l.href}">${l.label}</a>`).join('');
    return `
      <header class="navbar navbar--mitra">
        <div class="container">
          ${LOGO_MITRA}
          <nav class="nav-links" aria-label="Navigasi mitra">${links}</nav>
          <span class="spacer"></span>
          <button class="btn-icon nav-toggle" data-toggle-nav aria-label="Buka menu">
            <i data-icon="menu" data-icon-size="20px"></i>
          </button>
          <a class="btn btn--ghost btn--sm hide-mobile" href="index.html">Ke sisi wisatawan</a>
          <a class="btn btn--secondary btn--sm hide-mobile" href="mitra-login.html">Masuk</a>
          <a class="btn btn--primary btn--sm" href="mitra-daftar.html">Daftar jadi mitra</a>
        </div>
      </header>`;
  }

  function partnerFooterHTML() {
    const col = (title, items) =>
      `<div><h5>${title}</h5>${items.map((i) => `<a class="footer-link" href="${i[1] || '#'}">${i[0]}</a>`).join('')}</div>`;
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="stack stack-200">
              ${LOGO_MITRA}
              <p class="t-body-sm" style="max-width:300px;color:rgba(226,232,240,.72)">
                Jangkau ribuan wisatawan, kelola booking dari satu tempat, dan terima pembayaran
                tepat waktu. Gratis didaftarkan.
              </p>
              <div class="row row-100" style="margin-top:4px">
                <span class="badge badge--glass">${icon('shield')} Mitra terverifikasi</span>
              </div>
            </div>
            ${col('Untuk mitra', [['Jadi mitra', 'mitra.html'], ['Daftar sekarang', 'mitra-daftar.html'], ['Dashboard', 'mitra-dashboard.html'], ['Pusat bantuan mitra']])}
            ${col('Tipe mitra', [['Pemandu wisata', 'mitra-daftar.html'], ['UMKM lokal', 'mitra-daftar.html'], ['Operator open trip', 'mitra-daftar.html']])}
            ${col('Perusahaan', [['Tentang Kelana', 'index.html'], ['Sisi wisatawan', 'index.html'], ['Syarat kemitraan'], ['Kebijakan privasi']])}
          </div>
          <div class="footer-bottom">
            <span>© 2026 Kelana. Dibuat di Indonesia.</span>
            <span>Prototype v1.0 — sisi mitra</span>
          </div>
        </div>
      </footer>`;
  }

  function protoBarHTML() {
    const page = currentPage();
    const links = PAGES.map((p) =>
      `<a href="${p.href}" class="${p.href === page ? 'is-active' : ''}">${p.label}</a>`).join('');
    return `<nav class="proto-bar" aria-label="Navigasi prototype">
              <span class="proto-bar-label">Frame</span>${links}
            </nav>`;
  }

  /* ---------- TOAST ---------- */
  function toast(message, iconName) {
    let region = document.querySelector('.toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span class="toast-icon">${icon(iconName || 'check')}</span><span>${message}</span>`;
    region.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 260);
    }, 2600);
  }

  /* ---------- MODAL ---------- */
  function openModal(id) {
    const el = document.querySelector(`[data-modal="${id}"]`);
    if (!el) return;
    el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const focusable = el.querySelector('input, button, select, textarea');
    if (focusable) setTimeout(() => focusable.focus(), 120);
  }
  function closeModal(el) {
    const target = el || document.querySelector('.overlay.is-open');
    if (!target) return;
    target.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* ---------- DRAG & DROP day planner (Figma: interaksi manual) ---------- */
  function initDragDrop(scope) {
    const lists = (scope || document).querySelectorAll('[data-sortable]');
    lists.forEach((list) => {
      let dragged = null;

      list.querySelectorAll('[data-draggable]').forEach((item) => {
        item.setAttribute('draggable', 'true');

        item.addEventListener('dragstart', (e) => {
          dragged = item;
          item.classList.add('is-dragging');
          e.dataTransfer.effectAllowed = 'move';
          try { e.dataTransfer.setData('text/plain', 'kelana-activity'); } catch (_) {}
        });

        item.addEventListener('dragend', () => {
          item.classList.remove('is-dragging');
          list.querySelectorAll('.is-drop-target').forEach((n) => n.classList.remove('is-drop-target'));
          dragged = null;
          renumberTimes(list);
          toast('Urutan hari diperbarui — estimasi waktu dihitung ulang', 'clock');
        });

        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (!dragged || dragged === item) return;
          item.classList.add('is-drop-target');
        });

        item.addEventListener('dragleave', () => item.classList.remove('is-drop-target'));

        item.addEventListener('drop', (e) => {
          e.preventDefault();
          item.classList.remove('is-drop-target');
          if (!dragged || dragged === item) return;
          const items = [...list.querySelectorAll('[data-draggable]')];
          const from = items.indexOf(dragged);
          const to = items.indexOf(item);
          if (from < to) item.after(dragged); else item.before(dragged);
        });
      });
    });
  }

  /* Setelah reorder, waktu di-recalc biar kelihatan "pintar" saat demo */
  function renumberTimes(list) {
    let minutes = 7 * 60 + 30; // mulai 07:30
    list.querySelectorAll('[data-draggable]').forEach((item) => {
      const timeEl = item.querySelector('.activity-time');
      const dur = parseInt(item.dataset.duration || '90', 10);
      if (timeEl) {
        const h = String(Math.floor(minutes / 60) % 24).padStart(2, '0');
        const m = String(minutes % 60).padStart(2, '0');
        timeEl.textContent = `${h}.${m}`;
      }
      minutes += dur;
    });
  }

  /* ---------- GLOBAL EVENT DELEGATION ---------- */
  function initEvents() {
    document.addEventListener('click', (e) => {
      // Modal
      const openBtn = e.target.closest('[data-modal-open]');
      if (openBtn) { e.preventDefault(); openModal(openBtn.dataset.modalOpen); return; }

      if (e.target.closest('[data-modal-close]')) { e.preventDefault(); closeModal(); return; }
      if (e.target.classList.contains('overlay')) { closeModal(e.target); return; }

      // Chip / filter toggle
      const chip = e.target.closest('.chip');
      if (chip && !chip.dataset.noToggle) {
        chip.classList.toggle('is-selected');
        return;
      }

      // Tabs
      const tab = e.target.closest('.tab');
      if (tab) {
        const group = tab.closest('.tabs');
        group.querySelectorAll('.tab').forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const panelId = tab.dataset.tabTarget;
        if (panelId) {
          const scope = document.querySelector(`[data-tab-scope="${group.dataset.tabGroup}"]`) || document;
          scope.querySelectorAll('[data-tab-panel]').forEach((p) => {
            p.hidden = p.dataset.tabPanel !== panelId;
          });
        }
        return;
      }

      // Save / wishlist
      const save = e.target.closest('[data-save]');
      if (save) {
        e.preventDefault();
        e.stopPropagation();
        const on = save.classList.toggle('is-active');
        save.innerHTML = on ? ICONS.heartFill : ICONS.heart;
        const svg = save.firstElementChild;
        if (svg) { svg.style.width = '20px'; svg.style.height = '20px'; }
        toast(on ? 'Disimpan ke Trip Saya' : 'Dihapus dari Trip Saya', on ? 'heart' : 'info');
        return;
      }

      // Toast demo trigger
      const t = e.target.closest('[data-toast]');
      if (t) { toast(t.dataset.toast, t.dataset.toastIcon || 'check'); }

      // Mobile nav
      if (e.target.closest('[data-toggle-nav]')) {
        const links = document.querySelector('.nav-links');
        if (!links) return;
        const open = links.style.display === 'flex';
        links.style.cssText = open ? '' : `
          display:flex; position:absolute; top:var(--nav-height); left:0; right:0;
          flex-direction:column; align-items:stretch; gap:4px;
          background:var(--bg-surface); padding:16px 20px 20px;
          border-bottom:1px solid var(--border-subtle); box-shadow:var(--shadow-lg);`;
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Navbar shadow saat scroll
    const nav = document.querySelector('.navbar');
    if (nav) {
      const onScroll = () => {
        nav.style.boxShadow = window.scrollY > 8 ? 'var(--shadow-sm)' : 'none';
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /* ---------- BOOT ---------- */
  function boot() {
    document.querySelectorAll('[data-slot="navbar"]').forEach((n) => (n.outerHTML = navbarHTML()));
    document.querySelectorAll('[data-slot="footer"]').forEach((n) => (n.outerHTML = footerHTML()));
    document.querySelectorAll('[data-slot="partner-navbar"]').forEach((n) => (n.outerHTML = partnerNavbarHTML()));
    document.querySelectorAll('[data-slot="partner-footer"]').forEach((n) => (n.outerHTML = partnerFooterHTML()));
    document.querySelectorAll('[data-slot="protobar"]').forEach((n) => (n.outerHTML = protoBarHTML()));

    mountIcons(document);
    if (window.KelanaScenes) window.KelanaScenes.mountAll(document);
    initDragDrop(document);
    initEvents();
  }

  window.Kelana = { icon, toast, openModal, closeModal, mountIcons, initDragDrop };
  document.addEventListener('DOMContentLoaded', boot);
})();
