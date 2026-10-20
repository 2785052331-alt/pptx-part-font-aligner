const fs = require("fs");
const path = require("path");
const base = "E:/openclaw_workspace/logs/pptx_extract/x/ppt/slides";

for (const f of ["slide24.xml","slide25.xml","slide26.xml","slide27.xml","slide28.xml"]) {
  const xml = fs.readFileSync(path.join(base, f), "utf8");
  console.log("\n############### " + f + " ###############");
  // each shape: <p:sp> ... </p:sp>
  const shapes = xml.match(/<p:sp>[\s\S]*?<\/p:sp>/g) || [];
  shapes.forEach((sp, i) => {
    const off = /<a:off x="(-?\d+)" y="(-?\d+)"\/>/.exec(sp);
    const ext = /<a:ext cx="(\d+)" cy="(\d+)"\/>/.exec(sp);
    const szs = [...sp.matchAll(/sz="(\d+)"/g)].map(m => m[1]);
    const texts = [...sp.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map(m => m[1]).join("").replace(/\s+/g," ").trim();
    if (!texts && !szs.length) return;
    const pos = off ? `off(${off[1]},${off[2]})` : "off?";
    const size = ext ? `ext(${ext[1]}x${ext[2]})` : "ext?";
    console.log(`  [${i}] ${pos} ${size} sz=[${[...new Set(szs)].join(",")}] :: ${texts.slice(0,110)}`);
  });
}
// also slide dimensions
const pres = fs.readFileSync("E:/openclaw_workspace/logs/pptx_extract/x/ppt/presentation.xml","utf8");
const sz = /<p:sldSz cx="(\d+)" cy="(\d+)"\/?>/.exec(pres);
console.log("\nSLIDE SIZE:", sz ? sz[1] + " x " + sz[2] + " EMU (" + (sz[1]/914400).toFixed(2) + " x " + (sz[2]/914400).toFixed(2) + " inch)" : "?");
