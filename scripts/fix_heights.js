const fs = require("fs"), path = require("path");
const base = "E:/openclaw_workspace/logs/pptx_build/ppt/slides";
const EMU = 914400;

// 目标：(slide, 匹配文本) -> 新高度(英寸)
const TARGETS = [
  ["slide24.xml", "Model Mismatch: Suburban stores", 1.75],
  ["slide24.xml", "Heavy Ocean Reliance", 1.75],
  ["slide24.xml", "Push-Pull Disconnect", 1.75],
  ["slide24.xml", "Audit Complexity", 1.75],
  ["slide25.xml", "Automated Parcel Picking", 1.55],
  ["slide25.xml", "Upstream Mass Push", 1.55],
  ["slide26.xml", "70% Global Base Hubs", 1.75],
  ["slide26.xml", "Scale Circular Loops", 1.75],
  ["slide27.xml", "Pilot urban MFCs and EV", 1.60],
  ["slide27.xml", "Roll out modular postponement", 1.60],
];

for (const [file, needle, hIn] of TARGETS) {
  const p = path.join(base, file);
  let xml = fs.readFileSync(p, "utf8");
  const spRe = /<p:sp>[\s\S]*?<\/p:sp>/g;
  let m, out = xml, done = false;
  while ((m = spRe.exec(xml)) !== null && !done) {
    const sp = m[0];
    if (sp.includes(needle)) {
      // 只替换第一个 <a:ext>（即 spPr 里的），保留 xfrm 结构
      let replaced = false;
      const ns = sp.replace(/<a:ext cx="(\d+)" cy="(\d+)"\/?>/, (full, cx, cy) => {
        if (replaced) return full;
        replaced = true;
        return '<a:ext cx="' + cx + '" cy="' + Math.round(hIn * EMU) + '"/>';
      });
      out = out.replace(sp, ns);
      done = true;
    }
  }
  if (!done) console.log("[MISS]", file, needle);
  fs.writeFileSync(p, out, "utf8");
}
console.log("heights fixed");
