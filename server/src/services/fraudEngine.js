export function detectFraud(data) {

  let score = 0;

  const suspiciousWords = ["gift", "free", "reward", "offer"];

  if (data.merchant) {

    const merchant = data.merchant.toLowerCase();

    suspiciousWords.forEach(word => {
      if (merchant.includes(word)) {
        score += 30;
      }
    });

  }

  const amount = Number(data.amount);

  if (amount > 3000) score += 20;

  if (amount === 0) score += 10;

  return {
    fraudScore: score
  };
}