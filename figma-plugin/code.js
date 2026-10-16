/* ==========================================================================
   KELANA DESIGN SYSTEM BUILDER — Figma Plugin
   Membangun Variables, Styles, Components, dan Frame halaman secara native
   di file Figma yang sedang terbuka.

   Cermin dari prototype/assets/css/tokens.css. Kalau palet di CSS berubah,
   ubah juga blok PALET di bawah supaya Figma dan kode tetap sinkron.
   ========================================================================== */

/* ------------------------------------------------------------------ logging */
function log(text, level) {
  figma.ui.postMessage({ type: 'log', text: text, level: level || null });
}

/* -------------------------------------------------------------------- PALET */
var OCEAN = {
  '50': '#EAF5FF', '100': '#D3EBFF', '200': '#ABD9FF', '300': '#7FC6FF',
  '400': '#55B5FF', '500': '#35A8FF', '600': '#1E8FE6', '700': '#1574BF',
  '800': '#115A94', '900': '#0D4470'
};
var KBLUE = {
  '50': '#EDF4FB', '100': '#D9E8F6', '200': '#B4CFEA', '300': '#8BB3DC',
  '400': '#629BCF', '500': '#4087C4', '600': '#336FA4', '700': '#285884',
  '800': '#1E4263', '900': '#152F47'
};
var ORANGE = {
  '50': '#FFF2EC', '100': '#FFE1D4', '200': '#FFC1A5', '300': '#FF9E76',
  '400': '#FF854C', '500': '#FF6B24', '600': '#E65411', '700': '#BC410A'
};
var NEUTRAL = { 'white': '#FFFFFF', 'cloud-100': '#F8FAFC', 'cloud-200': '#F1F5F9' };
var SLATE   = { '100': '#E8EEF4', '200': '#E2E8F0', '300': '#CBD5E1', '400': '#94A3B8', '500': '#64748B' };
var NAVY    = { '500': '#475569', '700': '#1E293B', '900': '#0F172A' };
var SEMANTIC = {
  'success/50': '#ECFDF3', 'success/100': '#C8EED8', 'success/500': '#16A34A', 'success/700': '#15803D',
  'warning/50': '#FFF8EB', 'warning/100': '#FBE3B6', 'warning/500': '#F59E0B', 'warning/700': '#A16207',
  'error/50': '#FEF2F2', 'error/500': '#DC2626',
  'info/50': '#EFF6FF', 'info/500': '#2563EB'
};

/* Alias semantik -> primitif. Dipakai untuk Variables beralias & paint styles. */
var ALIAS = {
  'bg/canvas': 'neutral/cloud-100',
  'bg/surface': 'neutral/white',
  'bg/surface-alt': 'neutral/cloud-200',
  'bg/inverse': 'navy/900',
  'bg/ice': 'ocean/50',
  'bg/brand': 'ocean/500',
  'bg/brand-soft': 'ocean/50',
  'bg/brand-alt': 'kelana-blue/500',
  'bg/accent': 'orange/500',
  'bg/accent-soft': 'orange/50',
  'text/primary': 'navy/900',
  'text/secondary': 'slate/500',
  'text/tertiary': 'slate/400',
  'text/on-brand': 'neutral/white',
  'text/brand': 'ocean/700',
  'text/brand-alt': 'kelana-blue/600',
  'text/accent': 'orange/600',
  'border/subtle': 'slate/100',
  'border/default': 'slate/200',
  'border/strong': 'slate/300',
  'border/brand': 'ocean/500',
  'border/brand-alt': 'kelana-blue/500',
  'control/bg': 'neutral/white',
  'control/border': 'slate/200',
  'control/border-focus': 'ocean/500',
  'control/bg-selected': 'ocean/50',
  'control/accent': 'kelana-blue/500',
  'disabled/bg': 'neutral/cloud-200',
  'disabled/text': 'slate/400',
  'disabled/border': 'slate/200'
};

var SPACE = {
  '25': 2, '50': 4, '100': 8, '150': 12, '200': 16, '250': 20, '300': 24,
  '400': 32, '500': 40, '600': 48, '800': 64, '1000': 80, '1200': 96, '1600': 128
};
var RADIUS = { 'xs': 6, 'sm': 8, 'md': 12, 'lg': 16, 'xl': 24, '2xl': 32, 'full': 999 };

var SHADOWS = {
  'shadow/xs': { y: 1, blur: 2, color: '#0F172A', a: 0.04 },
  'shadow/sm': { y: 1, blur: 3, color: '#0F172A', a: 0.06 },
  'shadow/md': { y: 4, blur: 12, color: '#0F172A', a: 0.07 },
  'shadow/lg': { y: 10, blur: 24, color: '#0F172A', a: 0.08 },
  'shadow/xl': { y: 20, blur: 44, color: '#0F172A', a: 0.12 },
  'shadow/brand': { y: 4, blur: 12, color: '#35A8FF', a: 0.24 },
  'shadow/accent': { y: 4, blur: 12, color: '#FF6B24', a: 0.24 }
};

/* Skala teks: [ukuran, line-height, bobot, letter-spacing %] */
var TEXT = {
  'display':  [60, 64, 'ExtraBold', -3],
  'h1':       [48, 56, 'ExtraBold', -2.5],
  'h2':       [36, 44, 'Bold', -2],
  'h3':       [28, 36, 'Bold', -1.5],
  'h4':       [22, 30, 'Bold', -1],
  'h5':       [18, 26, 'SemiBold', 0],
  'body-lg':  [18, 28, 'Regular', 0],
  'body':     [16, 26, 'Regular', 0],
  'body-sm':  [14, 22, 'Regular', 0],
  'caption':  [12, 18, 'Regular', 0],
  'overline': [12, 16, 'Bold', 10],
  'button':   [14, 20, 'Bold', -1]
};

