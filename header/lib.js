/* Cabeçalho animado (rosa e amarelo). frame(t, W, H) devolve um SVG; t vai de 0 a 1 (loop). */
const TAU = Math.PI * 2, frac = x => x - Math.floor(x);
const INK = '#2B1B3D', HOT = '#E0147A', PINK = '#F25CA2', YEL = '#FFF27A', CHK = '#F27FB8';

const SPR = {
  star:{pal:{X:'#FFFFFF'},rows:["...X...","...X...","..XXX..","XXXXXXX","..XXX..","...X...","...X..."]},
  heart:{pal:{X:'#FF3DA5'},rows:[".XX.XX.","XXXXXXX","XXXXXXX",".XXXXX.","..XXX..","...X..."]},
  cat:{pal:{X:'#FFFFFF',O:'#2B1B3D',P:'#FF9EC4'},rows:["X...X","XXXXX","XOXOX","XXPXX",".XXX."]},
  pad:{pal:{X:'#2B1B3D',W:'#FFFFFF',K:'#2B1B3D',R:'#FF3DA5'},rows:[
    "..XXXXXXXX..",".XWWWWWWWWX.","XWWKWWWWRWWX","XWKKKWWRRRWX","XWWKWWWWRWWX","XXWWWWWWWWXX",".XXX....XXX."]},
  girl:{pal:{R:'#D81E4F',r:'#9C1139',S:'#FFDCCB',E:'#2B1B3D',P:'#FF9EC4',M:'#E0457A',T:'#B39BE8',H:'#6EDDE8',G:'#FFFFFF',W:'#B8B8D8',B:'#FF3DA5'},rows:[
    ".....rRRRRRRr.....","....RRRRRRRRRR....","...RRRRRRRRRRRR...","..RRRRRRRRRRRRRR..","..RRRRRRRRRRRRRR..",
    "..RRSSSSSSSSSSRR..",".HRRSSSSSSSSSSRRH.",".HHRSEESSSSEESRHH.",".HHRSEESSSSEESRHH.",".HHRSPSSSSSSPSRHH.",
    ".HHRSSSSMMSSSSRHH.","..RRRSSSSSSSSRRR..","..RRR.SSSSSS.RRR..","..RRTTTTTTTTTTRR..",".RRRTTTTTTTTTTRRR.",
    ".RRTTTTTTTTTTTTRR.",".RRTTSSGGGGSSTTRR.",".RRTTGGWGGBGGTTRR.",".RR.TTTTTTTTTT.RR.","..R.TTTTTTTTTT.R.."]}
};
function draw(name, px) {
  const { rows, pal } = SPR[name], w = Math.max(...rows.map(r => r.length)); let o = '';
  rows.forEach((r, y) => { let x = 0; while (x < w) { const c = r[x] || '.'; if (c === '.') { x++; continue } let e = x + 1;
    while (e < w && (r[e] || '.') === c) e++; o += `<rect x="${x*px}" y="${y*px}" width="${(e-x)*px}" height="${px}" fill="${pal[c]}"/>`; x = e } });
  return { svg: o, w: w * px, h: rows.length * px };
}

/* fundo: xadrez ondulado que desliza e balança */
function bg(t, W, H) {
  const cs = 100, A = 18, nx = Math.ceil(W / cs) + 6, ny = Math.ceil(H / cs) + 3;
  const P = (i, j) => {
    const bx = (i - 2 * t) * cs, by = j * cs;
    const wx = A * Math.sin(TAU * (t + by / (H * 1.1))) + 30 * Math.sin(Math.PI * by / H);
    const wy = A * Math.cos(TAU * (t + bx / (W * 0.8))) + 22 * Math.sin(Math.PI * bx / W);
    return [bx + wx, by + wy];
  };
  let o = '';
  for (let i = -4; i < nx; i++) for (let j = -2; j < ny; j++) {
    if (((i + j) & 1) !== 0) continue;
    const p = [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)].map(v => v[0].toFixed(1) + ',' + v[1].toFixed(1)).join(' ');
    o += `<polygon points="${p}" fill="${CHK}"/>`;
  }
  return o;
}

