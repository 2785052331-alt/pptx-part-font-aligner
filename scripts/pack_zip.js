// 标准 ZIP 打包器（store 模式，无压缩）—— PPTX 必须是 zip
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const SRC = "E:/openclaw_workspace/logs/pptx_build";
const DEST = "E:/桌面/IKEA_Part6_fixed.pptx";

// CRC32 表
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// 收集文件（保证 [Content_Types].xml 在最前）
const files = [];
function walk(dir, rel) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name))) {
    const s = path.join(dir, e.name);
    const r = rel ? rel + "/" + e.name : e.name;
    if (e.isDirectory()) walk(s, r);
    else files.push({ abs: s, rel: r.replace(/\\/g, "/") });
  }
}
walk(SRC, "");
files.sort((a, b) => {
  if (a.rel === "[Content_Types].xml") return -1;
  if (b.rel === "[Content_Types].xml") return 1;
  return a.rel < b.rel ? -1 : 1;
});

const locals = [], centrals = [];
let offset = 0;

function u16(n){const b=Buffer.alloc(2);b.writeUInt16LE(n&0xFFFF);return b;}
function u32(n){const b=Buffer.alloc(4);b.writeUInt32LE(n>>>0);return b;}

for (const f of files) {
  const name = Buffer.from(f.rel, "utf8");
  const data = fs.readFileSync(f.abs);
  const crc = crc32(data);
  const lh = Buffer.concat([
    u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
    u32(crc), u32(data.length), u32(data.length),
    u16(name.length), u16(0)
  ]);
  locals.push(lh, name, data);
  const cd = Buffer.concat([
    u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
    u32(crc), u32(data.length), u32(data.length),
    u16(name.length), u16(0), u16(0), u16(0), u16(0),
    u32(0), u32(offset)
  ]);
  centrals.push(cd, name);
  offset += lh.length + name.length + data.length;
}

const cdStart = offset;
const cdBuf = Buffer.concat(centrals);
const eocd = Buffer.concat([
  u32(0x06054b50), u16(0), u16(0),
  u16(files.length), u16(files.length),
  u32(cdBuf.length), u32(cdStart), u16(0)
]);

const out = Buffer.concat([Buffer.concat(locals), cdBuf, eocd]);
fs.writeFileSync(DEST, out);
console.log("WROTE", DEST, out.length, "bytes,", files.length, "entries");
console.log("first entry:", files[0].rel);
console.log("signature:", out.slice(0,4).toString("hex").toUpperCase());