/* -------------------------------------------------------------------- IKON */
/* mode 'stroke' = garis 1.8px; mode 'fill' = bidang penuh */
var ICONS = {
  search:    ['stroke', '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'],
  pin:       ['stroke', '<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'],
  calendar:  ['stroke', '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>'],
  users:     ['stroke', '<circle cx="9" cy="8" r="3.4"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M17 8.5a3 3 0 0 1 0 5.6M18 20c0-2 .6-3.6-1-4.8"/>'],
  star:      ['fill',   '<path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8Z"/>'],
  heart:     ['stroke', '<path d="M12 20s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.9C19.5 15.4 12 20 12 20Z"/>'],
  heartFill: ['fill',   '<path d="M12 20s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.9C19.5 15.4 12 20 12 20Z"/>'],
  share:     ['stroke', '<path d="M12 3v11"/><path d="m8 7 4-4 4 4"/><path d="M5 14v4a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4"/>'],
  clock:     ['stroke', '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'],
  chevR:     ['stroke', '<path d="m9 5 7 7-7 7"/>'],
  chevL:     ['stroke', '<path d="m15 5-7 7 7 7"/>'],
  chevD:     ['stroke', '<path d="m5 9 7 7 7-7"/>'],
  arrowR:    ['stroke', '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>'],
  plus:      ['stroke', '<path d="M12 5v14M5 12h14"/>'],
  check:     ['stroke', '<path d="m4.5 12.5 5 5 10-11"/>'],
  x:         ['stroke', '<path d="M6 6l12 12M18 6 6 18"/>'],
  menu:      ['stroke', '<path d="M4 7h16M4 12h16M4 17h16"/>'],
  sparkle:   ['stroke', '<path d="M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7Z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z"/>'],
  compass:   ['stroke', '<circle cx="12" cy="12" r="8.5"/><path d="m15 9-2 4.4-4.4 2 2-4.4Z"/>'],
  route:     ['stroke', '<circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="6" r="2.4"/><path d="M8.4 18H14a3.6 3.6 0 0 0 0-7.2h-4A3.4 3.4 0 0 1 10 4h5.6"/>'],
  wallet:    ['stroke', '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/>'],
  filter:    ['stroke', '<path d="M4 6h16M7 12h10M10 18h4"/>'],
  grip:      ['fill',   '<circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/>'],
  car:       ['stroke', '<path d="M4 16v-3l2-5h12l2 5v3"/><path d="M3 16h18"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>'],
  plane:     ['stroke', '<path d="M3 13l18-7-7 18-2.5-7.5L3 13Z"/>'],
  food:      ['stroke', '<path d="M7 3v8a2.5 2.5 0 0 0 5 0V3"/><path d="M9.5 11v10"/><path d="M16 3c2 1.5 2.5 4 2 6.5-.3 1.6-1 2-1 3.5v8"/>'],
  bed:       ['stroke', '<path d="M3 18v-7h12a4 4 0 0 1 4 4v3"/><path d="M3 18h18"/><path d="M3 11V7"/><circle cx="7.5" cy="8.5" r="1.8"/>'],
  camera:    ['stroke', '<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.5" r="3.4"/><path d="M9 7l1.2-2.5h3.6L15 7"/>'],
  shield:    ['stroke', '<path d="M12 21s7-3 7-9V6l-7-3-7 3v6c0 6 7 9 7 9Z"/><path d="m9 12 2 2 4-4"/>'],
  globe:     ['stroke', '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.4 2.4 14.6 0 17-2.4-2.4-2.4-14.6 0-17Z"/>'],
  download:  ['stroke', '<path d="M12 4v11"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/>'],
  edit:      ['stroke', '<path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4 16.5V20Z"/><path d="m14.5 6.5 3 3"/>'],
  trash:     ['stroke', '<path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6 7l1 13h10l1-13"/>'],
  offline:   ['stroke', '<path d="M5 18a4 4 0 0 1 .6-8 6 6 0 0 1 11.3-1.3A3.8 3.8 0 0 1 19 18"/><path d="M12 12v6"/><path d="m9.5 15.5 2.5 2.5 2.5-2.5"/>'],
  sun:       ['stroke', '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>'],
  info:      ['stroke', '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><path d="M12 7.6v.9"/>'],
  chat:      ['stroke', '<path d="M20 12a7 7 0 0 1-7 7H8l-4 2 1-4.2A7 7 0 0 1 13 5a7 7 0 0 1 7 7Z"/>'],
  logo:      ['fill',   '<path d="M12 6.4 16.8 12 12 17.6 7.2 12Z"/>']
};

/* ---------------------------------------------------------------- HELPERS */
function rgb(hex) {
  var h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255
  };
}
function solid(hex, opacity) {
  var p = { type: 'SOLID', color: rgb(hex) };
  if (opacity !== undefined) p.opacity = opacity;
  return p;
}

/* Font: coba Plus Jakarta Sans, jatuh ke Inter kalau tidak tersedia. */
var FONT = { family: 'Inter', styles: {} };

function mapStyle(name) {
  return FONT.styles[name] || FONT.styles['Regular'] || 'Regular';
}
function font(weight) {
  return { family: FONT.family, style: mapStyle(weight) };
}

function loadFonts() {
  var needed = ['Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold'];
  var candidates = [
    { family: 'Plus Jakarta Sans', map: { Regular: 'Regular', Medium: 'Medium', SemiBold: 'SemiBold', Bold: 'Bold', ExtraBold: 'ExtraBold' } },
    { family: 'Inter', map: { Regular: 'Regular', Medium: 'Medium', SemiBold: 'Semi Bold', Bold: 'Bold', ExtraBold: 'Extra Bold' } },
    { family: 'Inter', map: { Regular: 'Regular', Medium: 'Medium', SemiBold: 'Bold', Bold: 'Bold', ExtraBold: 'Black' } },
    { family: 'Roboto', map: { Regular: 'Regular', Medium: 'Medium', SemiBold: 'Medium', Bold: 'Bold', ExtraBold: 'Black' } }
  ];

  function tryCandidate(i) {
    if (i >= candidates.length) {
      log('Tidak ada font yang bisa dimuat. Teks mungkin gagal dibuat.', 'err');
      return Promise.resolve(false);
    }
    var c = candidates[i];
    var loads = needed.map(function (n) {
      return figma.loadFontAsync({ family: c.family, style: c.map[n] });
    });
    return Promise.all(loads).then(function () {
      FONT.family = c.family;
      FONT.styles = c.map;
      if (c.family !== 'Plus Jakarta Sans') {
        log('Plus Jakarta Sans tidak tersedia — memakai ' + c.family + '.', 'warn');
        log('Pasang Plus Jakarta Sans lalu ganti font style agar sesuai brand.', 'warn');
      } else {
        log('Font: Plus Jakarta Sans', 'ok');
      }
      return true;
    }).catch(function () {
      return tryCandidate(i + 1);
    });
  }
  return tryCandidate(0);
}

