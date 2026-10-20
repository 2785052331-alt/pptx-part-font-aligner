const fs = require("fs");
const path = require("path");

const SRC = "E:/openclaw_workspace/logs/pptx_extract/x";
const OUT = "E:/openclaw_workspace/logs/pptx_build";

// 复制整棵树到 OUT
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
copyDir(SRC, OUT);
console.log("copied tree to", OUT);

const slidesDir = path.join(OUT, "ppt/slides");

// ---------- 工具 ----------
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");

// 把一个 <a:p> 段落的全部 <a:t> 内容替换为新文本（保留第一个 run 的格式，删除多余 run）
function setParaText(pXml, newText) {
  const runs = [...pXml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)];
  if (runs.length === 0) return pXml;
  if (runs.length === 1) {
    return pXml.replace(/<a:t>([\s\S]*?)<\/a:t>/, "<a:t>" + esc(newText) + "</a:t>");
  }
  // 多个 run：把第一个 run 的 <a:t> 换成新文本，其余 run 的 <a:t> 清空
  let idx = 0;
  return pXml.replace(/<a:t>([\s\S]*?)<\/a:t>/g, (m) => {
    idx++;
    return idx === 1 ? "<a:t>" + esc(newText) + "</a:t>" : "<a:t></a:t>";
  });
}

// 按「形状内文本」定位并改写（在纯文本层匹配，规避 &amp; / 换行问题）
function editShape(xml, matchText, opts) {
  const spRe = /<p:sp>[\s\S]*?<\/p:sp>/g;
  let m, out = xml, done = false;
  while ((m = spRe.exec(xml)) !== null && !done) {
    const sp = m[0];
    // 纯文本层（把 a:t 内容剥出来再反转义）
    const plain = sp.replace(/<[^>]+>/g, "");
    if (plain.includes(matchText)) {
      let ns = sp;
      if (opts.sizes) {
        const from = opts.sizes[0], to = opts.sizes[1];
        ns = ns.split('sz="' + from + '"').join('sz="' + to + '"');
      }
      if (opts.newText !== undefined) {
        let i = 0;
        ns = ns.replace(/<a:p[ >][\s\S]*?<\/a:p>/g, (p) => {
          i++;
          return i === 1 ? setParaText(p, opts.newText) : setParaText(p, "");
        });
      }
      if (opts.newBox) {
        if (opts.newBox.y !== undefined)
          ns = ns.replace(/(<a:off x=")-?\d+(" y=")-?\d+(")/, `$1${opts.newBox.x}$2${opts.newBox.y}$3`);
        if (opts.newBox.h !== undefined)
          ns = ns.replace(/(<a:ext cx=")\d+(" cy=")\d+(")/, `$1${opts.newBox.cx}$2${opts.newBox.h}$3`);
      }
      out = out.replace(sp, ns);
      done = true;
    }
  }
  return { xml: out, done };
}

module.exports = { esc, setParaText, editShape, slidesDir };
