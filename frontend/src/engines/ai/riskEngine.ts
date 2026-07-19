export function classifyRisk(probability: number) {
  if (probability >= 70) return "critical";
  if (probability >= 40) return "high";
  if (probability >= 20) return "moderate";
  return "low";
}