function getPage(name) {
  var pages = figma.root.children;
  for (var i = 0; i < pages.length; i++) {
    if (pages[i].name === name) return pages[i];
  }
  var p = figma.createPage();
  p.name = name;
  return p;
}

/* Nama style yang sudah ada — supaya menjalankan plugin dua kali tidak
   menumpuk duplikat. Kalau getter-nya tidak tersedia (API berubah), kita
   lanjut tanpa dedupe daripada gagal total. */
function existingStyleNames() {
  var set = {};
  try {
    var groups = [
      figma.getLocalPaintStyles(),
      figma.getLocalTextStyles(),
      figma.getLocalEffectStyles()
    ];
    for (var g = 0; g < groups.length; g++) {
      for (var i = 0; i < groups[g].length; i++) set[groups[g][i].name] = true;
    }
  } catch (e) {
    log('Tidak bisa membaca style yang ada — dedupe dilewati.', 'warn');
  }
  return set;
}

/* Apakah halaman sudah berisi node dengan nama ini? Dipakai supaya
   menjalankan plugin ulang tidak menumpuk komponen/frame ganda. */
function pageHas(page, name) {
  try {
    return !!page.findOne(function (n) { return n.name === name; });
  } catch (e) { return false; }
}

function existingCollection(name) {
  try {
    var cols = figma.variables.getLocalVariableCollections();
    for (var i = 0; i < cols.length; i++) {
      if (cols[i].name === name) return cols[i];
    }
  } catch (e) {}
  return null;
}

/* Frame dengan auto-layout */
function af(name, dir, opts) {
  opts = opts || {};
  var f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir;
  f.primaryAxisSizingMode = opts.primary || 'AUTO';
  f.counterAxisSizingMode = opts.counter || 'AUTO';
  f.itemSpacing = opts.gap || 0;
  f.paddingTop = opts.pt !== undefined ? opts.pt : (opts.py || 0);
  f.paddingBottom = opts.pb !== undefined ? opts.pb : (opts.py || 0);
  f.paddingLeft = opts.pl !== undefined ? opts.pl : (opts.px || 0);
  f.paddingRight = opts.pr !== undefined ? opts.pr : (opts.px || 0);
  if (opts.align) f.counterAxisAlignItems = opts.align;
  if (opts.justify) f.primaryAxisAlignItems = opts.justify;
  if (opts.radius !== undefined) f.cornerRadius = opts.radius;
  f.fills = opts.fill ? [solid(opts.fill)] : [];
  if (opts.stroke) {
    f.strokes = [solid(opts.stroke)];
    f.strokeWeight = opts.strokeWeight || 1;
  }
  if (opts.wrap) { try { f.layoutWrap = 'WRAP'; } catch (e) {} }
  return f;
}

function tx(chars, styleKey, color, opts) {
  opts = opts || {};
  var spec = TEXT[styleKey] || TEXT['body'];
  var t = figma.createText();
  t.fontName = font(spec[2]);
  t.fontSize = spec[0];
  t.lineHeight = { value: spec[1], unit: 'PIXELS' };
  t.letterSpacing = { value: spec[3], unit: 'PERCENT' };
  if (styleKey === 'overline') t.textCase = 'UPPER';
  t.characters = chars;
  t.fills = [solid(color || NAVY['900'])];
  if (opts.width) {
    t.textAutoResize = 'HEIGHT';
    t.resize(opts.width, t.height);
  }
  return t;
}

function iconNode(name, hex, size) {
  var def = ICONS[name];
  if (!def) return null;
  var mode = def[0], inner = def[1];
  var attrs = mode === 'fill'
    ? 'fill="' + hex + '"'
    : 'fill="none" stroke="' + hex + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' + attrs + '>' + inner + '</svg>';
  var n = figma.createNodeFromSvg(svg);
  n.name = name;
  n.fills = [];
  /* resize() memotong isi frame; rescale() benar-benar menskalakan vektornya. */
  if (size && size !== 24) {
    try { n.rescale(size / 24); } catch (e) { n.resize(size, size); }
  }
  return n;
}

/* ====================================================================== */
/* FASE 1 — VARIABLES                                                     */
/* ====================================================================== */
function makeVar(name, col, type) {
  try { return figma.variables.createVariable(name, col, type); }
  catch (e) { return figma.variables.createVariable(name, col.id, type); }
}

function buildVariables() {
  if (!figma.variables) {
    log('API Variables tidak tersedia di versi Figma ini. Lewati fase 1.', 'err');
    return null;
  }

  if (existingCollection('Kelana Color')) {
    log('Koleksi "Kelana Color" sudah ada — fase Variables dilewati.', 'warn');
    log('Hapus koleksi itu dulu kalau mau dibangun ulang.', 'warn');
    return null;
  }
  var colorCol = figma.variables.createVariableCollection('Kelana Color');
  var mode = colorCol.modes[0].modeId;
  try { colorCol.renameMode(mode, 'Light'); } catch (e) {}

  var created = {};
  function addColor(name, hex) {
    var v = makeVar(name, colorCol, 'COLOR');
    v.setValueForMode(mode, rgb(hex));
    created[name] = v;
    return v;
  }

  var ramps = [
    ['ocean', OCEAN], ['kelana-blue', KBLUE], ['orange', ORANGE],
    ['slate', SLATE], ['navy', NAVY]
  ];
  for (var i = 0; i < ramps.length; i++) {
    var prefix = ramps[i][0], map = ramps[i][1];
    for (var k in map) addColor(prefix + '/' + k, map[k]);
  }
  for (var n in NEUTRAL) addColor('neutral/' + n, NEUTRAL[n]);
  for (var s in SEMANTIC) addColor(s, SEMANTIC[s]);

  var primitiveCount = Object.keys(created).length;

  /* Alias semantik — mengacu ke primitif, bukan menyalin nilainya.
     Ini yang membuat tema bisa diganti dari satu tempat. */
  var aliasCount = 0;
  for (var a in ALIAS) {
    var target = created[ALIAS[a]];
    if (!target) { log('Alias dilewati (target hilang): ' + a, 'warn'); continue; }
    var v = makeVar(a, colorCol, 'COLOR');
    try {
      v.setValueForMode(mode, { type: 'VARIABLE_ALIAS', id: target.id });
      aliasCount++;
    } catch (e) {
      v.setValueForMode(mode, rgb(OCEAN['500']));
      log('Alias gagal, nilai disalin: ' + a, 'warn');
    }
  }

  /* Spacing & radius */
  var numCol = figma.variables.createVariableCollection('Kelana Layout');
  var nmode = numCol.modes[0].modeId;
  try { numCol.renameMode(nmode, 'Default'); } catch (e) {}
  var numCount = 0;
  for (var sp in SPACE) { makeVar('space/' + sp, numCol, 'FLOAT').setValueForMode(nmode, SPACE[sp]); numCount++; }
  for (var rd in RADIUS) { makeVar('radius/' + rd, numCol, 'FLOAT').setValueForMode(nmode, RADIUS[rd]); numCount++; }

  log('Variables: ' + primitiveCount + ' warna primitif, ' + aliasCount + ' alias semantik, ' + numCount + ' layout', 'ok');
  return created;
}

