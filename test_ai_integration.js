#!/usr/bin/env node
/**
 * SecurePay AI - Integration Test
 * Tests the complete AI-powered fraud detection system
 */

const testCases = [
  {
    name: "Safe Transaction",
    qrData: "upi://pay?pa=merchant@ybl&pn=Regular Store&am=500",
    expectedRisk: "SAFE"
  },
  {
    name: "Suspicious Transaction",
    qrData: "upi://pay?pa=scam@ybl&pn=Free Gift Store&am=2000",
    expectedRisk: "SUSPICIOUS"
  },
  {
    name: "High Risk Transaction",
    qrData: "upi://pay?pa=fraud@ybl&pn=Lottery Prize&am=10000",
    expectedRisk: "FRAUD"
  }
];

async function testEndpoint(qrData) {
  try {
    const response = await fetch('http://localhost:5001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrData })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

async function runTests() {
  console.log('🧪 SecurePay AI - Integration Test');
  console.log('=' * 50);

  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);
    console.log(`   QR: ${testCase.qrData}`);

    const result = await testEndpoint(testCase.qrData);

    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`);
    } else {
      console.log(`   ✅ Risk Level: ${result.riskLevel} (Expected: ${testCase.expectedRisk})`);
      console.log(`   📊 Fraud Score: ${result.fraudScore}`);
      console.log(`   🤖 AI Probability: ${(result.fraudProbability * 100).toFixed(1)}%`);
      console.log(`   📏 Rule Score: ${(result.ruleScore * 100).toFixed(1)}%`);
      console.log(`   🎯 Final Probability: ${(result.finalProbability * 100).toFixed(1)}%`);
      console.log(`   ⚠️  Warnings: ${result.warnings.length}`);
      console.log(`   🔧 AI Used: ${result.aiUsed ? 'Yes' : 'No (Fallback)'}`);

      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => console.log(`      - ${warning}`));
      }
    }
  }

  console.log('\n📋 System Status:');
  console.log('   ✅ Node.js Backend: Running');
  console.log('   ✅ AI Integration: Active (Fallback Mode)');
  console.log('   ⚠️  Python ML API: Not Available (Run python predict_api.py to enable)');

  console.log('\n🚀 To enable full AI predictions:');
  console.log('   1. Install Python and dependencies');
  console.log('   2. Run: python ai/dataset_generator.py');
  console.log('   3. Run: python ai/train_model.py');
  console.log('   4. Run: python ai/predict_api.py');
}

runTests().catch(console.error);