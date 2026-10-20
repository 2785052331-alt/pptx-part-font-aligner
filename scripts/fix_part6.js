const fs = require("fs"), path = require("path");
const { editShape, slidesDir } = require("./pptx_lib.js");
const EMU = 914400;
const IN = v => Math.round(v * EMU);

let log = [];
function apply(file, ops) {
  let xml = fs.readFileSync(path.join(slidesDir, file), "utf8");
  for (const op of ops) {
    const r = editShape(xml, op.find, op);
    if (!r.done) log.push("  [MISS] " + file + " :: " + op.find.slice(0, 40));
    xml = r.xml;
  }
  fs.writeFileSync(path.join(slidesDir, file), xml, "utf8");
}

// ---------- SLIDE 24 ----------
apply("slide24.xml", [
  { find: "06 / CHALLENGES IDENTIFICATION", sizes: [1100, 2400] },
  { find: "Four Key Supply Chain Challenges Facing IKEA", newText: "Four Key Supply Chain Challenges" },
  { find: "Structural bottlenecks behind", sizes: [1300, 1600],
    newText: "Structural bottlenecks behind the radar gaps in Flexibility, Responsiveness, Resilience and Sustainability" },
  { find: "01 / E-Commerce Last-Mile Bottlenecks", sizes: [1300, 2000] },
  { find: "02 / Long-Haul Maritime Fragility", sizes: [1300, 2000] },
  { find: "03 / Upstream Push Model Rigidities", sizes: [1300, 2000] },
  { find: "Tier-2/3 Blindspots", sizes: [1300, 2000] },
  { find: "Model Mismatch: Suburban stores", sizes: [1000, 1800],
    newText: "\u25b8 Model Mismatch: Suburban stores are built for full-pallet replenishment, not single-item parcel picking.\n\u25b8 High Delivery Cost: Bulky home delivery drives high cost and slow delivery windows." },
  { find: "Heavy Ocean Reliance", sizes: [1000, 1800],
    newText: "\u25b8 Heavy Ocean Reliance: Production concentrates in distant hubs, stretching supply lines.\n\u25b8 Disruption Risk: The Red Sea Crisis extended Asia-Europe voyages by 10-14 days." },
  { find: "Push-Pull Disconnect", sizes: [1000, 1800],
    newText: "\u25b8 Push-Pull Disconnect: Stores use POS \u00d7 AI pull, but factories still run on long-term forecasts.\n\u25b8 Slow Response: Long lead times raise overstock and stockout risk versus MUJI." },
  { find: "Audit Complexity", sizes: [1000, 1800],
    newText: "\u25b8 Audit Complexity: Tracking Tier-2/3 timber origin across 1,000+ suppliers is costly.\n\u25b8 Margin Squeeze: Rising timber, metal and fuel prices pressure the low-price promise." },
  { find: "CORE TAKEAWAY", sizes: [900, 1400] },
  { find: "Relying solely on suburban DIY pickup", sizes: [1100, 1800],
    newText: "Suburban DIY pickup and long-term Push production can no longer support omnichannel growth." },
  { find: "Model Mismatch: Suburban stores", newBox: { h: IN(1.75) } },
  { find: "Heavy Ocean Reliance", newBox: { h: IN(1.75) } },
  { find: "Push-Pull Disconnect", newBox: { h: IN(1.75) } },
  { find: "Audit Complexity", newBox: { h: IN(1.75) } },
]);

// ---------- SLIDE 25 ----------
apply("slide25.xml", [
  { find: "06 / STRATEGIC RECOMMENDATIONS (PART 1)", sizes: [1100, 2400] },
  { find: "Upgrading Omnichannel Fulfillment", newText: "Upgrading Omnichannel Fulfillment & Supply Flexibility" },
  { find: "Addressing last-mile delivery bottlenecks", sizes: [1300, 1600] },
  { find: "01 / Urban Micro-Fulfillment Network", sizes: [1400, 2000] },
  { find: "Hybrid Push-Pull ", sizes: [1400, 2000] },
  { find: "[City Planning Studio]", sizes: [1100, 1800] },
  { find: "Automated Parcel Picking", sizes: [1100, 1800],
    newText: "\u25b8 Automated Parcel Picking: Deploy urban MFCs to handle fast-moving online orders closer to customers.\n\u25b8 Expected Impact: Cuts delivery windows to 24-48 hours and last-mile cost by 15%+." },
  { find: "Upstream Mass Push", sizes: [1100, 1800],
    newText: "\u25b8 Upstream Mass Push: Keep scale production for standardized components (LACK / KALLAX fittings).\n\u25b8 Downstream Agile Pull: Delay final finishes and fabric covers until real-time POS \u00d7 AI signals arrive.\n\u25b8 Expected Impact: MUJI-like responsiveness without small-batch cost." },
  { find: "CORE TAKEAWAY", sizes: [900, 1400] },
  { find: "Combining urban micro-warehouses", sizes: [1100, 1800],
    newText: "Urban micro-warehouses plus modular postponement bridge scale efficiency and agile response." },
  { find: "Automated Parcel Picking", newBox: { h: IN(1.55) } },
  { find: "Upstream Mass Push", newBox: { h: IN(1.55) } },
]);