/* ====================================================================== */
/* FASE 2 — STYLES                                                        */
/* ====================================================================== */
function buildStyles() {
  var have = existingStyleNames();
  var paints = 0, skipped = 0;
  function paintStyle(name, hex) {
    if (have[name]) { skipped++; return; }
    var ps = figma.createPaintStyle();
    ps.name = name;
    ps.paints = [solid(hex)];
    paints++;
  }

  var all = {};
  for (var k in OCEAN) all['ocean/' + k] = OCEAN[k];
  for (var k2 in KBLUE) all['kelana-blue/' + k2] = KBLUE[k2];
  for (var k3 in ORANGE) all['orange/' + k3] = ORANGE[k3];
  for (var k4 in NEUTRAL) all['neutral/' + k4] = NEUTRAL[k4];
  for (var k5 in SLATE) all['slate/' + k5] = SLATE[k5];
  for (var k6 in NAVY) all['navy/' + k6] = NAVY[k6];
  for (var k7 in SEMANTIC) all[k7] = SEMANTIC[k7];
  for (var name in all) paintStyle(name, all[name]);

  /* Alias sebagai paint style terpisah supaya peran warna terbaca jelas */
  for (var a in ALIAS) paintStyle(a, all[ALIAS[a]]);

  var texts = 0;
  for (var t in TEXT) {
    if (have['text/' + t]) { skipped++; continue; }
    var spec = TEXT[t];
    var ts = figma.createTextStyle();
    ts.name = 'text/' + t;
    ts.fontName = font(spec[2]);
    ts.fontSize = spec[0];
    ts.lineHeight = { value: spec[1], unit: 'PIXELS' };
    ts.letterSpacing = { value: spec[3], unit: 'PERCENT' };
    if (t === 'overline') ts.textCase = 'UPPER';
    texts++;
  }

  var effects = 0;
  for (var sh in SHADOWS) {
    if (have[sh]) { skipped++; continue; }
    var d = SHADOWS[sh];
    var es = figma.createEffectStyle();
    es.name = sh;
    var c = rgb(d.color);
    es.effects = [{
      type: 'DROP_SHADOW',
      color: { r: c.r, g: c.g, b: c.b, a: d.a },
      offset: { x: 0, y: d.y },
      radius: d.blur,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL'
    }];
    effects++;
  }

  log('Styles: ' + paints + ' paint, ' + texts + ' text, ' + effects + ' effect', 'ok');
  if (skipped) log('  ' + skipped + ' style dilewati karena namanya sudah ada', 'warn');
}

/* ====================================================================== */
/* FASE 3 — IKON                                                          */
/* ====================================================================== */
function buildIcons() {
  var page = getPage('🎨 Foundations');
  figma.currentPage = page;
  if (pageHas(page, 'Icons')) {
    log('Frame "Icons" sudah ada — fase ikon dilewati.', 'warn');
    return 0;
  }
  var wrap = af('Icons', 'HORIZONTAL', {
    gap: 16, px: 24, py: 24, fill: NEUTRAL['white'],
    radius: 16, stroke: SLATE['200'], wrap: true
  });
  wrap.primaryAxisSizingMode = 'FIXED';   /* lebar tetap -> wrap aktif */
  wrap.counterAxisSizingMode = 'AUTO';    /* tinggi menyesuaikan isi */
  wrap.resize(720, 100);
  page.appendChild(wrap);

  var made = 0;
  for (var name in ICONS) {
    try {
      var n = iconNode(name, NAVY['900'], 24);
      if (!n) continue;
      var comp = figma.createComponent();
      comp.name = 'Icon/' + name;
      comp.resize(24, 24);
      comp.fills = [];
      while (n.children.length) comp.appendChild(n.children[0]);
      n.remove();
      wrap.appendChild(comp);
      made++;
    } catch (e) {
      log('Ikon gagal: ' + name + ' — ' + e.message, 'warn');
    }
  }
  log('Ikon: ' + made + ' component dibuat', 'ok');
  return made;
}

/* ====================================================================== */
/* FASE 4 — KOMPONEN                                                      */
/* ====================================================================== */
var BTN = {
  primary:   { bg: OCEAN['500'],  fg: NEUTRAL['white'], br: null,          hover: OCEAN['600'] },
  secondary: { bg: NEUTRAL['white'], fg: KBLUE['500'],  br: KBLUE['500'],  hover: OCEAN['50'] },
  accent:    { bg: ORANGE['500'], fg: NEUTRAL['white'], br: null,          hover: ORANGE['600'] },
  ghost:     { bg: null,          fg: NAVY['900'],      br: null,          hover: OCEAN['50'] }
};
var BTN_SIZE = { sm: [38, 16, 'caption'], md: [48, 24, 'button'], lg: [56, 32, 'body'] };

