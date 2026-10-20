const fs=require("fs");
// 原图分辨率 vs 新图分辨率 -> 计算是否需要更新 slide XML 中的 a:ext
const MEDIA="E:/openclaw_workspace/logs/pptx_build/ppt/media";
const slides="E:/openclaw_workspace/logs/pptx_build/ppt/slides/_rels";
// 只有分辨率变化时 PPT 才可能拉伸；我们用相同的显示尺寸(a:ext)即可。
// 检查每张新图的宽高比是否与原图一致
const orig={ "image46.png":[1589,748,4.14,1.95], "image47.png":[1589,748,3.93,1.85],
             "image48.png":[1589,748,3.93,1.85], "image49.png":[1589,748,3.93,1.85],
             "image50.png":[2520,486,6.22,1.20] };
const dim=[["image46.png",2200,1036],["image47.png",2200,1036],["image48.png",2200,1036],
           ["image49.png",2200,1036],["image50.png",2600,501]];
for(const [f,w,h] of dim){
  const o=orig[f];
  const ratioNew=w/h, ratioOld=o[0]/o[1];
  const drift=Math.abs(ratioNew-ratioOld)/ratioOld*100;
  console.log(`${f}: old ${o[0]}x${o[1]} (${ratioOld.toFixed(4)}) -> new ${w}x${h} (${ratioNew.toFixed(4)}) drift=${drift.toFixed(2)}% ${drift<0.5?"OK":"!!!"}`);
}
// 文件大小
for(const [f] of dim){
  const s=fs.statSync(MEDIA+"/"+f).size;
  console.log(`${f}: ${(s/1024).toFixed(0)} KB`);
}
