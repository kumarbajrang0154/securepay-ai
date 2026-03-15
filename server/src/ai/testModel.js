/**
 * AI Fraud Detection Model - Test Examples
 * Demonstrates the predictFraud function with various scenarios
 */

import { predictFraud, getRiskLevel, modelExamples } from './fraudModel.js';

console.log('🔍 SecurePay AI - Fraud Detection Model Test\n');

// Test the model with example cases
modelExamples.forEach((example, index) => {
  console.log(`Test Case ${index + 1}:`);
  console.log('Input Features:', example.input);

  const probability = predictFraud(example.input);
  const score = Math.round(probability * 100);
  const risk = getRiskLevel(probability);

  console.log('AI Prediction:');
  console.log(`  Fraud Probability: ${(probability * 100).toFixed(1)}%`);
  console.log(`  Fraud Score: ${score}`);
  console.log(`  Risk Level: ${risk}`);
  console.log(`  Expected: ${example.expectedOutput.riskLevel} (${example.expectedOutput.fraudScore})`);
  console.log('---\n');
});

// Additional real-world test cases
console.log('🚀 Additional Test Cases:\n');

const testCases = [
  {
    name: 'Legitimate Small Transaction',
    features: { amount: 50, communityReports: 0, previouslyReported: false, isBlacklisted: false, keywordRisk: false, upiRisk: 0.1 }
  },
  {
    name: 'Medium Risk - High Amount',
    features: { amount: 2500, communityReports: 1, previouslyReported: false, isBlacklisted: false, keywordRisk: false, upiRisk: 0.2 }
  },
  {
    name: 'High Risk - Blacklisted',
    features: { amount: 1000, communityReports: 5, previouslyReported: true, isBlacklisted: true, keywordRisk: true, upiRisk: 1.0 }
  }
];

testCases.forEach(testCase => {
  console.log(`${testCase.name}:`);
  const probability = predictFraud(testCase.features);
  const score = Math.round(probability * 100);
  const risk = getRiskLevel(probability);

  console.log(`  Fraud Probability: ${(probability * 100).toFixed(1)}%`);
  console.log(`  Fraud Score: ${score}`);
  console.log(`  Risk Level: ${risk}`);
  console.log('---\n');
});

console.log('✅ AI Model Test Complete');