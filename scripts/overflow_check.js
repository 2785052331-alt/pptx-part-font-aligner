const fs = require("fs"), path = require("path");
const base = "E:/openclaw_workspace/logs/pptx_build/ppt/slides";
const EMU = 914400;
const unesc = s => s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");

// 估算：Arial 在给定 pt 下，平均字符宽约 0.50 * pt（英文） / 1.0 * pt（中文）
// 行高约 1.20 * pt
function estLines(text, fontSizePt, boxWidthIn) {
  let lines = 0;
  for (const para of text.split("\n")) {
    if (!para) { lines += 1; continue; }
    // 每字符宽度(pt)
    let w = 0;
    for (const ch of para) w += /[\u4e00-\u9fff\uff00-\uffef]/.test(ch) ? 1.0 : 0.52;
    const linePt = w * fontSizePt;
    const boxPt = boxWidthIn * 72;
    lines += Math.max(1, Math.ceil(linePt / boxPt));
  }
  return lines;
}

for (const f of ["slide24.xml","slide25.xml","slide26.xml","slide27.xml","slide28.xml"]) {
  const xml = fs.readFileSync(path.join(base, f), "utf8");
  console.log("\n===== " + f + " =====");
  const spRe = /<p:sp>[\s\S]*?<\/p:sp>/g;
  let m;
  while ((m = spRe.exec(xml)) !== null) {
    const sp = m[0];
    const ext = /<a:ext cx="(\d+)" cy="(\d+)"\/?>/.exec(sp);
    const off = /<a:off x="(-?\d+)" y="(-?\d+)"\/?>/.exec(sp);
    const szRe = /sz="(\d+)"/g; let sm; let sz = 0;
    while ((sm = szRe.exec(sp)) !== null) sz = Math.max(sz, parseInt(sm[1],10));
    const tRe = /<a:t>([\s\S]*?)<\/a:t>/g; let tm; let t = "";
    while ((tm = tRe.exec(sp)) !== null) t += unesc(tm[1]);
    if (!t.trim() || !sz || !ext) continue;
    const wIn = +ext[1]/EMU, hIn = +ext[2]/EMU;
    const lines = estLines(t, sz/100, wIn - 0.2); // 减去内边距
    const needH = (lines * sz/100 * 1.22) / 72;
    const ok = needH <= hIn + 0.02;
    const y = off ? (+off[2]/EMU) : 0;
    const bottom = y + Math.max(hIn, needH);
    console.log(`  ${ok?"OK  ":"OVER"} sz=${sz/100}pt box=${wIn.toFixed(2)}x${hIn.toFixed(2)}in need=${needH.toFixed(2)}in lines=${lines} bottom=${bottom.toFixed(2)}in :: ${t.replace(/\s+/g," ").trim().slice(0,55)}`);
  }
}
console.log("\n(版面下边界参考: 7.50in, CORE TAKEAWAY 条约在 6.66in)");
