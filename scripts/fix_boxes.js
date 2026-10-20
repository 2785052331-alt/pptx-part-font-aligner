const fs = require("fs"), path = require("path");
const base = "E:/openclaw_workspace/logs/pptx_build/ppt/slides";
const EMU = 914400;
const IN = v => Math.round(v * EMU);

// (file, needle, {cx, cy, y}) —— 只改 xfrm
const FIX = [
  // ---- slide24 ----
  ["slide24.xml", "06 / CHALLENGES IDENTIFICATION", { cy: IN(0.45) }],
  ["slide24.xml", "01 / E-Commerce Last-Mile Bottlenecks", { cy: IN(0.42), y: IN(2.10) }],
  ["slide24.xml", "02 / Long-Haul Maritime Fragility", { cy: IN(0.42), y: IN(2.10) }],
  ["slide24.xml", "03 / Upstream Push Model Rigidities", { cy: IN(0.42), y: IN(4.25) }],
  ["slide24.xml", "04 / Tier-2/3 Blindspots", { cy: IN(0.42), y: IN(4.25) }],
  ["slide24.xml", "Model Mismatch: Suburban stores", { cy: IN(2.00), y: IN(2.55) }],
  ["slide24.xml", "Heavy Ocean Reliance", { cy: IN(2.00), y: IN(2.55) }],
  ["slide24.xml", "Push-Pull Disconnect", { cy: IN(2.00), y: IN(4.70) }],
  ["slide24.xml", "Audit Complexity", { cy: IN(2.00), y: IN(4.70) }],
  ["slide24.xml", "CORE TAKEAWAY", { cy: IN(0.40), y: IN(6.72) }],
  ["slide24.xml", "Suburban DIY pickup", { cy: IN(0.55), y: IN(6.70) }],

  // ---- slide25 ----
  ["slide25.xml", "06 / STRATEGIC RECOMMENDATIONS (PART 1)", { cy: IN(0.45) }],
  ["slide25.xml", "01 / Urban Micro-Fulfillment Network", { cy: IN(0.42), y: IN(2.10) }],
  ["slide25.xml", "Hybrid Push-Pull ", { cy: IN(0.42), y: IN(2.10) }],
  ["slide25.xml", "[City Planning Studio]", { cy: IN(0.45), y: IN(2.52) }],
  ["slide25.xml", "Automated Parcel Picking", { cy: IN(1.70), y: IN(2.98) }],
  ["slide25.xml", "Upstream Mass Push", { cy: IN(2.70), y: IN(2.98) }],
  ["slide25.xml", "CORE TAKEAWAY", { cy: IN(0.40), y: IN(6.72) }],
  ["slide25.xml", "Urban micro-warehouses plus", { cy: IN(0.55), y: IN(6.70) }],

  // ---- slide26 ----
  ["slide26.xml", "06 / STRATEGIC RECOMMENDATIONS (PART 2)", { cy: IN(0.45) }],
  ["slide26.xml", "Dual-Sourcing ", { cy: IN(0.42), y: IN(2.10) }],
  ["slide26.xml", "Circular Buy-Back ", { cy: IN(0.42), y: IN(2.10) }],
  ["slide26.xml", "70% Global Base Hubs", { cy: IN(2.70), y: IN(2.55) }],
  ["slide26.xml", "Scale Circular Loops", { cy: IN(2.70), y: IN(2.55) }],
  ["slide26.xml", "CORE TAKEAWAY", { cy: IN(0.40), y: IN(6.72) }],
  ["slide26.xml", "Dual-track sourcing secures", { cy: IN(0.55), y: IN(6.70) }],

  // ---- slide27 ----
  ["slide27.xml", "06 / IMPLEMENTATION ROADMAP", { cy: IN(0.45) }],
  ["slide27.xml", "Responsiveness", { cy: IN(0.40), y: IN(1.95) }],
  ["slide27.xml", "Flexibility", { cy: IN(0.40), y: IN(1.95) }],
  ["slide27.xml", "Resilience", { cy: IN(0.40), y: IN(1.95) }],
  ["slide27.xml", "Sustainability", { cy: IN(0.40), y: IN(1.95) }],
  ["slide27.xml", "Urban MFCs + EV fleets", { cy: IN(0.62), y: IN(2.35) }],
  ["slide27.xml", "Push-Pull postponement", { cy: IN(0.62), y: IN(2.35) }],
  ["slide27.xml", "70/30 dual-sourcing", { cy: IN(0.62), y: IN(2.35) }],
  ["slide27.xml", "Buy-back + Tier-2/3 tracking", { cy: IN(0.62), y: IN(2.35) }],
  ["slide27.xml", "Phase 1", { cy: IN(0.42), y: IN(3.35) }],
  ["slide27.xml", "Phase 2", { cy: IN(0.42), y: IN(3.35) }],
  ["slide27.xml", "Phase 3", { cy: IN(0.42), y: IN(3.35) }],
  ["slide27.xml", "Quick Wins in Fulfillment", { cy: IN(0.42), y: IN(3.80) }],
  ["slide27.xml", "Structural Agility", { cy: IN(0.42), y: IN(3.80) }],
  ["slide27.xml", "Closed-Loop Ecosystem", { cy: IN(0.42), y: IN(3.80) }],
  ["slide27.xml", "Pilot urban MFCs and EV", { cy: IN(1.75), y: IN(4.25) }],
  ["slide27.xml", "Roll out modular postponement", { cy: IN(1.75), y: IN(4.25) }],
  ["slide27.xml", "Scale buy-back and timber", { cy: IN(1.75), y: IN(4.25) }],

  // ---- slide28 ----
  ["slide28.xml", "06 / CONCLUSION", { cy: IN(0.45) }],
  ["slide28.xml", "IKEA's enduring success lies", { cy: IN(2.30), y: IN(2.90) }],
  ["slide28.xml", "Facing e-commerce shifts", { cy: IN(1.75), y: IN(5.30) }],
];

let miss = 0;
for (const [file, needle, box] of FIX) {
  const p = path.join(base, file);
  let xml = fs.readFileSync(p, "utf8");
  const spRe = /<p:sp>[\s\S]*?<\/p:sp>/g;
  let m, out = xml, done = false;
  while ((m = spRe.exec(xml)) !== null && !done) {
    const sp = m[0];
    const plain = sp.replace(/<[^>]+>/g, "");
    if (plain.includes(needle)) {
      let ns = sp, rep = 0;
      // off
      if (box.y !== undefined) {
        ns = ns.replace(/(<a:off x=")(-?\d+)(" y=")(-?\d+)(")/, (full, a, x, b, y, c) => {
          rep++;
          return a + x + b + box.y + c;
        });
      }
      // ext
      if (box.cy !== undefined) {
        ns = ns.replace(/(<a:ext cx=")(\d+)(" cy=")(\d+)(")/, (full, a, cx, b, cy, c) => {
          rep++;
          return a + cx + b + box.cy + c;
        });
      }
      out = out.replace(sp, ns);
      done = true;
    }
  }
  if (!done) { console.log("[MISS]", file, needle); miss++; }
  fs.writeFileSync(p, out, "utf8");
}
console.log(miss ? "misses: " + miss : "ALL BOXES FIXED");
