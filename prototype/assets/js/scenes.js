/* ==========================================================================
   KELANA — SCENE RENDERER
   Di produksi (dan di Figma), semua elemen ini diganti IMAGE FILL foto destinasi.
   Di prototype dipakai ilustrasi SVG supaya:
     - self-contained, nggak butuh koneksi / aset lisensi
     - konsisten sama palette brand, jadi review-nya fokus ke layout & hierarki
   Pakai:  <div class="scene" data-scene="ocean"></div>
   ========================================================================== */

(function () {
  'use strict';

  /* Palet ilustrasi, diselaraskan dengan palet brand Kelana.
     Aturan yang dipakai:
       - air & langit mengambil tangga Ocean / Kelana Blue
       - cahaya matahari memakai keluarga Sunset Orange
       - siluet daratan memakai Midnight Navy / Slate, bukan cokelat
       - dedaunan digeser ke teal kebiruan supaya menyatu dengan biru
     Tidak ada ungu, tidak ada warna neon. */
  const P = {
    // Laut & gugus pulau — Labuan Bajo, Komodo
    ocean:   { sky: ['#9FD7FF', '#EAF5FF'], sun: '#FFC9A8', water: ['#35A8FF', '#1574BF'], land: ['#2F6E9E', '#1E4263'] },
    // Senja kota & kuliner malam — langit oranye, siluet navy
    sunset:  { sky: ['#FFC49E', '#FF854C'], sun: '#FFF3E8', water: ['#C9622F', '#8A3A14'], land: ['#2A3A52', '#0F172A'] },
    // Kawah berkabut — Bromo, Ijen
    volcano: { sky: ['#C6E1F5', '#FFE8D8'], sun: '#FFF7EE', water: ['#B6C6D6', '#7A8CA3'], land: ['#5E6E86', '#33415A'] },
    // Karst & laguna — Raja Ampat
    reef:    { sky: ['#CDEBFF', '#F4FAFF'], sun: '#FFFFFF', water: ['#55C8F5', '#1E8FE6'], land: ['#2F7E8C', '#1A4551'] },
    // Sawah terasering & palem — Bali
    jungle:  { sky: ['#D4EDFF', '#F6FBFF'], sun: '#FFF6EA', water: ['#5FB0C9', '#2E7F9E'], land: ['#3E8A72', '#1C4A44'] },
    // Danau & perbukitan — Toba
    lake:    { sky: ['#C6E5FB', '#EAF5FF'], sun: '#FFFFFF', water: ['#5FADDE', '#2F6A9E'], land: ['#4E8C98', '#2A5563'] },
    // Fajar sebelum matahari terbit — biru malam + cahaya oranye (tanpa ungu)
    dawn:    { sky: ['#3E5F8A', '#FFAE80'], sun: '#FFE4CC', water: ['#3A5377', '#1E2B40'], land: ['#1E293B', '#0F172A'] },
    // Pantai granit — Belitung, Lombok
    sand:    { sky: ['#CDEBFF', '#F6FBFF'], sun: '#FFFFFF', water: ['#5BC8EE', '#1E8FE6'], land: ['#EADDC6', '#CBB795'] }
  };

  let uid = 0;

  function defs(id, pal) {
    return `
      <defs>
        <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${pal.sky[0]}"/>
          <stop offset="100%" stop-color="${pal.sky[1]}"/>
        </linearGradient>
        <linearGradient id="wtr${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${pal.water[0]}"/>
          <stop offset="100%" stop-color="${pal.water[1]}"/>
        </linearGradient>
        <linearGradient id="lnd${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${pal.land[0]}"/>
          <stop offset="100%" stop-color="${pal.land[1]}"/>
        </linearGradient>
      </defs>`;
  }

  /* --- Komposisi per tipe scene -------------------------------------------- */
  const builders = {
    // Laut + pulau + perahu phinisi (Labuan Bajo, Komodo)
    ocean(id, pal) {
      return `
        <rect width="400" height="300" fill="url(#sky${id})"/>
        <circle cx="300" cy="78" r="30" fill="${pal.sun}" opacity="0.85"/>
        <path d="M0 176 L54 142 L96 176 Z" fill="url(#lnd${id})" opacity="0.55"/>
        <path d="M250 180 L300 134 L352 180 Z" fill="url(#lnd${id})" opacity="0.5"/>
        <path d="M60 184 L128 120 L168 152 L208 184 Z" fill="url(#lnd${id})"/>
        <rect y="182" width="400" height="118" fill="url(#wtr${id})"/>
        <path d="M0 182 q50 10 100 0 t100 0 t100 0 t100 0 v14 H0 Z" fill="${pal.water[0]}" opacity="0.5"/>
        <g opacity="0.3" stroke="#fff" stroke-width="2" stroke-linecap="round">
          <path d="M40 220 h34"/><path d="M300 236 h40"/><path d="M130 252 h30"/><path d="M220 210 h24"/>
        </g>
        <g transform="translate(172 196)">
          <path d="M0 24 L64 24 L54 38 L10 38 Z" fill="#1E293B"/>
          <path d="M30 24 L30 -16 L58 24 Z" fill="#F8FAFC" opacity="0.95"/>
          <path d="M28 24 L28 -4 L8 24 Z" fill="#F8FAFC" opacity="0.8"/>
          <rect x="28" y="-18" width="2" height="44" fill="#1E293B"/>
        </g>`;
    },

    // Candi + matahari terbit (Yogyakarta, Prambanan/Borobudur)
    temple(id, pal) {
      const stupa = (x, y, s) => `
        <g transform="translate(${x} ${y}) scale(${s})">
          <path d="M-22 40 L22 40 L16 20 L-16 20 Z" fill="url(#lnd${id})"/>
          <path d="M-14 20 L14 20 L9 2 L-9 2 Z" fill="url(#lnd${id})"/>
          <path d="M-7 2 L7 2 L0 -16 Z" fill="url(#lnd${id})"/>
          <circle cx="0" cy="-20" r="3.4" fill="url(#lnd${id})"/>
        </g>`;
      return `
        <rect width="400" height="300" fill="url(#sky${id})"/>
        <circle cx="198" cy="132" r="54" fill="${pal.sun}" opacity="0.92"/>
        <circle cx="198" cy="132" r="84" fill="${pal.sun}" opacity="0.2"/>
        <path d="M0 196 q70 -26 150 -8 t120 -14 t130 10 v116 H0 Z" fill="${pal.land[1]}" opacity="0.26"/>
        ${stupa(86, 176, 0.78)}
        ${stupa(314, 178, 0.72)}
        ${stupa(198, 152, 1.18)}
        ${stupa(142, 186, 0.6)}
        ${stupa(258, 188, 0.58)}
        <rect y="228" width="400" height="72" fill="url(#lnd${id})"/>
        <g opacity="0.3" fill="${pal.sky[1]}">
          <ellipse cx="60" cy="244" rx="46" ry="7"/><ellipse cx="330" cy="256" rx="54" ry="8"/>
        </g>
        <g opacity="0.55" fill="${pal.land[1]}">
          <path d="M28 232 q6 -22 12 0 Z"/><path d="M372 234 q6 -20 12 0 Z"/>
        </g>`;
    },

    // Kawah + kaldera berkabut (Bromo, Ijen)
    volcano(id, pal) {
      return `
        <rect width="400" height="300" fill="url(#sky${id})"/>
        <circle cx="86" cy="66" r="26" fill="${pal.sun}" opacity="0.9"/>
        <path d="M0 212 L80 128 L120 160 L150 212 Z" fill="url(#lnd${id})" opacity="0.52"/>
        <path d="M250 212 L320 118 L400 212 Z" fill="url(#lnd${id})" opacity="0.6"/>
        <path d="M110 216 L212 88 L246 120 L300 216 Z" fill="url(#lnd${id})"/>
        <path d="M196 96 L212 88 L228 100 q-16 8 -32 -4 Z" fill="#F8FAFC" opacity="0.5"/>
        <g opacity="0.5">
          <ellipse cx="212" cy="80" rx="20" ry="9" fill="#F8FAFC"/>
          <ellipse cx="226" cy="62" rx="15" ry="7" fill="#F8FAFC" opacity="0.7"/>
          <ellipse cx="208" cy="48" rx="11" ry="5" fill="#F8FAFC" opacity="0.45"/>
        </g>
        <rect y="214" width="400" height="86" fill="url(#lnd${id})"/>
        <g opacity="0.75" fill="#F8FAFC">
          <ellipse cx="120" cy="218" rx="150" ry="13"/>
          <ellipse cx="300" cy="232" rx="130" ry="11" opacity="0.6"/>
        </g>
        <g opacity="0.22" stroke="${pal.sky[1]}" stroke-width="3" stroke-linecap="round">
          <path d="M40 258 h70"/><path d="M250 272 h90"/>
        </g>`;
    },

    // Karst + laguna (Raja Ampat, Wayag)
    reef(id, pal) {
      const karst = (x, y, s, o) => `
        <g transform="translate(${x} ${y}) scale(${s})" opacity="${o}">
          <path d="M-34 44 q-6 -34 14 -44 q16 -8 30 4 q18 12 10 40 Z" fill="url(#lnd${id})"/>
          <path d="M-20 4 q8 -12 20 -6 q10 6 6 14 q-16 4 -26 -8 Z" fill="${pal.land[0]}" opacity="0.5"/>
        </g>`;
      return `
        <rect width="400" height="300" fill="url(#sky${id})"/>
        <circle cx="330" cy="58" r="22" fill="${pal.sun}" opacity="0.75"/>
        <g opacity="0.45" fill="#FFFFFF">
          <ellipse cx="90" cy="54" rx="40" ry="13"/><ellipse cx="124" cy="46" rx="28" ry="10"/>
        </g>
        ${karst(60, 128, 0.9, 0.6)}
        ${karst(330, 134, 0.8, 0.55)}
        ${karst(150, 112, 1.25, 1)}
        ${karst(246, 126, 1.0, 0.95)}
        <rect y="176" width="400" height="124" fill="url(#wtr${id})"/>
        <path d="M0 176 h400 v26 q-100 14 -200 0 t-200 0 Z" fill="#A8DCFF" opacity="0.5"/>
        <g opacity="0.4" fill="#FFFFFF">
          <ellipse cx="120" cy="222" rx="54" ry="9"/><ellipse cx="300" cy="248" rx="62" ry="10"/>
        </g>
        <g opacity="0.3" stroke="#fff" stroke-width="2" stroke-linecap="round">
          <path d="M50 262 h40"/><path d="M230 276 h50"/>
        </g>`;
    },

    // Sawah terasering + palem (Bali, Ubud)
    jungle(id, pal) {
      const palm = (x, y, s, flip) => `
        <g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
          <path d="M0 0 q-5 -34 3 -62" stroke="${pal.land[1]}" stroke-width="5" fill="none" stroke-linecap="round"/>
          <g fill="${pal.land[0]}">
            <path d="M3 -62 q-26 -14 -38 2 q22 6 38 6 Z"/>
            <path d="M3 -62 q26 -16 40 0 q-24 6 -40 6 Z"/>
            <path d="M3 -62 q-16 -28 -34 -26 q14 18 34 28 Z"/>
            <path d="M3 -62 q18 -28 36 -24 q-16 18 -36 26 Z"/>
            <path d="M3 -62 q-4 -24 2 -32 q8 16 4 32 Z"/>
          </g>
        </g>`;
      return `
        <rect width="400" height="300" fill="url(#sky${id})"/>
        <circle cx="310" cy="56" r="26" fill="${pal.sun}" opacity="0.8"/>
        <path d="M0 150 L70 96 L140 150 Z" fill="url(#lnd${id})" opacity="0.4"/>
        <path d="M200 150 L286 86 L380 150 Z" fill="url(#lnd${id})" opacity="0.45"/>
        <rect y="148" width="400" height="152" fill="url(#lnd${id})"/>
        <g fill="${pal.water[0]}" opacity="0.85">
          <path d="M0 160 q110 -16 200 0 t200 -4 v14 q-100 14 -200 0 t-200 4 Z"/>
          <path d="M0 194 q120 -18 210 2 t190 -6 v18 q-110 16 -200 -2 t-200 6 Z" opacity="0.8"/>
          <path d="M0 236 q130 -20 220 4 t180 -8 v22 q-120 18 -210 -4 t-190 8 Z" opacity="0.7"/>
        </g>
        <g opacity="0.3" stroke="${pal.land[1]}" stroke-width="2">
          <path d="M0 172 q110 -14 200 2 t200 -4"/>
          <path d="M0 212 q120 -16 210 4 t190 -6"/>
        </g>
        ${palm(52, 182, 1.1, false)}
        ${palm(352, 196, 1.25, true)}
        ${palm(96, 168, 0.75, true)}`;
    },

    // Danau + perbukitan (Toba, Ranu Kumbolo)
    lake(id, pal) {
      return `
        <rect width="400" height="300" fill="url(#sky${id})"/>
        <circle cx="120" cy="60" r="24" fill="${pal.sun}" opacity="0.7"/>
        <g opacity="0.4" fill="#FFFFFF">
          <ellipse cx="280" cy="52" rx="48" ry="14"/><ellipse cx="240" cy="60" rx="32" ry="11"/>
        </g>
        <path d="M0 166 L90 104 L170 166 Z" fill="url(#lnd${id})" opacity="0.5"/>
        <path d="M130 170 L240 92 L340 170 Z" fill="url(#lnd${id})" opacity="0.75"/>
        <path d="M290 170 L360 118 L400 170 Z" fill="url(#lnd${id})" opacity="0.55"/>
        <rect y="168" width="400" height="132" fill="url(#wtr${id})"/>
        <g opacity="0.3">
          <path d="M130 168 L240 236 L340 168 Z" fill="${pal.land[1]}"/>
        </g>
        <ellipse cx="240" cy="206" rx="58" ry="12" fill="url(#lnd${id})" opacity="0.9"/>
        <g opacity="0.35" stroke="#fff" stroke-width="2" stroke-linecap="round">
          <path d="M40 196 h46"/><path d="M300 224 h54"/><path d="M110 250 h40"/>
        </g>`;
    },

    // Fajar / stargazing (Dieng, Bromo pre-dawn)
    dawn(id, pal) {
      return `
        <rect width="400" height="300" fill="url(#sky${id})"/>
        <g fill="#F8FAFC">
          <circle cx="46" cy="36" r="1.6" opacity="0.9"/><circle cx="112" cy="22" r="1.2" opacity="0.7"/>
          <circle cx="178" cy="44" r="1.8" opacity="0.85"/><circle cx="244" cy="18" r="1.1" opacity="0.6"/>
          <circle cx="310" cy="40" r="1.5" opacity="0.8"/><circle cx="364" cy="24" r="1.3" opacity="0.65"/>
          <circle cx="78" cy="70" r="1.1" opacity="0.55"/><circle cx="286" cy="76" r="1.4" opacity="0.6"/>
        </g>
        <circle cx="318" cy="96" r="20" fill="${pal.sun}" opacity="0.92"/>
        <circle cx="318" cy="96" r="38" fill="${pal.sun}" opacity="0.16"/>
        <path d="M0 214 L74 140 L132 186 L180 214 Z" fill="url(#lnd${id})" opacity="0.55"/>
        <path d="M150 214 L250 128 L310 174 L400 214 Z" fill="url(#lnd${id})"/>
        <rect y="212" width="400" height="88" fill="${pal.land[1]}"/>
        <g opacity="0.7" fill="#F8FAFC">
          <ellipse cx="200" cy="216" rx="190" ry="12"/>
        </g>
        <g opacity="0.5" fill="${pal.sun}">
          <ellipse cx="318" cy="118" rx="60" ry="5"/>
        </g>`;
    },

    // Pantai granit (Belitung, Lombok)
    sand(id, pal) {
      return `
        <rect width="400" height="300" fill="url(#sky${id})"/>
        <circle cx="326" cy="52" r="24" fill="${pal.sun}" opacity="0.85"/>
        <g opacity="0.35" fill="#FFFFFF">
          <ellipse cx="80" cy="44" rx="44" ry="13"/><ellipse cx="118" cy="52" rx="30" ry="10"/>
        </g>
        <rect y="138" width="400" height="86" fill="url(#wtr${id})"/>
        <path d="M0 138 h400 v18 q-100 12 -200 0 t-200 0 Z" fill="#A8DCFF" opacity="0.55"/>
        <path d="M0 214 q100 -16 200 2 t200 -6 v90 H0 Z" fill="url(#lnd${id})"/>
        <g fill="#94A3B8">
          <ellipse cx="86" cy="192" rx="36" ry="30"/>
          <ellipse cx="124" cy="204" rx="24" ry="20" fill="#64748B"/>
          <ellipse cx="300" cy="186" rx="28" ry="24"/>
          <ellipse cx="326" cy="200" rx="18" ry="15" fill="#64748B"/>
        </g>
        <g opacity="0.3" stroke="#fff" stroke-width="2" stroke-linecap="round">
          <path d="M160 170 h40"/><path d="M230 158 h30"/>
        </g>
        <g opacity="0.45" fill="${pal.land[1]}">
          <ellipse cx="200" cy="252" rx="120" ry="6"/>
        </g>`;
    },

    // Senja kota / kuliner malam
    sunset(id, pal) {
      return `
        <rect width="400" height="300" fill="url(#sky${id})"/>
        <circle cx="200" cy="158" r="48" fill="${pal.sun}" opacity="0.95"/>
        <circle cx="200" cy="158" r="76" fill="${pal.sun}" opacity="0.18"/>
        <g opacity="0.3" fill="${pal.land[0]}">
          <ellipse cx="90" cy="68" rx="54" ry="10"/><ellipse cx="310" cy="92" rx="66" ry="11"/>
        </g>
        <path d="M0 196 q60 -18 120 -4 t140 -10 t140 12 v106 H0 Z" fill="url(#lnd${id})" opacity="0.5"/>
        <g fill="url(#lnd${id})">
          <rect x="18" y="186" width="42" height="114"/>
          <rect x="70" y="212" width="34" height="88"/>
          <rect x="116" y="196" width="28" height="104"/>
          <rect x="258" y="204" width="38" height="96"/>
          <rect x="306" y="180" width="30" height="120"/>
          <rect x="346" y="214" width="40" height="86"/>
        </g>
        <g fill="${pal.sun}" opacity="0.75">
          <rect x="28" y="198" width="7" height="9"/><rect x="42" y="198" width="7" height="9"/>
          <rect x="28" y="216" width="7" height="9"/><rect x="42" y="232" width="7" height="9"/>
          <rect x="80" y="226" width="7" height="9"/><rect x="90" y="244" width="7" height="9"/>
          <rect x="124" y="210" width="7" height="9"/><rect x="134" y="228" width="7" height="9"/>
          <rect x="268" y="218" width="7" height="9"/><rect x="280" y="236" width="7" height="9"/>
          <rect x="314" y="194" width="7" height="9"/><rect x="324" y="212" width="7" height="9"/>
          <rect x="356" y="228" width="7" height="9"/><rect x="370" y="246" width="7" height="9"/>
        </g>
        <rect y="284" width="400" height="16" fill="${pal.land[1]}"/>`;
    }
  };

  function render(type) {
    const key = builders[type] ? type : 'ocean';
    const pal = P[key] || P.ocean;
    const id = ++uid;
    return `<svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"
                 xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
              ${defs(id, pal)}${builders[key](id, pal)}
            </svg>`;
  }

  function mountAll(root) {
    (root || document).querySelectorAll('[data-scene]').forEach((el) => {
      if (el.dataset.sceneMounted) return;
      el.dataset.sceneMounted = '1';
      el.innerHTML = render(el.dataset.scene);
      /* Class .scene DITAMBAHKAN ke elemen host.
         CSS menulis aturan ukuran sebagai `.hero-art-card > .scene`, tapi di
         HTML host hanya ditandai `data-scene` — tanpa class, selector itu tidak
         pernah cocok dan host kehilangan tinggi (muncul celah putih di kartu). */
      el.classList.add('scene');
      el.style.overflow = 'hidden';
      const svg = el.firstElementChild;
      if (svg) { svg.style.width = '100%'; svg.style.height = '100%'; }
    });
  }

  window.KelanaScenes = { render, mountAll };
  document.addEventListener('DOMContentLoaded', () => mountAll(document));
})();