function buildButton(parent) {
  var variants = [];
  for (var v in BTN) {
    for (var s in BTN_SIZE) {
      for (var st = 0; st < 3; st++) {
        var state = ['default', 'hover', 'disabled'][st];
        var cfg = BTN[v], sz = BTN_SIZE[s];
        var bg = cfg.bg, fg = cfg.fg, br = cfg.br;
        if (state === 'hover') { bg = cfg.hover; if (v === 'secondary') { br = KBLUE['600']; fg = KBLUE['700']; } if (v === 'ghost') fg = KBLUE['600']; }
        if (state === 'disabled') { bg = NEUTRAL['cloud-200']; fg = SLATE['400']; br = SLATE['200']; }

        var c = figma.createComponent();
        c.name = 'variant=' + v + ', size=' + s + ', state=' + state;
        c.layoutMode = 'HORIZONTAL';
        c.primaryAxisSizingMode = 'AUTO';
        c.counterAxisSizingMode = 'FIXED';
        c.resize(120, sz[0]);
        c.counterAxisAlignItems = 'CENTER';
        c.primaryAxisAlignItems = 'CENTER';
        c.itemSpacing = 8;
        c.paddingLeft = sz[1]; c.paddingRight = sz[1];
        c.cornerRadius = 999;
        c.fills = bg ? [solid(bg)] : [];
        if (br) { c.strokes = [solid(br)]; c.strokeWeight = 1.5; }
        c.appendChild(tx('Label', sz[2], fg));
        variants.push(c);
      }
    }
  }
  var set = figma.combineAsVariants(variants, parent);
  set.name = 'Button';
  set.layoutMode = 'VERTICAL';
  set.itemSpacing = 12;
  set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 20;
  set.fills = [solid(NEUTRAL['cloud-100'])];
  return variants.length;
}

var BADGE = {
  brand:   [OCEAN['50'], OCEAN['700']],
  accent:  [ORANGE['50'], ORANGE['700']],
  neutral: [NEUTRAL['cloud-200'], NAVY['700']],
  success: [SEMANTIC['success/50'], SEMANTIC['success/700']],
  warning: [SEMANTIC['warning/50'], SEMANTIC['warning/700']],
  info:    [SEMANTIC['info/50'], SEMANTIC['info/500']]
};

function buildBadge(parent) {
  var variants = [];
  for (var tone in BADGE) {
    var c = figma.createComponent();
    c.name = 'tone=' + tone;
    c.layoutMode = 'HORIZONTAL';
    c.primaryAxisSizingMode = 'AUTO';
    c.counterAxisSizingMode = 'AUTO';
    c.counterAxisAlignItems = 'CENTER';
    c.itemSpacing = 6;
    c.paddingLeft = 12; c.paddingRight = 12;
    c.paddingTop = 5; c.paddingBottom = 5;
    c.cornerRadius = 999;
    c.fills = [solid(BADGE[tone][0])];
    c.appendChild(tx('Badge', 'caption', BADGE[tone][1]));
    variants.push(c);
  }
  var set = figma.combineAsVariants(variants, parent);
  set.name = 'Badge';
  set.layoutMode = 'HORIZONTAL';
  set.itemSpacing = 12;
  set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 20;
  set.fills = [solid(NEUTRAL['cloud-100'])];
  return variants.length;
}

function buildChip(parent) {
  var variants = [];
  var states = [
    ['default', NEUTRAL['white'], NAVY['700'], SLATE['200']],
    ['selected', KBLUE['500'], NEUTRAL['white'], KBLUE['500']]
  ];
  for (var i = 0; i < states.length; i++) {
    var st = states[i];
    var c = figma.createComponent();
    c.name = 'state=' + st[0];
    c.layoutMode = 'HORIZONTAL';
    c.primaryAxisSizingMode = 'AUTO';
    c.counterAxisSizingMode = 'FIXED';
    c.resize(110, 40);
    c.counterAxisAlignItems = 'CENTER';
    c.primaryAxisAlignItems = 'CENTER';
    c.paddingLeft = 16; c.paddingRight = 16;
    c.cornerRadius = 999;
    c.fills = [solid(st[1])];
    c.strokes = [solid(st[3])];
    c.strokeWeight = 1.5;
    c.appendChild(tx('Filter', 'body-sm', st[2]));
    variants.push(c);
  }
  var set = figma.combineAsVariants(variants, parent);
  set.name = 'Chip';
  set.layoutMode = 'HORIZONTAL';
  set.itemSpacing = 12;
  set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 20;
  set.fills = [solid(NEUTRAL['cloud-100'])];
  return variants.length;
}

function buildInput(parent) {
  var variants = [];
  var states = [
    ['default', SLATE['200'], SLATE['400'], 'Placeholder'],
    ['focus', OCEAN['500'], NAVY['900'], 'Sedang diisi'],
    ['error', SEMANTIC['error/500'], NAVY['900'], 'Nilai tidak valid'],
    ['disabled', SLATE['200'], SLATE['400'], 'Tidak aktif']
  ];
  for (var i = 0; i < states.length; i++) {
    var st = states[i];
    var c = figma.createComponent();
    c.name = 'state=' + st[0];
    c.layoutMode = 'HORIZONTAL';
    c.primaryAxisSizingMode = 'FIXED';
    c.counterAxisSizingMode = 'FIXED';
    c.resize(320, 52);
    c.counterAxisAlignItems = 'CENTER';
    c.paddingLeft = 16; c.paddingRight = 16;
    c.cornerRadius = 12;
    c.fills = [solid(st[0] === 'disabled' ? NEUTRAL['cloud-200'] : NEUTRAL['white'])];
    c.strokes = [solid(st[1])];
    c.strokeWeight = 1.5;
    c.appendChild(tx(st[3], 'body', st[2]));
    variants.push(c);
  }
  var set = figma.combineAsVariants(variants, parent);
  set.name = 'Input';
  set.layoutMode = 'VERTICAL';
  set.itemSpacing = 12;
  set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 20;
  set.fills = [solid(NEUTRAL['cloud-100'])];
  return variants.length;
}

/* Placeholder gambar destinasi — di Figma diganti image fill foto asli */
function scenePlaceholder(w, h, label) {
  var f = af('Image fill — ganti dengan foto', 'VERTICAL', {
    fill: OCEAN['200'], justify: 'CENTER', align: 'CENTER'
  });
  f.primaryAxisSizingMode = 'FIXED';
  f.counterAxisSizingMode = 'FIXED';
  f.resize(w, h);
  if (label) f.appendChild(tx(label, 'caption', OCEAN['800']));
  return f;
}