/* coração mascote */
function mascot(t, x, y, sc) {
  const bob = 4 * Math.sin(TAU * t), rot = 4 * Math.sin(TAU * t + 1);
  const blink = (t > 0.5 && t < 0.54), look = 3 * Math.sin(TAU * t);
  const heart = 'M60 104 C18 74 2 52 2 32 C2 14 16 4 32 4 C46 4 56 12 60 22 C64 12 74 4 88 4 C104 4 118 14 118 32 C118 52 102 74 60 104 Z';
  const eye = cx => `<ellipse cx="${cx}" cy="44" rx="10" ry="${blink ? 1.5 : 12}" fill="#fff" stroke="${INK}" stroke-width="3"/>` +
    (blink ? '' : `<circle cx="${cx + look}" cy="46" r="5.5" fill="${INK}"/>`);
  let petals = '';
  for (let k = 0; k < 6; k++) { const a = k * TAU / 6; petals += `<circle cx="${(Math.cos(a) * 10).toFixed(1)}" cy="${(Math.sin(a) * 10).toFixed(1)}" r="8" fill="#fff" stroke="${HOT}" stroke-width="2"/>`; }
  return `<g transform="translate(${x} ${y + bob}) rotate(${rot} 60 60) scale(${sc})">
    <path d="${heart}" fill="none" stroke="#fff" stroke-width="16" stroke-linejoin="round"/>
    <path d="${heart}" fill="${PINK}" stroke="${HOT}" stroke-width="7" stroke-linejoin="round"/>
    ${eye(42)}${eye(76)}
    <path d="M50 64 Q59 73 69 64" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <g transform="translate(22 94)">${petals}<circle r="6.5" fill="#FFD23F" stroke="${HOT}" stroke-width="2"/></g></g>`;
}

function sparkle(x, y, ph, t) {
  const k = Math.floor(frac(t * 2 + ph) * 3), sc = [0.4, 0.75, 1][k], d = draw('star', 3);
  return `<g shape-rendering="crispEdges" transform="translate(${x + 10.5} ${y + 10.5}) scale(${sc}) translate(-10.5 -10.5)">${d.svg.replace(/#FFFFFF/g, '#fff')}</g>`;
}

