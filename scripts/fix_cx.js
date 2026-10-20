const fs = require("fs"), path = require("path");
const base = "E:/openclaw_workspace/logs/pptx_build/ppt/slides";
const EMU = 914400;

// 修正所有 cx="undefined"
const files = ["slide24.xml","slide25.xml","slide26.xml","slide27.xml","slide28.xml"];
// 每个形状原本应有的 cx（来自原始分析）
const ORIG_CX = {
  slide24: 5120640,
  slide25: 5120640,
  slide26: 5120640,
  slide27: 3200400,
  slide28: 6126480,
};

let fixed = 0;
for (const f of files) {
  const p = path.join(base, f);
  let xml = fs.readFileSync(p, "utf8");
  const key = f.replace(".xml","");
  if (xml.includes('cx="undefined"')) {
    xml = xml.split('cx="undefined"').join('cx="' + ORIG_CX[key] + '"');
    fs.writeFileSync(p, xml, "utf8");
    console.log("[FIXED]", f, "-> cx=" + ORIG_CX[key]);
    fixed++;
  }
}
console.log("fixed files:", fixed);
