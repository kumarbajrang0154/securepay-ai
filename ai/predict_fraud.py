#!/usr/bin/env python3
"""SecurePay AI - Fraud Prediction

Loads a trained fraud model pipeline (fraud_model.pkl) and returns a fraud probability
for an input feature vector.

Example:
  python ai/predict_fraud.py --amount 5000 --amountHighRisk 1 --keywordRisk 1 --upiDomainRisk 1 \
    --merchantLength 15 --communityReports 4 --previousReports 1 --isBlacklisted 0

Or pass a JSON object:
  python ai/predict_fraud.py --input '{"amount":5000,...}'
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict

import joblib


REQUIRED_FEATURES = [
    "amount",
    "amountHighRisk",
    "keywordRisk",
    "upiDomainRisk",
    "merchantLength",
    "communityReports",
    "previousReports",
    "isBlacklisted",
]


def load_model(model_path: Path):
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")
    return joblib.load(model_path)


def parse_input(args: argparse.Namespace) -> Dict[str, Any]:
    if args.input:
        try:
            payload = json.loads(args.input)
        except Exception as e:
            raise ValueError(f"Invalid input JSON: {e}")
        if not isinstance(payload, dict):
            raise ValueError("Input JSON must be an object")
        return payload

    features: Dict[str, Any] = {}
    for feature in REQUIRED_FEATURES:
        value = getattr(args, feature, None)
        if value is None:
            raise ValueError(f"Missing required feature: {feature}")
        features[feature] = value

    return features


def validate_features(features: Dict[str, Any]) -> Dict[str, float]:
    out: Dict[str, float] = {}
    for feature in REQUIRED_FEATURES:
        if feature not in features:
            raise ValueError(f"Missing feature: {feature}")
        try:
            out[feature] = float(features[feature])
        except Exception as e:
            raise ValueError(f"Could not convert '{feature}' to float: {e}")
    return out


def predict_fraud_probability(model: Any, features: Dict[str, float]) -> float:
    X = [[
        features["amount"],
        features["amountHighRisk"],
        features["keywordRisk"],
        features["upiDomainRisk"],
        features["merchantLength"],
        features["communityReports"],
        features["previousReports"],
        features["isBlacklisted"],
    ]]

    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X)
        return float(proba[0][1])

    pred = model.predict(X)
    return float(pred[0])


def main() -> None:
    parser = argparse.ArgumentParser(description="Predict fraud probability from fraud model")
    parser.add_argument("--input", type=str, help="JSON string containing feature values")
    parser.add_argument("--amount", type=float, help="Transaction amount")
    parser.add_argument("--amountHighRisk", type=int, choices=[0, 1], help="Amount high risk flag")
    parser.add_argument("--keywordRisk", type=int, choices=[0, 1], help="Keyword risk flag")
    parser.add_argument("--upiDomainRisk", type=int, choices=[0, 1], help="UPI domain risk flag")
    parser.add_argument("--merchantLength", type=int, help="Length of merchant name")
    parser.add_argument("--communityReports", type=int, default=0, help="Community reports count")
    parser.add_argument("--previousReports", type=int, default=0, help="Previous reports count")
    parser.add_argument("--isBlacklisted", type=int, choices=[0, 1], default=0, help="Blacklisted flag")
    parser.add_argument(
        "--model",
        type=str,
        default="fraud_model.pkl",
        help="Path to the saved model pipeline",
    )

    args = parser.parse_args()

    model = load_model(Path(args.model))
    raw = parse_input(args)
    features = validate_features(raw)

    fraud_probability = predict_fraud_probability(model, features)

    output = {
        "fraudProbability": round(fraud_probability, 6),
        "features": features,
    }

    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