/* cena: garotinha + TV */
function scene(t) {
  const px = 9, g = draw('girl', px), bob = (Math.floor(t * 8) % 2) ? -4 : 0;
  const blink = t > 0.86 && t < 0.9;
  const eyes = blink ? [[5, 7], [6, 7], [11, 7], [12, 7]].map(([c, r]) => `<rect x="${c*px}" y="${r*px}" width="${px}" height="${px}" fill="#FFDCCB"/>`).join('') : '';
  const btn = (Math.floor(t * 16) % 2) ? '' : `<rect x="${10*px}" y="${17*px}" width="${px}" height="${px}" fill="#FFD23F"/>`;
  const hs = (bx, by, off) => { const f = frac(t * 2 + off); return `<g transform="translate(${bx} ${by - 8 + 38 * f})">${draw('heart', 1).svg}</g>`; };
  const tri = 1 - Math.abs(2 * frac(t * 2) - 1), cx = 2 + 32 * Math.round(tri * 14) / 14;
  const game = `<svg x="221" y="76" width="138" height="108" viewBox="0 0 46 36" shape-rendering="crispEdges">
    <rect width="46" height="36" fill="#3A2A6E"/>
    <rect x="6" y="9" width="1" height="1" fill="#fff"/><rect x="38" y="14" width="1" height="1" fill="#fff"/><rect x="24" y="6" width="1" height="1" fill="#FFD23F"/><rect x="14" y="20" width="1" height="1" fill="#6EDDE8"/>
    ${(Math.floor(t * 8) % 2) ? '' : `<text x="2" y="5" font-family="Pixelify Sans,monospace" font-size="4" fill="#A6F31D">SCORE 0420</text>`}
    ${hs(6, 6, 0)}${hs(21, 4, 0.55)}${hs(35, 8, 0.3)}
    <rect x="0" y="33" width="46" height="3" fill="#A6F31D"/>
    <g transform="translate(${cx} 28)">${draw('cat', 1).svg}</g>
    <polygon points="0,0 20,0 0,26" fill="#fff" opacity=".09"/></svg>`;
  let bs = 0; if (t >= 0.3 && t < 0.34) bs = (t - 0.3) / 0.04; else if (t >= 0.34 && t < 0.7) bs = 1; else if (t >= 0.7 && t < 0.74) bs = 1 - (t - 0.7) / 0.04;
  const ups = [[110, 70, 0], [135, 80, 0.33], [90, 86, 0.66]].map(([x, y, off]) => { const f = frac(t + off);
    return `<g opacity="${Math.sin(Math.PI * f).toFixed(2)}" transform="translate(${x} ${y - 70 * f})">${draw('heart', 2).svg}</g>`; }).join('');
  return `<g shape-rendering="crispEdges">
    <g transform="translate(14 ${56 + bob})">${g.svg}${eyes}${btn}</g>${ups}
    ${bs > 0.02 ? `<g transform="translate(176 64) scale(${bs}) translate(-176 -64)"><g transform="translate(150 22)">
      <rect width="52" height="30" fill="#fff" stroke="${INK}" stroke-width="3"/><polygon points="8,30 8,42 22,30" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="5" y="28" width="20" height="5" fill="#fff"/>
      <text x="26" y="22" text-anchor="middle" font-family="Pixelify Sans,monospace" font-weight="700" font-size="18" fill="#FF3DA5">GG!</text></g></g>` : ''}
    <rect x="262" y="198" width="54" height="30" fill="#CFCBE8" stroke="${INK}" stroke-width="4"/>
    <rect x="205" y="60" width="170" height="140" fill="#F4F1FF" stroke="${INK}" stroke-width="4"/>
    <rect x="217" y="72" width="146" height="116" fill="${INK}"/>${game}
    <circle cx="352" cy="194" r="3" fill="#FF3DA5"/><circle cx="342" cy="194" r="3" fill="#A6F31D"/>
    <rect x="0" y="228" width="400" height="18" fill="#FF3DA5" stroke="${INK}" stroke-width="4"/>
    <rect x="0" y="246" width="400" height="54" fill="#B39BE8" stroke="${INK}" stroke-width="4"/>
    <rect x="330" y="214" width="40" height="14" fill="#6EDDE8" stroke="${INK}" stroke-width="3"/></g>`;
}

function win(x, y, w, h, title, bar) {
  return `<g transform="translate(${x} ${y})">
    <rect x="7" y="8" width="${w}" height="${h}" rx="14" fill="${INK}"/>
    <rect width="${w}" height="${h}" rx="14" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <path d="M2 40 V16 Q2 2 16 2 H${w - 16} Q${w - 2} 2 ${w - 2} 16 V40 Z" fill="${bar}"/>
    <line x1="2" y1="40" x2="${w - 2}" y2="40" stroke="${INK}" stroke-width="4"/>
    <text x="16" y="28" font-family="Pixelify Sans,monospace" font-weight="600" font-size="19" fill="#fff">${title}</text>
    ${[0, 1, 2].map(k => `<rect x="${w - 96 + k * 28}" y="10" width="22" height="22" rx="5" fill="#fff" stroke="${INK}" stroke-width="3"/>`).join('')}
    <text x="${w - 85}" y="27" font-family="Pixelify Sans,monospace" font-weight="700" font-size="16" fill="${INK}">–</text>
    <text x="${w - 57}" y="27" font-family="Pixelify Sans,monospace" font-weight="700" font-size="15" fill="${INK}">□</text>
    <text x="${w - 29}" y="27" font-family="Pixelify Sans,monospace" font-weight="700" font-size="15" fill="${INK}">✕</text></g>`;
}

