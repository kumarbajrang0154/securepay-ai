export function analyzeQR(qrString) {

  let score = 0;

  // suspicious keywords
  const suspiciousWords = ["test", "scam", "fraud", "unknown"];

  suspiciousWords.forEach(word => {
    if (qrString.toLowerCase().includes(word)) {
      score += 40;
    }
  });

  // high amount detection
  const amountMatch = qrString.match(/am=([0-9]+)/);

  if (amountMatch) {
    const amount = parseInt(amountMatch[1]);

    if (amount > 2000) score += 30;
  }

  // unknown merchant detection
  if (!qrString.includes("pn=")) {
    score += 20;
  }

  if (score > 100) score = 100;

  return score;
}