function buildItineraryCard(parent) {
  var c = figma.createComponent();
  c.name = 'Card/Itinerary';
  c.layoutMode = 'VERTICAL';
  c.primaryAxisSizingMode = 'AUTO';
  c.counterAxisSizingMode = 'FIXED';
  c.resize(380, 100);
  c.cornerRadius = 24;
  c.fills = [solid(NEUTRAL['white'])];
  c.strokes = [solid(SLATE['200'])];
  c.strokeWeight = 1;
  c.clipsContent = true;

  var media = scenePlaceholder(380, 285, 'Foto destinasi 4:3');
  media.layoutAlign = 'STRETCH';
  c.appendChild(media);

  var body = af('Body', 'VERTICAL', { gap: 12, px: 20, py: 20 });
  body.layoutAlign = 'STRETCH';
  body.counterAxisSizingMode = 'AUTO';

  var title = tx('Sailing Komodo: Padar, Pink Beach & Manta Point', 'h5', NAVY['900']);
  title.layoutAlign = 'STRETCH';
  title.textAutoResize = 'HEIGHT';
  body.appendChild(title);

  var meta = af('Meta', 'HORIZONTAL', { gap: 12, align: 'CENTER' });
  meta.appendChild(tx('4 hari 3 malam', 'caption', SLATE['500']));
  meta.appendChild(tx('·', 'caption', SLATE['300']));
  meta.appendChild(tx('11 titik', 'caption', SLATE['500']));
  body.appendChild(meta);

  var foot = af('Footer', 'HORIZONTAL', { gap: 12, justify: 'SPACE_BETWEEN', align: 'CENTER', pt: 12 });
  foot.layoutAlign = 'STRETCH';
  foot.counterAxisSizingMode = 'AUTO';
  var price = af('Price', 'VERTICAL', { gap: 0 });
  price.appendChild(tx('Rp 4,85 jt', 'h5', NAVY['900']));
  price.appendChild(tx('per orang', 'caption', SLATE['400']));
  foot.appendChild(price);
  foot.appendChild(tx('Lihat', 'button', KBLUE['500']));
  body.appendChild(foot);

  c.appendChild(body);
  parent.appendChild(c);
  return 1;
}

function buildGuideCard(parent) {
  var c = figma.createComponent();
  c.name = 'Card/Guide';
  c.layoutMode = 'VERTICAL';
  c.primaryAxisSizingMode = 'AUTO';
  c.counterAxisSizingMode = 'FIXED';
  c.resize(380, 100);
  c.cornerRadius = 24;
  c.fills = [solid(NEUTRAL['white'])];
  c.strokes = [solid(SLATE['200'])];
  c.strokeWeight = 1;

  var head = af('Head', 'HORIZONTAL', { gap: 16, px: 20, py: 20, align: 'CENTER' });
  head.layoutAlign = 'STRETCH';
  head.counterAxisSizingMode = 'AUTO';

  var photo = af('Foto pemandu', 'VERTICAL', { fill: OCEAN['500'], radius: 16, justify: 'CENTER', align: 'CENTER' });
  photo.primaryAxisSizingMode = 'FIXED';
  photo.counterAxisSizingMode = 'FIXED';
  photo.resize(72, 72);
  photo.appendChild(tx('YN', 'h4', NEUTRAL['white']));
  head.appendChild(photo);

  var info = af('Info', 'VERTICAL', { gap: 4 });
  info.layoutGrow = 1;
  info.appendChild(tx('Yanto Nugraha', 'h5', NAVY['900']));
  info.appendChild(tx('Labuan Bajo, NTT', 'caption', SLATE['500']));
  info.appendChild(tx('4,9 · 284 trip', 'caption', SLATE['500']));
  head.appendChild(info);
  c.appendChild(head);

  var foot = af('Footer', 'HORIZONTAL', { gap: 12, px: 20, py: 16, justify: 'SPACE_BETWEEN', align: 'CENTER', fill: NEUTRAL['cloud-100'] });
  foot.layoutAlign = 'STRETCH';
  foot.counterAxisSizingMode = 'AUTO';
  var p = af('Price', 'VERTICAL', { gap: 0 });
  p.appendChild(tx('Rp 650 rb', 'h5', NAVY['900']));
  p.appendChild(tx('per hari', 'caption', SLATE['400']));
  foot.appendChild(p);
  foot.appendChild(tx('Lihat profil', 'button', KBLUE['500']));
  c.appendChild(foot);

  parent.appendChild(c);
  return 1;
}

function buildNavbar(parent) {
  var c = figma.createComponent();
  c.name = 'Navbar';
  c.layoutMode = 'HORIZONTAL';
  c.primaryAxisSizingMode = 'FIXED';
  c.counterAxisSizingMode = 'FIXED';
  c.resize(1440, 76);
  c.counterAxisAlignItems = 'CENTER';
  c.paddingLeft = 80; c.paddingRight = 80;
  c.itemSpacing = 32;
  c.fills = [solid(NEUTRAL['white'])];

  var logo = af('Logo', 'HORIZONTAL', { gap: 12, align: 'CENTER' });
  var mark = af('Mark', 'VERTICAL', { fill: OCEAN['500'], radius: 12, justify: 'CENTER', align: 'CENTER' });
  mark.primaryAxisSizingMode = 'FIXED';
  mark.counterAxisSizingMode = 'FIXED';
  mark.resize(38, 38);
  var glyph = iconNode('logo', NEUTRAL['white'], 22);
  if (glyph) mark.appendChild(glyph);
  logo.appendChild(mark);
  var wordmark = af('Wordmark', 'HORIZONTAL', { gap: 0, align: 'CENTER' });
  wordmark.appendChild(tx('kelana', 'h4', NAVY['900']));
  wordmark.appendChild(tx('.', 'h4', ORANGE['500']));
  logo.appendChild(wordmark);
  c.appendChild(logo);

  var menu = af('Menu', 'HORIZONTAL', { gap: 4, align: 'CENTER' });
  var items = ['Beranda', 'Jelajah', 'Trip Saya', 'Booking'];
  for (var i = 0; i < items.length; i++) {
    var active = i === 0;
    var item = af(items[i], 'HORIZONTAL', {
      px: 16, py: 8, radius: 999, align: 'CENTER',
      fill: active ? OCEAN['50'] : null
    });
    item.appendChild(tx(items[i], 'button', active ? KBLUE['600'] : NAVY['700']));
    menu.appendChild(item);
  }
  c.appendChild(menu);

  var spacer = figma.createFrame();
  spacer.name = 'Spacer';
  spacer.fills = [];
  spacer.resize(10, 10);
  c.appendChild(spacer);
  spacer.layoutGrow = 1;

  var cta = af('CTA', 'HORIZONTAL', { gap: 8, align: 'CENTER' });
  var masuk = af('Masuk', 'HORIZONTAL', { px: 16, py: 10, radius: 999, align: 'CENTER' });
  masuk.appendChild(tx('Masuk', 'button', NAVY['900']));
  cta.appendChild(masuk);
  var daftar = af('Daftar gratis', 'HORIZONTAL', { px: 20, py: 11, radius: 999, align: 'CENTER', fill: OCEAN['500'] });
  daftar.appendChild(tx('Daftar gratis', 'button', NEUTRAL['white']));
  cta.appendChild(daftar);
  c.appendChild(cta);

  parent.appendChild(c);
  return 1;
}

