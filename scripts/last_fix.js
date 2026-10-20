const fs=require("fs"),path=require("path");
const base="E:/openclaw_workspace/logs/pptx_build/ppt/slides";
const EMU=914400; const IN=v=>Math.round(v*914400);
function plain(s){return s.replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");}
function setText(file,find,newText){
  const p=path.join(base,file); let xml=fs.readFileSync(p,"utf8");
  const spRe=/<p:sp>[\s\S]*?<\/p:sp>/g; let m,out=xml,done=false;
  while((m=spRe.exec(xml))!==null&&!done){
    const sp=m[0];
    if(plain(sp).includes(find)){
      const enc=newText.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      let i=0;
      const ns=sp.replace(/<a:p[ >][\s\S]*?<\/a:p>/g,(pp)=>{
        i++; if(i>1) return pp.replace(/<a:t>([\s\S]*?)<\/a:t>/g,"<a:t></a:t>");
        let first=true;
        return pp.replace(/<a:t>([\s\S]*?)<\/a:t>/g,(f,t)=>first?(first=false,"<a:t>"+enc+"</a:t>"):"<a:t></a:t>");
      });
      out=out.replace(sp,ns); done=true;
    }
  }
  if(!done) console.log("[MISS]",file,find);
  fs.writeFileSync(p,out,"utf8");
}
function setBox(file,find,b){
  const p=path.join(base,file); let xml=fs.readFileSync(p,"utf8");
  const spRe=/<p:sp>[\s\S]*?<\/p:sp>/g; let m,out=xml,done=false;
  while((m=spRe.exec(xml))!==null&&!done){
    const sp=m[0];
    if(plain(sp).includes(find)){
      let ns=sp;
      if(b.cy!==undefined) ns=ns.replace(/<a:ext cx="(\d+)" cy="(\d+)"\/?>/,"<a:ext cx=\"$1\" cy=\""+b.cy+"\"/>");
      if(b.cx!==undefined) ns=ns.replace(/<a:ext cx="(\d+)" cy="(\d+)"\/?>/,"<a:ext cx=\""+b.cx+"\" cy=\"$2\"/>");
      if(b.y!==undefined)  ns=ns.replace(/<a:off x="(-?\d+)" y="(-?\d+)"\/?>/,"<a:off x=\"$1\" y=\""+b.y+"\"/>");
      out=out.replace(sp,ns); done=true;
    }
  }
  if(!done) console.log("[MISS-BOX]",file,find);
  fs.writeFileSync(p,out,"utf8");
}

// 1) slide24 第4个标题：缩短到一定一行
setText("slide24.xml","04 / Tier-2/3 Blindspots","04 / Tier-2/3 & Inflation");
setBox("slide24.xml","04 / Tier-2/3 & Inflation",{cy:IN(0.42)});

// 2) slide24 CORE TAKEAWAY 条：缩短
setText("slide24.xml","Suburban DIY pickup","Suburban DIY pickup and Push production cannot support omnichannel growth.");
setBox("slide24.xml","Suburban DIY pickup",{cx:IN(10.90),cy:IN(0.44),y:IN(6.82)});
setBox("slide24.xml","CORE TAKEAWAY",{cy:IN(0.34),y:IN(6.86)});

// 3) slide25 流程箭头行：缩短 + 加高
setText("slide25.xml","[City Planning Studio]","[Planning Studio] > [Urban MFC] > [EV Delivery]");
setBox("slide25.xml","[Planning Studio]",{cy:IN(0.62),y:IN(2.50)});
setBox("slide25.xml","Automated Parcel Picking",{y:IN(3.10)});
setBox("slide25.xml","Upstream Mass Push",{y:IN(3.10)});

console.log("DONE");
