/* ==========================================================================
   Harness uji untuk code.js — menjalankan seluruh fase plugin di Node
   dengan Figma Plugin API yang dipalsukan.

   Tujuannya bukan memverifikasi hasil visual (itu hanya bisa di Figma),
   tapi menangkap error runtime: properti salah, variabel belum terdefinisi,
   urutan pemanggilan yang keliru.

   Jalankan:  node figma-plugin/test/mock-run.js
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');

let nodeCount = 0;
const created = { frame: 0, text: 0, component: 0, svg: 0, page: 0, variantSet: 0 };
const styles = { paint: [], text: [], effect: [] };
const variables = { collections: [], vars: [] };
const logs = [];

/* ------------------------------------------------------------- mock node */
function makeNode(type) {
  nodeCount++;
  const n = {
    type,
    id: 'n' + nodeCount,
    name: '',
    children: [],
    parent: null,
    fills: [],
    strokes: [],
    strokeWeight: 1,
    cornerRadius: 0,
    width: 100,
    height: 100,
    clipsContent: false,
    layoutMode: 'NONE',
    layoutWrap: 'NO_WRAP',
    primaryAxisSizingMode: 'AUTO',
    counterAxisSizingMode: 'AUTO',
    primaryAxisAlignItems: 'MIN',
    counterAxisAlignItems: 'MIN',
    itemSpacing: 0,
    paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
    layoutAlign: 'INHERIT',
    layoutGrow: 0,
    characters: '',
    fontName: null,
    fontSize: 12,
    lineHeight: null,
    letterSpacing: null,
    textCase: 'ORIGINAL',
    textAutoResize: 'WIDTH_AND_HEIGHT',

    appendChild(c) {
      if (!c) throw new Error('appendChild dipanggil dengan ' + c);
      if (c.parent) c.parent.children = c.parent.children.filter((x) => x !== c);
      c.parent = this;
      this.children.push(c);
    },
    remove() {
      if (this.parent) this.parent.children = this.parent.children.filter((x) => x !== this);
    },
    resize(w, h) {
      if (typeof w !== 'number' || typeof h !== 'number') {
        throw new Error('resize butuh angka, dapat ' + w + ',' + h);
      }
      this.width = w; this.height = h;
    },
    rescale(f) {
      if (typeof f !== 'number' || f <= 0) throw new Error('rescale butuh faktor positif');
      this.width *= f; this.height *= f;
    },
    findOne(fn) {
      const walk = (node) => {
        for (const c of node.children) {
          if (fn(c)) return c;
          const r = walk(c);
          if (r) return r;
        }
        return null;
      };
      return walk(this);
    },
    createInstance() {
      const i = makeNode('INSTANCE');
      i.name = this.name;
      return i;
    }
  };
  return n;
}

/* ----------------------------------------------------------- mock figma */
const pagesList = [];

function newPage(name) {
  const p = makeNode('PAGE');
  p.name = name || ('Page ' + (pagesList.length + 1));
  pagesList.push(p);
  created.page++;
  return p;
}

const firstPage = newPage('Page 1');