function buildFooter(parent) {
  var c = figma.createComponent();
  c.name = 'Footer';
  c.layoutMode = 'HORIZONTAL';
  c.primaryAxisSizingMode = 'FIXED';
  c.counterAxisSizingMode = 'AUTO';
  c.resize(1440, 100);
  c.paddingLeft = 80; c.paddingRight = 80;
  c.paddingTop = 64; c.paddingBottom = 40;
  c.itemSpacing = 48;
  c.fills = [solid(NAVY['900'])];

  var brand = af('Brand', 'VERTICAL', { gap: 12 });
  brand.resize(320, 10);
  brand.counterAxisSizingMode = 'FIXED';
  var wm = af('Wordmark', 'HORIZONTAL', { gap: 0, align: 'CENTER' });
  wm.appendChild(tx('kelana', 'h4', NEUTRAL['white']));
  wm.appendChild(tx('.', 'h4', ORANGE['500']));
  brand.appendChild(wm);
  var desc = tx('Rencana perjalanan yang rapi, realistis, dan siap jalan.', 'body-sm', SLATE['300'], { width: 300 });
  brand.appendChild(desc);
  c.appendChild(brand);

  var cols = [
    ['Produk', ['Jelajah itinerary', 'Buat itinerary', 'Trip saya', 'Booking pemandu']],
    ['Destinasi', ['Labuan Bajo', 'Yogyakarta', 'Raja Ampat', 'Bali']],
    ['Perusahaan', ['Tentang kami', 'Karier', 'Pusat bantuan', 'Syarat & privasi']]
  ];
  for (var i = 0; i < cols.length; i++) {
    var col = af(cols[i][0], 'VERTICAL', { gap: 10 });
    col.appendChild(tx(cols[i][0], 'button', NEUTRAL['white']));
    for (var j = 0; j < cols[i][1].length; j++) {
      col.appendChild(tx(cols[i][1][j], 'body-sm', SLATE['300']));
    }
    c.appendChild(col);
  }

  parent.appendChild(c);
  return 1;
}

function buildComponents() {
  var page = getPage('🧩 Components');
  figma.currentPage = page;
  if (pageHas(page, 'Component Library')) {
    log('Frame "Component Library" sudah ada — fase komponen dilewati.', 'warn');
    return 0;
  }
  var root = af('Component Library', 'VERTICAL', { gap: 40, px: 40, py: 40, fill: NEUTRAL['white'] });
  root.counterAxisSizingMode = 'AUTO';
  page.appendChild(root);

  var total = 0;
  var steps = [
    ['Button', buildButton], ['Badge', buildBadge], ['Chip', buildChip], ['Input', buildInput],
    ['Card/Itinerary', buildItineraryCard], ['Card/Guide', buildGuideCard],
    ['Navbar', buildNavbar], ['Footer', buildFooter]
  ];
  for (var i = 0; i < steps.length; i++) {
    try {
      total += steps[i][1](root);
      log('  komponen ' + steps[i][0] + ' ok');
    } catch (e) {
      log('  komponen ' + steps[i][0] + ' GAGAL: ' + e.message, 'err');
    }
  }
  log('Komponen: ' + total + ' node dibuat', 'ok');
  return total;
}

