/**
 * UPI Link Generation Test
 * Tests the UPI deep link generation logic
 */

// Test cases for UPI link generation
const testCases = [
  {
    name: "Standard payment with amount",
    input: {
      merchant: "Test Store",
      upiId: "merchant@ybl",
      amount: 500,
      currency: "INR"
    },
    expected: "upi://pay?pa=merchant@ybl&pn=Test%20Store&am=500&cu=INR"
  },
  {
    name: "Zero amount payment",
    input: {
      merchant: "Free Gift Store",
      upiId: "free@upi",
      amount: 0,
      currency: "INR"
    },
    expected: "upi://pay?pa=free@upi&pn=Free%20Gift%20Store&cu=INR"
  },
  {
    name: "Merchant with special characters",
    input: {
      merchant: "John's Café & Restaurant",
      upiId: "john@paytm",
      amount: 1000,
      currency: "INR"
    },
    expected: "upi://pay?pa=john@paytm&pn=John's%20Caf%C3%A9%20%26%20Restaurant&am=1000&cu=INR"
  },
  {
    name: "No merchant name",
    input: {
      merchant: "",
      upiId: "unknown@upi",
      amount: 200,
      currency: "INR"
    },
    expected: "upi://pay?pa=unknown@upi&pn=Unknown%20Merchant&am=200&cu=INR"
  }
];

// UPI link generation function (same as in RiskResultPage.jsx)
function generateUPILink(merchant, upiId, amount, currency = "INR") {
  const encodedMerchant = encodeURIComponent(merchant || "Unknown Merchant");

  if (amount > 0) {
    return `upi://pay?pa=${upiId}&pn=${encodedMerchant}&am=${amount}&cu=${currency}`;
  } else {
    return `upi://pay?pa=${upiId}&pn=${encodedMerchant}&cu=${currency}`;
  }
}

// Mobile detection function
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Run tests
console.log("🧪 UPI Link Generation Tests");
console.log("=" * 50);

let passed = 0;
let total = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}: ${testCase.name}`);

  const { merchant, upiId, amount, currency } = testCase.input;
  const generated = generateUPILink(merchant, upiId, amount, currency);
  const expected = testCase.expected;

  console.log(`Input:`, testCase.input);
  console.log(`Generated: ${generated}`);
  console.log(`Expected:  ${expected}`);

  if (generated === expected) {
    console.log(`✅ PASSED`);
    passed++;
  } else {
    console.log(`❌ FAILED`);
    console.log(`   Generated length: ${generated.length}`);
    console.log(`   Expected length:  ${expected.length}`);
    // Show first difference
    for (let i = 0; i < Math.min(generated.length, expected.length); i++) {
      if (generated[i] !== expected[i]) {
        console.log(`   First difference at position ${i}: '${generated[i]}' vs '${expected[i]}'`);
        break;
      }
    }
  }
});

console.log(`\n📊 Test Results: ${passed}/${total} passed`);

if (passed === total) {
  console.log("🎉 All UPI link generation tests passed!");
} else {
  console.log("⚠️  Some tests failed. Please check the implementation.");
}

// Test mobile detection
console.log(`\n📱 Mobile Detection: ${isMobileDevice() ? 'Mobile Device' : 'Desktop Device'}`);
console.log("   User Agent:", navigator.userAgent);

console.log("\n🔗 UPI Deep Link Format:");
console.log("   upi://pay?pa={UPI_ID}&pn={MERCHANT}&am={AMOUNT}&cu={CURRENCY}");
console.log("   - pa: Payee address (UPI ID)");
console.log("   - pn: Payee name (Merchant)");
console.log("   - am: Amount (optional if 0)");
console.log("   - cu: Currency (default: INR)");

console.log("\n📱 Supported UPI Apps:");
console.log("   ✅ Google Pay");
console.log("   ✅ PhonePe");
console.log("   ✅ Paytm");
console.log("   ✅ BHIM UPI");
console.log("   ✅ Amazon Pay");
console.log("   ✅ Other UPI-enabled apps");