const figma = {
  root: { get children() { return pagesList; }, name: 'Mock File' },
  currentPage: firstPage,

  createPage: () => newPage(),
  createFrame: () => { created.frame++; return makeNode('FRAME'); },
  createText: () => { created.text++; return makeNode('TEXT'); },
  createComponent: () => {
    created.component++;
    const c = makeNode('COMPONENT');
    figma.currentPage.appendChild(c);
    return c;
  },

  createNodeFromSvg(svg) {
    if (typeof svg !== 'string' || svg.indexOf('<svg') !== 0) {
      throw new Error('createNodeFromSvg: SVG tidak valid');
    }
    created.svg++;
    const f = makeNode('FRAME');
    // Palsukan beberapa anak vektor agar pemindahan anak bisa diuji
    const inner = (svg.match(/<(path|circle|rect)\b/g) || []).length || 1;
    for (let i = 0; i < inner; i++) f.appendChild(makeNode('VECTOR'));
    return f;
  },

  combineAsVariants(nodes, parent) {
    if (!Array.isArray(nodes) || nodes.length === 0) {
      throw new Error('combineAsVariants: butuh array komponen tidak kosong');
    }
    nodes.forEach((n) => {
      if (n.type !== 'COMPONENT') throw new Error('combineAsVariants: bukan COMPONENT');
    });
    created.variantSet++;
    const set = makeNode('COMPONENT_SET');
    nodes.forEach((n) => set.appendChild(n));
    set.defaultVariant = nodes[0];
    if (parent) parent.appendChild(set);
    return set;
  },

  createPaintStyle() {
    const s = { name: '', paints: [] };
    styles.paint.push(s);
    return s;
  },
  createTextStyle() {
    const s = { name: '', fontName: null, fontSize: 0, lineHeight: null, letterSpacing: null, textCase: 'ORIGINAL' };
    styles.text.push(s);
    return s;
  },
  createEffectStyle() {
    const s = { name: '', effects: [] };
    styles.effect.push(s);
    return s;
  },
  getLocalPaintStyles: () => styles.paint,
  getLocalTextStyles: () => styles.text,
  getLocalEffectStyles: () => styles.effect,

  variables: {
    createVariableCollection(name) {
      const col = {
        id: 'col' + (variables.collections.length + 1),
        name,
        modes: [{ modeId: 'mode1', name: 'Mode 1' }],
        renameMode(id, n) { this.modes[0].name = n; }
      };
      variables.collections.push(col);
      return col;
    },
    createVariable(name, col, type) {
      if (!col || typeof col !== 'object' || !col.id) {
        throw new Error('createVariable: argumen koleksi tidak valid');
      }
      if (!['COLOR', 'FLOAT', 'STRING', 'BOOLEAN'].includes(type)) {
        throw new Error('createVariable: tipe tidak valid ' + type);
      }
      const v = {
        id: 'var' + (variables.vars.length + 1),
        name, type, values: {},
        setValueForMode(modeId, val) {
          if (val === undefined || val === null) throw new Error('setValueForMode: nilai kosong untuk ' + name);
          if (type === 'COLOR' && !val.type && (typeof val.r !== 'number')) {
            throw new Error('setValueForMode: warna tidak valid untuk ' + name);
          }
          if (type === 'FLOAT' && typeof val !== 'number') {
            throw new Error('setValueForMode: FLOAT butuh angka untuk ' + name);
          }
          this.values[modeId] = val;
        }
      };
      variables.vars.push(v);
      return v;
    },
    getLocalVariableCollections: () => variables.collections
  },

  loadFontAsync(f) {
    // Plus Jakarta Sans sengaja dibuat GAGAL, untuk menguji jalur fallback
    if (f.family === 'Plus Jakarta Sans') return Promise.reject(new Error('font tidak tersedia'));
    const ok = { Inter: ['Regular', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold'] };
    if (ok[f.family] && ok[f.family].includes(f.style)) return Promise.resolve();
    return Promise.reject(new Error('style tidak ada: ' + f.family + ' ' + f.style));
  },

  notify: (m) => logs.push('[notify] ' + m),
  showUI: () => {},
  ui: {
    onmessage: null,
    postMessage(msg) {
      if (msg && msg.type === 'log') logs.push((msg.level ? '[' + msg.level + '] ' : '') + msg.text);
    }
  }
};

/* --------------------------------------------------------------- jalankan */
const code = fs.readFileSync(path.join(__dirname, '..', 'code.js'), 'utf8');
const run = new Function('figma', '__html__', code);
run(figma, '<html></html>');

if (typeof figma.ui.onmessage !== 'function') {
  console.error('GAGAL: plugin tidak memasang figma.ui.onmessage');
  process.exit(1);
}

figma.ui.onmessage({ type: 'run', phase: 'all' });

// Beri waktu untuk rantai promise selesai
setTimeout(() => {
  const errors = logs.filter((l) => l.startsWith('[err]'));
  const warns = logs.filter((l) => l.startsWith('[warn]'));

  console.log('=== LOG PLUGIN ===');
  logs.forEach((l) => console.log('  ' + l));

  console.log('\n=== NODE YANG DIBUAT ===');
  console.log('  frame          : ' + created.frame);
  console.log('  text           : ' + created.text);
  console.log('  component      : ' + created.component);
  console.log('  variant set    : ' + created.variantSet);
  console.log('  svg (ikon)     : ' + created.svg);
  console.log('  halaman        : ' + created.page);

  console.log('\n=== STYLE & VARIABLE ===');
  console.log('  paint style    : ' + styles.paint.length);
  console.log('  text style     : ' + styles.text.length);
  console.log('  effect style   : ' + styles.effect.length);
  console.log('  koleksi var    : ' + variables.collections.map((c) => c.name).join(', '));
  console.log('  variable       : ' + variables.vars.length);

  // Pemeriksaan kewajaran
  const checks = [];
  checks.push(['tidak ada error', errors.length === 0]);
  checks.push(['38 ikon jadi SVG', created.svg >= 38]);
  checks.push(['button 36 varian', created.component >= 36 + 6 + 2 + 4]);
  checks.push(['variant set >= 4', created.variantSet >= 4]);
  checks.push(['paint style > 60', styles.paint.length > 60]);
  checks.push(['12 text style', styles.text.length === 12]);
  checks.push(['7 effect style', styles.effect.length === 7]);
  checks.push(['2 koleksi variable', variables.collections.length === 2]);
  checks.push(['variable > 90', variables.vars.length > 90]);
  checks.push(['3 halaman dibuat', created.page >= 4]); // 1 awal + 3 baru
  checks.push(['fallback font jalan', warns.some((w) => w.indexOf('Inter') !== -1)]);

  console.log('\n=== PEMERIKSAAN ===');
  let fail = 0;
  checks.forEach(([label, ok]) => {
    if (!ok) fail++;
    console.log('  ' + (ok ? 'ok  ' : 'GAGAL ') + label);
  });

  if (errors.length) {
    console.log('\n=== ERROR ===');
    errors.forEach((e) => console.log('  ' + e));
  }

  console.log('\n' + (fail === 0 ? 'SEMUA PEMERIKSAAN LOLOS' : fail + ' PEMERIKSAAN GAGAL'));
  process.exit(fail === 0 ? 0 : 1);
}, 150);
