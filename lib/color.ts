export const lerpColor = (polarity: number) => {
  const clamp = (x: number) => Math.max(-1, Math.min(1, x));
  const t = (clamp(polarity) + 1) / 2;
  const a = [229,83,83], b = [53,84,244];
  const c = a.map((av,i)=>Math.round(av+(b[i]-av)*t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};