function hp(t, x, y) {
  const hearts = [0, 1, 2, 3, 4].map(k => { const off = (k === 4 && Math.floor(t * 8) % 2) ? 0 : 1;
    return off ? `<g transform="translate(${52 + k * 22} 44)">${draw('heart', 2).svg}</g>` : ''; }).join('');
  return `<g shape-rendering="crispEdges">${win(x, y, 176, 78, 'hp.exe', HOT).replace(/<text x="\d+" y="27"[^>]*>[^<]*<\/text>/g, '').replace(/<rect x="\d+" y="10" width="22"[^>]*\/>/g, '')}
    <g transform="translate(${x} ${y})"><g transform="translate(12 46)">${draw('pad', 3).svg}</g>${hearts}</g></g>`;
}

const DESC = ['Desenvolvimento de software com foco em', 'sistemas web, automações e integrações.', 'Transformo processos manuais em', 'ferramentas que funcionam sozinhas.'];

function content(t, dx, hpx, hpy, sceneX) {
  const wob = 1.2 * Math.sin(TAU * t), WX = 210 + dx;
  return `
    ${win(WX, 36, 490, 346, 'oi_eu_sou_a_kase.exe', HOT)}
    <g transform="translate(${WX + 26} 92)"><rect width="150" height="34" rx="10" fill="${HOT}" stroke="${INK}" stroke-width="3"/>
      <text x="75" y="24" text-anchor="middle" font-family="Pixelify Sans,monospace" font-weight="600" font-size="21" fill="#fff">oi! eu sou a</text></g>
    <g transform="rotate(${wob} ${WX + 120} 190)">
      <text x="${WX + 26}" y="218" font-family="Fredoka,sans-serif" font-weight="700" font-size="118" fill="${INK}" stroke="${INK}" stroke-width="16" stroke-linejoin="round" paint-order="stroke" transform="translate(6 7)">KASE</text>
      <text x="${WX + 26}" y="218" font-family="Fredoka,sans-serif" font-weight="700" font-size="118" fill="#fff" stroke="${HOT}" stroke-width="14" stroke-linejoin="round" paint-order="stroke">KASE</text></g>
    ${DESC.map((l, i) => `<text x="${WX + 28}" y="${272 + i * 29}" font-family="Fredoka,sans-serif" font-weight="500" font-size="22" fill="${INK}">${l}</text>`).join('')}
    <g transform="translate(${sceneX} 52) scale(1.2)">${scene(t)}</g>
    ${hp(t, hpx, hpy)}`;
}

function frame(t, W, H) {
  const s = H / 420, wide = W > 1250, ox = wide ? W - 1200 * s : 0;
  let o = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  o += `<rect width="${W}" height="${H}" fill="${YEL}"/>` + bg(t, W, H);
  if (!wide) {
    // cabeçalho do GitHub: janela à esquerda, hp.exe no vão, garota à direita
    o += `<g transform="scale(${s})">${content(t, -186, 530, 304, 722)}`
      + sparkle(8, 10, 0.2, t) + sparkle(690, 18, 0, t) + sparkle(1170, 30, 0.33, t) + sparkle(520, 392, 0.66, t) + sparkle(1100, 395, 0.2, t) + '</g>';
  } else {
    // banner do LinkedIn: hp.exe no canto superior esquerdo, janela longe da garota, foto de perfil fica livre
    const WXabs = 270, dx = (WXabs - ox) / s - 210;
    o += `<g transform="translate(${ox} 0) scale(${s})">${content(t, dx, (30 - ox) / s, 26 / s, 722)}</g>`
      + sparkle(250, 40, 0.5, t) + sparkle(820, 40, 0.1, t) + sparkle(900, 330, 0.7, t) + sparkle(1560, 20, 0.3, t);
    o += [[790, 140, 0], [860, 250, 0.5], [960, 90, 0.25]].map(([x, y, off]) => { const f = frac(t + off);
      return `<g shape-rendering="crispEdges" opacity="${(0.4 + 0.6 * Math.sin(Math.PI * f)).toFixed(2)}" transform="translate(${x} ${y - 14 * f})">${draw('heart', 4).svg}</g>`; }).join('');
  }
  return o + '</svg>';
}