// ---------- SLIDE 26 ----------
apply("slide26.xml", [
  { find: "06 / STRATEGIC RECOMMENDATIONS (PART 2)", sizes: [1100, 2400] },
  { find: "Building Supply Chain Resilience", newText: "Building Supply Chain Resilience & Circular Compliance" },
  { find: "Hedging against ocean shipping disruptions", sizes: [1300, 1600] },
  { find: "Dual-Sourcing ", sizes: [1400, 2000] },
  { find: "Circular Buy-Back ", sizes: [1400, 2000] },
  { find: "70% Global Base Hubs", sizes: [1100, 1800],
    newText: "\u25b8 70% Global Base Hubs: Keep stable products in major hubs (Poland, Asia) to preserve scale cost.\n\u25b8 30% Nearshore Buffer: Expand regional capacity in Europe and North America for seasonal items.\n\u25b8 Expected Impact: Cuts lead times by 30% and buffers Red Sea-style crises." },
  { find: "Scale Circular Loops", sizes: [1100, 1800],
    newText: "\u25b8 Scale Circular Loops: Expand Buy Back & Resell to recover furniture and reprocess timber.\n\u25b8 Tier-2/3 Digital Traceability: Track sub-suppliers to verify 100% FSC compliance under EU rules.\n\u25b8 Expected Impact: Hedges raw-material inflation and closes ESG blindspots." },
  { find: "CORE TAKEAWAY", sizes: [900, 1400] },
  { find: "Dual-track sourcing secures supply continuity", sizes: [1100, 1800],
    newText: "Dual-track sourcing secures continuity; circular recovery turns ESG into a cost hedge." },
  { find: "70% Global Base Hubs", newBox: { h: IN(1.75) } },
  { find: "Scale Circular Loops", newBox: { h: IN(1.75) } },
]);

// ---------- SLIDE 27 ----------
apply("slide27.xml", [
  { find: "06 / IMPLEMENTATION ROADMAP", sizes: [1100, 2400] },
  { find: "Phased Implementation Roadmap", newText: "Phased Implementation Roadmap & Radar Gap Closure" },
  { find: "How the four recommendations close", sizes: [1300, 1600] },
  { find: "Responsiveness", sizes: [1100, 2000] },
  { find: "Flexibility", sizes: [1100, 2000] },
  { find: "Resilience", sizes: [1100, 2000] },
  { find: "Sustainability", sizes: [1100, 2000] },
  { find: "Urban MFCs + EV fleets", sizes: [950, 1800] },
  { find: "Push-Pull postponement", sizes: [950, 1800] },
  { find: "70/30 dual-sourcing", sizes: [950, 1800] },
  { find: "Buy-back + Tier-2/3 tracking", sizes: [950, 1800] },
  { find: "Phase 1", sizes: [1250, 2000] },
  { find: "Phase 2", sizes: [1250, 2000] },
  { find: "Phase 3", sizes: [1250, 2000] },
  { find: "Quick Wins in Fulfillment", sizes: [1050, 1800] },
  { find: "Structural Agility", sizes: [1050, 1800] },
  { find: "Closed-Loop Ecosystem", sizes: [1050, 1800] },
  { find: "Pilot urban MFCs and EV", sizes: [1000, 1800],
    newText: "Pilot urban MFCs and EV fleets in major metros; unify store POS and online inventory." },
  { find: "Roll out modular postponement", sizes: [1000, 1800],
    newText: "Roll out modular postponement for seasonal lines; build 30% nearshore backup capacity." },
  { find: "Scale furniture buy-back", sizes: [1000, 1800],
    newText: "Scale buy-back and timber recycling; reach 100% traceability down to Tier-2/3." },
  { find: "Pilot urban MFCs and EV", newBox: { h: IN(1.60) } },
  { find: "Roll out modular postponement", newBox: { h: IN(1.60) } },
  { find: "Scale furniture buy-back", newBox: { h: IN(1.60) } },
]);

// ---------- SLIDE 28 ----------
apply("slide28.xml", [
  { find: "CONCLUSION ", sizes: [1100, 2400] },
  { find: "Research Conclusion: Balancing Efficiency", newText: "Conclusion: Balancing Efficiency, Agility and Resilience" },
  { find: "Key takeaways from IKEA", sizes: [1300, 1600] },
  { find: "Core Takeaway", sizes: [2200, 2200] },
  { find: "IKEA's enduring success lies in integrating", sizes: [1250, 1800],
    newText: "IKEA's enduring success lies in integrating supply chain strategy directly into product design and retail execution. Flat-pack design and global sourcing keep the cost base low, while urban MFCs, postponement and 70/30 dual-sourcing close the gaps in responsiveness, flexibility and resilience." },
  { find: "Facing e-commerce shifts", sizes: [1250, 1800],
    newText: "Facing e-commerce shifts, ocean disruptions and ESG scrutiny, IKEA must retain its low-cost core while moving from a rigid Push model to a resilient, demand-driven ecosystem." },
]);

console.log(log.length ? log.join("\n") : "ALL OPS MATCHED");
console.log("DONE");
