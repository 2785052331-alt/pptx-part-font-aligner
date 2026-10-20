const fs = require("fs");
const path = require("path");
const base = "E:/openclaw_workspace/logs/pptx_extract/x/ppt/slides";
const files = fs.readdirSync(base).filter(f => /^slide\d+\.xml$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));

const out = [];
for (const f of files) {
  const xml = fs.readFileSync(path.join(base, f), "utf8");
  const n = parseInt(f.match(/\d+/)[0], 10);
  out.push("\n========== SLIDE " + n + " ==========");
  // split by shape (a:p groups are paragraphs)
  const paras = xml.match(/<a:p[ >][\s\S]*?<\/a:p>/g) || [];
  for (const p of paras) {
    const texts = [...p.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map(m => m[1]);
    if (texts.length) {
      let line = texts.join("").trim();
      if (line) {
        // detect heading level via pPr lvl
        const lvl = /<a:pPr[^>]*lvl="(\d+)"/.exec(p);
        if (lvl && parseInt(lvl[1], 10) > 0) line = "  ".repeat(parseInt(lvl[1], 10)) + "- " + line;
        out.push(line.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
      }
    }
  }
}
const txt = out.join("\n");
fs.writeFileSync("E:/openclaw_workspace/logs/pptx_extract/all_slides.txt", txt, "utf8");
console.log("slides:", files.length, "chars:", txt.length);
