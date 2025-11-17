export function computeFinancialStress(predictions: any[]) {
  if (!predictions || predictions.length === 0) return 0;

  let highImpactFinance = 0;
  let mediumImpactFinance = 0;
  let negativeSentiment = 0;
  let confidenceSum = 0;
  let count = 0;

  for (const p of predictions) {
    if (p.category !== "Finance") continue;

    // Count confidence
    if (p.confidence) {
      confidenceSum += p.confidence;
      count++;
    }

    // Count high/medium impact
    if (p.impact === "high") highImpactFinance++;
    if (p.impact === "medium") mediumImpactFinance++;

    // Sentiment
    if (p.sentiment === "negative") negativeSentiment++;
  }

  const avgConfidence = count ? confidenceSum / count : 0;

  let score =
    highImpactFinance * 15 +
    mediumImpactFinance * 7 +
    avgConfidence * 20 +
    negativeSentiment * 10;

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return Math.round(score);
}
