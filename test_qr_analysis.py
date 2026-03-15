#!/usr/bin/env python3
"""Test script to verify QR analysis is working"""

import requests
import json

def test_qr_analysis():
    # Test QR data (sample UPI QR)
    test_qr = "upi://pay?pa=merchant@upi&pn=Test%20Merchant&am=100.00&cu=INR"

    payload = {
        "qrData": test_qr,
        "mobile": "9999999999"
    }

    try:
        print("🧪 Testing QR analysis...")
        print(f"📱 QR Data: {test_qr}")
        print(f"📞 Mobile: {payload['mobile']}")

        response = requests.post(
            "http://localhost:5000/api/analyze",
            json=payload,
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            print("✅ Analysis successful!")
            print(f"🏪 Merchant: {result.get('merchant')}")
            print(f"💰 Amount: ₹{result.get('amount')}")
            print(f"🎯 Fraud Score: {result.get('fraudScore')}%")
            print(f"⚠️ Risk Level: {result.get('riskLevel')}")
            print(f"🤖 AI Used: {result.get('aiUsed', 'N/A')}")
            return True
        else:
            print(f"❌ Analysis failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is the Node.js server running on port 5000?")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_qr_analysis()
    if success:
        print("\n🎉 QR analysis is working correctly!")
    else:
        print("\n💥 QR analysis has issues. Check server logs.")