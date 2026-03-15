#!/usr/bin/env python3
"""
SecurePay AI - Prediction API
Flask API for real-time fraud prediction using trained ML model
"""

from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
from datetime import datetime

app = Flask(__name__)

# Global model variable
model = None

def load_model():
    """Load trained model from file"""
    global model
    try:
        if os.path.exists('fraud_model.pkl'):
            model = joblib.load('fraud_model.pkl')
            print("✅ ML model loaded successfully")
            return True
        else:
            print("❌ Model file 'fraud_model.pkl' not found!")
            print("Train the model first: python train_model.py")
            return False
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        return False

def predict_fraud(features):
    """Make fraud prediction using loaded model"""
    if model is None:
        return {"error": "Model not loaded"}

    try:
        # Convert features to numpy array
        feature_array = np.array([[
            features['amount'],
            features['communityReports'],
            features['previouslyReported'],
            features['isBlacklisted'],
            features['keywordRisk'],
            features['upiPatternRisk']
        ]])

        # Make prediction
        prediction = model.predict(feature_array)[0]
        probability = model.predict_proba(feature_array)[0][1]  # Probability of fraud (class 1)

        return {
            "fraudProbability": float(probability),
            "prediction": int(prediction),
            "confidence": float(max(probability, 1-probability))
        }

    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Fraud prediction endpoint"""
    try:
        # Get JSON data
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Validate required features
        required_features = [
            'amount', 'communityReports', 'previouslyReported',
            'isBlacklisted', 'keywordRisk', 'upiPatternRisk'
        ]

        missing_features = [f for f in required_features if f not in data]
        if missing_features:
            return jsonify({
                "error": f"Missing required features: {missing_features}"
            }), 400

        # Make prediction
        result = predict_fraud(data)

        if "error" in result:
            return jsonify(result), 500

        # Log prediction for monitoring
        print(f"🔍 Prediction: {result['fraudProbability']:.3f} fraud probability")

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Request processing failed: {str(e)}"}), 500

@app.route('/', methods=['GET'])
def index():
    """API information endpoint"""
    return jsonify({
        "name": "SecurePay AI - Fraud Prediction API",
        "version": "1.0.0",
        "model_loaded": model is not None,
        "endpoints": {
            "GET /health": "Health check",
            "POST /predict": "Fraud prediction",
            "GET /": "API information"
        },
        "features": [
            "amount", "communityReports", "previouslyReported",
            "isBlacklisted", "keywordRisk", "upiPatternRisk"
        ]
    })

def main():
    """Main function to start Flask server"""
    print("🤖 SecurePay AI - Prediction API")
    print("=" * 40)

    # Load model
    if not load_model():
        print("❌ Cannot start API without trained model")
        return

    # Start Flask server
    print("🚀 Starting Flask server on http://localhost:5001")
    print("📊 Model loaded and ready for predictions")
    print("\nEndpoints:")
    print("  GET  /health     - Health check")
    print("  POST /predict    - Fraud prediction")
    print("  GET  /          - API information")
    print("\nPress Ctrl+C to stop")

    app.run(host='0.0.0.0', port=5001, debug=False)

if __name__ == "__main__":
    main()