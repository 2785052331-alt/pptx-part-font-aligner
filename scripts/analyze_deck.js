const fs = require("fs");
const path = require("path");
const base = "E:/openclaw_workspace/logs/pptx_extract/x/ppt/slides";
const rels = "E:/openclaw_workspace/logs/pptx_extract/x/ppt/slides/_rels";
const media = "E:/openclaw_workspace/logs/pptx_extract/x/ppt/media";
const EMU_IN = 914400;

const unesc = s => s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");

function shapesOf(f) {
  const xml = fs.readFileSync(path.join(base, f), "utf8");
  const shapes = [];
  const spRe = /<p:sp>[\s\S]*?<\/p:sp>/g;
  let m, m2;
  while ((m = spRe.exec(xml)) !== null) {
    const sp = m[0];
    const off = /<a:off x="(-?\d+)" y="(-?\d+)"\/?>/.exec(sp);
    const ext = /<a:ext cx="(\d+)" cy="(\d+)"\/?>/.exec(sp);
    const szs = [];
    const szRe = /sz="(\d+)"/g;
    let sm;
    while ((sm = szRe.exec(sp)) !== null) szs.push(parseInt(sm[1],10));
    const pRe = /<a:p[ >][\s\S]*?<\/a:p>/g;
    const paras = [];
    while ((m2 = pRe.exec(sp)) !== null) {
      const p = m2[0];
      const tRe = /<a:t>([\s\S]*?)<\/a:t>/g;
      let tm;
      let txt = "";
      while ((tm = tRe.exec(p)) !== null) txt += unesc(tm[1]);
      paras.push(txt);
    }
    shapes.push({
      x: off ? +off[1] : null, y: off ? +off[2] : null,
      w: ext ? +ext[1] : null, h: ext ? +ext[2] : null,
      sizes: [...new Set(szs)], text: paras.join("\n").trim()
    });
  }
  return shapes.filter(s => s.text || s.sizes.length);
}

// 1. deck-wide font distribution
console.log("===== 1. DECK-WIDE FONT DISTRIBUTION (sz:count) =====");
const deck = {};
for (let i=1;i<=29;i++){
  const xml = fs.readFileSync(path.join(base,`slide${i}.xml`),"utf8");
  for (const m of xml.matchAll(/sz="(\d+)"/g)) deck[m[1]] = (deck[m[1]]||0)+1;
}
Object.keys(deck).map(Number).sort((a,b)=>a-b).forEach(s=>console.log(`  ${s}pt: ${deck[s]}`));

// 2. Part 5 role mapping
console.log("\n===== 2. PART 5 (20-23) SHAPE ROLES =====");
for (const f of ["slide20.xml","slide21.xml","slide22.xml","slide23.xml"]) {
  console.log(`\n--- ${f} ---`);
  for (const s of shapesOf(f)) {
    console.log(`  sz=${s.sizes.join("/")} box=${(s.w/EMU_IN).toFixed(2)}x${(s.h/EMU_IN).toFixed(2)}in @${(s.x/EMU_IN).toFixed(2)},${(s.y/EMU_IN).toFixed(2)} len=${s.text.length} :: ${s.text.replace(/\n/g," | ").slice(0,90)}`);
  }
}

// 3. Part 6 shapes, full detail
console.log("\n\n===== 3. PART 6 (24-28) SHAPES =====");
for (const f of ["slide24.xml","slide25.xml","slide26.xml","slide27.xml","slide28.xml"]) {
  console.log(`\n--- ${f} ---`);
  for (const s of shapesOf(f)) {
    console.log(`  sz=${s.sizes.join("/")} box=${(s.w/EMU_IN).toFixed(2)}x${(s.h/EMU_IN).toFixed(2)}in @${(s.x/EMU_IN).toFixed(2)},${(s.y/EMU_IN).toFixed(2)} len=${s.text.length}`);
    console.log(`      "${s.text.replace(/\n/g," ⏎ ")}"`);
  }
}

// 4. images in part 6
console.log("\n===== 4. IMAGES / PICTURES IN PART 6 =====");
for (let i=24;i<=29;i++){
  const rp = path.join(rels, `slide${i}.xml.rels`);
  if (!fs.existsSync(rp)) { console.log(`  slide${i}: no rels`); continue; }
  const r = fs.readFileSync(rp,"utf8");
  const imgs = [...r.matchAll(/Target="([^"]*media[^"]*)"/g)].map(m=>m[1]);
  const xml = fs.readFileSync(path.join(base,`slide${i}.xml`),"utf8");
  const pics = (xml.match(/<p:pic>/g)||[]).length;
  const gfxs = (xml.match(/<p:graphicFrame>/g)||[]).length;
  console.log(`  slide${i}: pics=${pics} graphicFrames=${gfxs} mediaRefs=${imgs.length?imgs.join(","):"none"}`);
}
console.log("\n  media dir files: " + (fs.existsSync(media)?fs.readdirSync(media).join(", "):"none"));
