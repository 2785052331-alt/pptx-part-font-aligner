const fs=require("fs"),path=require("path");
const src="E:/桌面/IKEA_Part6_fixed.pptx";
const dst="E:/openclaw_workspace/logs/verify_x";
if(fs.existsSync(dst)) fs.rmSync(dst,{recursive:true,force:true});
fs.mkdirSync(dst,{recursive:true});
fs.copyFileSync(src,dst+"/d.zip");
require("child_process").execSync(`tar -xzf "${dst}/d.zip" -C "${dst}"`,{stdio:"inherit"});

const base=dst+"/ppt/slides";
const unesc=s=>s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");
function report(f){
  const xml=fs.readFileSync(path.join(base,f),"utf8");
  const spRe=/<p:sp>[\s\S]*?<\/p:sp>/g; let m; const rows=[];
  while((m=spRe.exec(xml))!==null){
    const sp=m[0];
    const szRe=/sz="(\d+)"/g; let sm; const szs=new Set();
    while((sm=szRe.exec(sp))!==null) szs.add(parseInt(sm[1],10));
    const tRe=/<a:t>([\s\S]*?)<\/a:t>/g; let tm; let t="";
    while((tm=tRe.exec(sp))!==null) t+=unesc(tm[1]);
    const ext=/<a:ext cx="(\d+)" cy="(\d+)"\/?>/.exec(sp);
    if(t.trim()||szs.size) rows.push({sz:[...szs].sort((a,b)=>a-b).join("/"), len:t.trim().length, h:ext?(+ext[2]/914400).toFixed(2):"?", txt:t.replace(/\s+/g," ").trim().slice(0,70)});
  }
  return rows;
}
for(const f of ["slide24.xml","slide25.xml","slide26.xml","slide27.xml","slide28.xml"]){
  console.log("\n===== "+f+" =====");
  for(const r of report(f)) console.log(`  sz=${r.sz} h=${r.h}in len=${r.len} :: ${r.txt}`);
}
