const fs=require("fs"),path=require("path");
const d="E:/openclaw_workspace/logs/verify2";
if(fs.existsSync(d)) fs.rmSync(d,{recursive:true,force:true});
fs.mkdirSync(d,{recursive:true});
fs.copyFileSync("E:/桌面/IKEA_Part6_fixed.pptx",d+"/d.zip");
require("child_process").execSync("tar -xzf "+d+"/d.zip -C "+d);
const base=d+"/ppt/slides";

let bad=0;
for(let i=1;i<=29;i++){
  const xml=fs.readFileSync(path.join(base,"slide"+i+".xml"),"utf8");
  if(xml.includes("undefined")){ console.log("[BAD] slide"+i+" contains undefined"); bad++; }
}
console.log(bad? "PROBLEMS: "+bad : "XML INTEGRITY OK across 29 slides");

// Part6 字号分布
let dist={};
for(let i=24;i<=28;i++){
  const xml=fs.readFileSync(path.join(base,"slide"+i+".xml"),"utf8");
  const re=/sz="(\d+)"/g; let m;
  while((m=re.exec(xml))!==null) dist[m[1]]=(dist[m[1]]||0)+1;
}
console.log("PART6 sizes:", JSON.stringify(dist));

// 对比 Part5
let d5={};
for(let i=20;i<=23;i++){
  const xml=fs.readFileSync(path.join(base,"slide"+i+".xml"),"utf8");
  const re=/sz="(\d+)"/g; let m;
  while((m=re.exec(xml))!==null) d5[m[1]]=(d5[m[1]]||0)+1;
}
console.log("PART5 sizes:", JSON.stringify(d5));

// 其他部分是否被改动（1-19, 29 应与原文件逐字节一致）
const orig="E:/openclaw_workspace/logs/pptx_extract/x/ppt/slides";
let changed=[];
for(let i=1;i<=29;i++){
  if(i>=24&&i<=28) continue;
  const a=fs.readFileSync(path.join(orig,"slide"+i+".xml"),"utf8");
  const b=fs.readFileSync(path.join(base,"slide"+i+".xml"),"utf8");
  if(a!==b) changed.push(i);
}
console.log(changed.length? "UNEXPECTED CHANGES in slides: "+changed.join(",") : "SLIDES 1-23 & 29 byte-identical to original");
