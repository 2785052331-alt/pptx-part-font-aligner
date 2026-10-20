const fs=require("fs"),path=require("path");
const base="E:/openclaw_workspace/logs/pptx_build/ppt/slides";
const EMU=914400; const IN=v=>Math.round(v*EMU);

// 1) 缩短会换行的小标题 + 精简长正文
const TEXT=[
  ["slide24.xml","01 / E-Commerce Last-Mile Bottlenecks","01 / E-Commerce Last-Mile"],
  ["slide24.xml","03 / Upstream Push Model Rigidities","03 / Upstream Push Rigidities"],
  ["slide24.xml","04 / Tier-2/3 Blindspots","04 / Tier-2/3 Blindspots & Inflation"],
  ["slide25.xml","01 / Urban Micro-Fulfillment Network","01 / Urban Micro-Fulfillment"],
  ["slide25.xml","02 / Hybrid Push-Pull & Postponement","02 / Hybrid Push-Pull"],
  ["slide26.xml","04 / Circular Buy-Back & Multi-Tier Tracking","04 / Circular Buy-Back & Tracking"],
  ["slide27.xml","Phase 1  Short-Term (Year 1)","Phase 1  Short-Term"],
  ["slide27.xml","Phase 2  Mid-Term (Years 1-3)","Phase 2  Mid-Term"],
  ["slide27.xml","Phase 3  Long-Term (Years 3-5)","Phase 3  Long-Term"],
  // CORE TAKEAWAY 强调条：缩到一行
  ["slide24.xml","Suburban DIY pickup and long-term Push","Suburban DIY pickup and long-term Push production cannot support omnichannel growth."],
  ["slide25.xml","Urban micro-warehouses plus modular postponement","Urban micro-warehouses plus modular postponement bridge scale and agility."],
  ["slide26.xml","Dual-track sourcing secures continuity","Dual-track sourcing secures continuity; circular recovery turns ESG into a hedge."],
];

function replaceText(file, find, newText){
  const p=path.join(base,file);
  let xml=fs.readFileSync(p,"utf8");
  const spRe=/<p:sp>[\s\S]*?<\/p:sp>/g; let m,out=xml,done=false;
  while((m=spRe.exec(xml))!==null&&!done){
    const sp=m[0];
    if(sp.replace(/<[^>]+>/g,"").includes(find)){
      let i=0;
      let ns=sp.replace(/<a:p[ >][\s\S]*?<\/a:p>/g,(pp)=>{
        i++;
        if(i>1) return pp.replace(/<a:t>([\s\S]*?)<\/a:t>/g,"<a:t></a:t>");
        let first=true;
        return pp.replace(/<a:t>([\s\S]*?)<\/a:t>/g,(f,t)=>{
          if(first){ first=false; return "<a:t>"+newText.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</a:t>"; }
          return "<a:t></a:t>";
        });
      });
      out=out.replace(sp,ns); done=true;
    }
  }
  if(!done) console.log("[MISS-TEXT]",file,find);
  fs.writeFileSync(p,out,"utf8");
}
for(const [f,fi,nt] of TEXT) replaceText(f,fi,nt);

// 2) CORE TAKEAWAY 标签与强调条：加宽加高 + 上移
const BOX=[
  ["slide24.xml","CORE TAKEAWAY",{cx:IN(2.20),cy:IN(0.34),y:IN(6.86)}],
  ["slide24.xml","Suburban DIY pickup",{cx:IN(10.90),cy:IN(0.40),y:IN(6.84)}],
  ["slide25.xml","CORE TAKEAWAY",{cx:IN(2.20),cy:IN(0.34),y:IN(6.86)}],
  ["slide25.xml","Urban micro-warehouses plus",{cx:IN(10.90),cy:IN(0.40),y:IN(6.84)}],
  ["slide26.xml","CORE TAKEAWAY",{cx:IN(2.20),cy:IN(0.34),y:IN(6.86)}],
  ["slide26.xml","Dual-track sourcing secures",{cx:IN(10.90),cy:IN(0.40),y:IN(6.84)}],
  // slide25 的流程图箭头行加高
  ["slide25.xml","[City Planning Studio]",{cy:IN(0.55)}],
];
for(const [f,fi,b] of BOX){
  const p=path.join(base,f);
  let xml=fs.readFileSync(p,"utf8");
  const spRe=/<p:sp>[\s\S]*?<\/p:sp>/g; let m,out=xml,done=false;
  while((m=spRe.exec(xml))!==null&&!done){
    const sp=m[0];
    if(sp.replace(/<[^>]+>/g,"").includes(fi)){
      let ns=sp;
      if(b.x!==undefined) ns=ns.replace(/<a:off x="(-?\d+)" y="(-?\d+)"\/?>/,"<a:off x=\""+(b.x)+"\" y=\""+b.y+"\"/>");
      if(b.y!==undefined) ns=ns.replace(/<a:off x="(-?\d+)" y="(-?\d+)"\/?>/,"<a:off x=\"$1\" y=\""+b.y+"\"/>");
      if(b.cx!==undefined) ns=ns.replace(/<a:ext cx="(\d+)" cy="(\d+)"\/?>/,"<a:ext cx=\""+b.cx+"\" cy=\"$2\"/>");
      if(b.cy!==undefined) ns=ns.replace(/<a:ext cx="(\d+)" cy="(\d+)"\/?>/,"<a:ext cx=\"$1\" cy=\""+b.cy+"\"/>");
      out=out.replace(sp,ns); done=true;
    }
  }
  if(!done) console.log("[MISS-BOX]",f,fi);
  fs.writeFileSync(p,out,"utf8");
}
console.log("FINAL PASS DONE");
