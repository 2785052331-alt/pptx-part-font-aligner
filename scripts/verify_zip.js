const fs=require("fs"),path=require("path");
const zt=process.env.TEMP+"/zx";
const src="E:/openclaw_workspace/logs/pptx_build";
function walk(dir,rel,out){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const s=path.join(dir,e.name), r=rel?rel+"/"+e.name:e.name;
    if(e.isDirectory()) walk(s,r,out); else out.push(r);
  }
  return out;
}
const a=walk(zt,"",[]).sort();
const b=walk(src,"",[]).sort();
console.log("zip files:",a.length," src files:",b.length);
const missing=b.filter(x=>!a.includes(x));
const extra=a.filter(x=>!b.includes(x));
console.log(missing.length?("MISSING: "+missing.join(", ")):"no missing files");
console.log(extra.length?("EXTRA: "+extra.join(", ")):"no extra files");
// 内容比对
let diff=0;
for(const rel of b){
  if(!a.includes(rel)) continue;
  const x=fs.readFileSync(path.join(zt,rel)), y=fs.readFileSync(path.join(src,rel));
  if(Buffer.compare(x,y)!==0){ console.log("DIFF:",rel); diff++; }
}
console.log(diff?"content diffs: "+diff:"ALL FILE CONTENTS IDENTICAL");
// 关键文件
for(const k of ["[Content_Types].xml","ppt/presentation.xml","ppt/slides/slide24.xml","ppt/slides/slide28.xml","ppt/media/image46.png","ppt/media/image50.png"]){
  const p=path.join(zt,k);
  console.log(k+": "+(fs.existsSync(p)?fs.statSync(p).size+"B":"MISSING"));
}
