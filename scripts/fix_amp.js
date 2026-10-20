const fs=require("fs"),path=require("path");
const base="E:/openclaw_workspace/logs/pptx_build/ppt/slides";
function replaceText(file, find, newText){
  const p=path.join(base,file);
  let xml=fs.readFileSync(p,"utf8");
  const spRe=/<p:sp>[\s\S]*?<\/p:sp>/g; let m,out=xml,done=false;
  const plain=s=>s.replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");
  while((m=spRe.exec(xml))!==null&&!done){
    const sp=m[0];
    if(plain(sp).includes(find)){
      const enc=newText.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      let i=0;
      const ns=sp.replace(/<a:p[ >][\s\S]*?<\/a:p>/g,(pp)=>{
        i++;
        if(i>1) return pp.replace(/<a:t>([\s\S]*?)<\/a:t>/g,"<a:t></a:t>");
        let first=true;
        return pp.replace(/<a:t>([\s\S]*?)<\/a:t>/g,(f,t)=>{
          if(first){ first=false; return "<a:t>"+enc+"</a:t>"; }
          return "<a:t></a:t>";
        });
      });
      out=out.replace(sp,ns); done=true;
    }
  }
  if(!done) console.log("[MISS]",file,find);
  fs.writeFileSync(p,out,"utf8");
  return done;
}
replaceText("slide25.xml","02 / Hybrid Push-Pull","02 / Hybrid Push-Pull");
replaceText("slide26.xml","04 / Circular Buy-Back","04 / Circular Buy-Back & Tracking");
console.log("done");