/* ====================================================================== */
/* FASE 5 — FRAME HALAMAN                                                 */
/* ====================================================================== */
function findComponent(name) {
  var pages = figma.root.children;
  for (var p = 0; p < pages.length; p++) {
    var found = pages[p].findOne(function (n) {
      return (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && n.name === name;
    });
    if (found) return found;
  }
  return null;
}

function instance(name) {
  var c = findComponent(name);
  if (!c) return null;
  if (c.type === 'COMPONENT_SET') c = c.defaultVariant || c.children[0];
  return c.createInstance();
}

function sectionHeading(overline, title, sub) {
  var s = af('Heading', 'VERTICAL', { gap: 12 });
  s.appendChild(tx(overline, 'overline', ORANGE['600']));
  var h = tx(title, 'h2', NAVY['900']);
  s.appendChild(h);
  if (sub) s.appendChild(tx(sub, 'body', SLATE['500'], { width: 620 }));
  return s;
}

function pageShell(name) {
  var f = af(name, 'VERTICAL', { gap: 0, fill: NEUTRAL['cloud-100'] });
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'FIXED';
  f.resize(1440, 900);
  var nav = instance('Navbar');
  if (nav) { nav.layoutAlign = 'STRETCH'; f.appendChild(nav); }
  return f;
}

function cardGrid(count, compName, perRow) {
  var grid = af('Grid', 'HORIZONTAL', { gap: 24, wrap: true });
  grid.primaryAxisSizingMode = 'FIXED';
  grid.counterAxisSizingMode = 'AUTO';
  grid.resize(perRow * 380 + (perRow - 1) * 24, 100);
  for (var i = 0; i < count; i++) {
    var inst = instance(compName);
    if (inst) grid.appendChild(inst);
  }
  return grid;
}

function buildScreens() {
  var page = getPage('🖥 Screens');
  figma.currentPage = page;
  if (pageHas(page, 'Screens')) {
    log('Frame "Screens" sudah ada — fase frame halaman dilewati.', 'warn');
    return 0;
  }
  var board = af('Screens', 'HORIZONTAL', { gap: 80, px: 80, py: 80, fill: SLATE['100'] });
  board.counterAxisSizingMode = 'AUTO';
  page.appendChild(board);

  /* ---------- 01 Beranda ---------- */
  var beranda = pageShell('01 Beranda');

  var hero = af('Hero', 'HORIZONTAL', { gap: 64, px: 80, pt: 80, pb: 96, align: 'CENTER' });
  hero.layoutAlign = 'STRETCH';
  hero.counterAxisSizingMode = 'AUTO';
  var heroCopy = af('Copy', 'VERTICAL', { gap: 24 });
  heroCopy.layoutGrow = 1;
  var hb = af('Badge', 'HORIZONTAL', { px: 12, py: 5, radius: 999, fill: ORANGE['50'] });
  hb.appendChild(tx('1.240 itinerary · 87 destinasi · 34 provinsi', 'caption', ORANGE['700']));
  heroCopy.appendChild(hb);
  heroCopy.appendChild(tx('Rencana jalan-jalan yang beres dalam 5 menit', 'display', NAVY['900'], { width: 600 }));
  heroCopy.appendChild(tx('Kelana menyediakan template itinerary harian yang sudah teruji — lengkap dengan jam, rute, dan estimasi biaya.', 'body-lg', SLATE['500'], { width: 520 }));
  var heroCta = af('CTA', 'HORIZONTAL', { gap: 12 });
  var b1 = instance('Button'); if (b1) heroCta.appendChild(b1);
  var b2 = instance('Button'); if (b2) heroCta.appendChild(b2);
  heroCopy.appendChild(heroCta);
  hero.appendChild(heroCopy);
  hero.appendChild(scenePlaceholder(560, 420, 'Kolase foto destinasi'));
  beranda.appendChild(hero);

  var destSec = af('Destinasi', 'VERTICAL', { gap: 48, px: 80, py: 96, fill: NEUTRAL['white'] });
  destSec.layoutAlign = 'STRETCH';
  destSec.counterAxisSizingMode = 'AUTO';
  destSec.appendChild(sectionHeading('Destinasi wisata', 'Ke mana tujuanmu berikutnya?',
    'Tiap destinasi punya musim terbaik dan kisaran biaya yang berbeda.'));
  destSec.appendChild(cardGrid(3, 'Card/Itinerary', 3));
  beranda.appendChild(destSec);

  var itinSec = af('Itinerary unggulan', 'VERTICAL', { gap: 48, px: 80, py: 96, fill: NEUTRAL['cloud-100'] });
  itinSec.layoutAlign = 'STRETCH';
  itinSec.counterAxisSizingMode = 'AUTO';
  itinSec.appendChild(sectionHeading('Itinerary unggulan', 'Template siap pakai, tinggal jalan', null));
  itinSec.appendChild(cardGrid(3, 'Card/Itinerary', 3));
  beranda.appendChild(itinSec);

  var ft = instance('Footer');
  if (ft) { ft.layoutAlign = 'STRETCH'; beranda.appendChild(ft); }
  board.appendChild(beranda);

  /* ---------- 02 Jelajah ---------- */
  var jelajah = pageShell('02 Jelajah');
  var jHead = af('Head', 'VERTICAL', { gap: 24, px: 80, pt: 48, pb: 32, fill: NEUTRAL['white'] });
  jHead.layoutAlign = 'STRETCH';
  jHead.counterAxisSizingMode = 'AUTO';
  jHead.appendChild(sectionHeading('Jelajah', 'Itinerary Labuan Bajo & sekitarnya',
    '42 itinerary cocok dengan filtermu'));
  var chips = af('Filter', 'HORIZONTAL', { gap: 8 });
  for (var i = 0; i < 4; i++) { var ch = instance('Chip'); if (ch) chips.appendChild(ch); }
  jHead.appendChild(chips);
  jelajah.appendChild(jHead);

  var jBody = af('Hasil', 'VERTICAL', { gap: 24, px: 80, py: 48 });
  jBody.layoutAlign = 'STRETCH';
  jBody.counterAxisSizingMode = 'AUTO';
  jBody.appendChild(cardGrid(6, 'Card/Itinerary', 3));
  jelajah.appendChild(jBody);
  var ft2 = instance('Footer');
  if (ft2) { ft2.layoutAlign = 'STRETCH'; jelajah.appendChild(ft2); }
  board.appendChild(jelajah);

  /* ---------- 03 Booking ---------- */
  var booking = pageShell('03 Booking');
  var bHead = af('Head', 'VERTICAL', { gap: 24, px: 80, pt: 48, pb: 32, fill: NEUTRAL['white'] });
  bHead.layoutAlign = 'STRETCH';
  bHead.counterAxisSizingMode = 'AUTO';
  bHead.appendChild(sectionHeading('Booking', 'Jalan bareng orang yang tahu jalannya',
    'Sewa pemandu lokal, atau gabung open trip yang biayanya dibagi rata.'));
  booking.appendChild(bHead);

  var bBody = af('Pemandu', 'VERTICAL', { gap: 24, px: 80, py: 48 });
  bBody.layoutAlign = 'STRETCH';
  bBody.counterAxisSizingMode = 'AUTO';
  bBody.appendChild(cardGrid(6, 'Card/Guide', 3));
  booking.appendChild(bBody);
  var ft3 = instance('Footer');
  if (ft3) { ft3.layoutAlign = 'STRETCH'; booking.appendChild(ft3); }
  board.appendChild(booking);

  log('Frame halaman: 3 frame 1440px dibuat', 'ok');
  return 3;
}

/* ====================================================================== */
/* ORKESTRASI                                                             */
/* ====================================================================== */
function runPhase(phase) {
  var steps = [];
  if (phase === 'all') steps = ['variables', 'styles', 'icons', 'components', 'screens'];
  else steps = [phase];

  for (var i = 0; i < steps.length; i++) {
    var s = steps[i];
    log('— ' + s + ' —');
    try {
      if (s === 'variables') buildVariables();
      else if (s === 'styles') buildStyles();
      else if (s === 'icons') buildIcons();
      else if (s === 'components') buildComponents();
      else if (s === 'screens') buildScreens();
    } catch (e) {
      log('Fase "' + s + '" gagal: ' + e.message, 'err');
      log('Fase lain tetap bisa dijalankan terpisah.', 'warn');
    }
  }
  log('Selesai. Cek halaman Foundations, Components, dan Screens.', 'ok');
  figma.notify('Kelana: pembangunan selesai');
}

figma.showUI(__html__, { width: 320, height: 520 });

figma.ui.onmessage = function (msg) {
  if (msg.type !== 'run') return;

  /* Figma versi baru memuat halaman secara lazy. findOne() lintas halaman
     (dipakai untuk mencari component) butuh semua halaman sudah dimuat. */
  function preload() {
    if (typeof figma.loadAllPagesAsync === 'function') {
      return figma.loadAllPagesAsync().catch(function () { return null; });
    }
    return Promise.resolve(null);
  }

  preload()
    .then(loadFonts)
    .then(function () { runPhase(msg.phase); })
    .catch(function (e) {
      log('Gagal menyiapkan dokumen: ' + e.message, 'err');
    });
};
