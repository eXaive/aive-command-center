import { Influence } from "@/types";
export function netInfluenceIndex(infs: Influence[]) {
  const weighted = infs.map(i=>{ const s=i.strength??0.5; const w=1; return { num:(i.polarity||0)*s*w, den:s*w };});
  const num = weighted.reduce((a,b)=>a+b.num,0);
  const den = Math.max(1e-9, weighted.reduce((a,b)=>a+b.den,0));
  return { nii: 100*(num/den), confidence: Math.min(1, den/(infs.length||1)) };
}
