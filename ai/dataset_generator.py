#!/usr/bin/env python3
"""
SecurePay AI - Dataset Generator
Generates ML training dataset from MongoDB collections
"""

import pandas as pd
import pymongo
from pymongo import MongoClient
import re
from datetime import datetime
import os

def connect_mongodb():
    """Connect to MongoDB database"""
    try:
        # Connect to local MongoDB (adjust connection string as needed)
        client = MongoClient('mongodb://localhost:27017/')
        db = client['securepay_ai']
        print("✅ Connected to MongoDB")
        return db
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return None

def extract_features_from_transaction(transaction):
    """Extract ML features from transaction data"""
    features = {}

    # Basic features
    features['amount'] = transaction.get('amount', 0)
    features['communityReports'] = transaction.get('communityReports', 0)
    features['previouslyReported'] = 1 if transaction.get('previouslyReported', False) else 0

    # Merchant analysis for keyword risk
    merchant = str(transaction.get('merchant', '')).lower()
    suspicious_keywords = ['gift', 'reward', 'free', 'offer', 'bonus', 'lottery', 'prize', 'cashback']
    features['keywordRisk'] = 1 if any(keyword in merchant for keyword in suspicious_keywords) else 0

    # UPI ID analysis for pattern risk
    upi_id = str(transaction.get('upiId', '')).lower()
    high_risk_patterns = ['scam', 'test', 'fake', 'fraud']
    features['upiPatternRisk'] = 1 if any(pattern in upi_id for pattern in high_risk_patterns) else 0

    return features

def generate_dataset(db):
    """Generate ML dataset from MongoDB collections"""
    print("🔄 Generating dataset from transactions...")

    # Get all transactions
    transactions = list(db.transactions.find({}))

    if not transactions:
        print("⚠️  No transactions found in database")
        return None

    dataset = []

    for transaction in transactions:
        try:
            # Extract features from transaction
            features = extract_features_from_transaction(transaction)

            # Check if this UPI has fraud reports (label)
            upi_id = transaction.get('upiId', '')
            fraud_report = db.fraudreports.find_one({'upiId': upi_id})
            is_fraud = 1 if fraud_report else 0

            # Check blacklist status from FraudStats
            fraud_stats = db.fraudstats.find_one({'upiId': upi_id})
            is_blacklisted = 1 if fraud_stats and fraud_stats.get('isBlacklisted', False) else 0

            # Add blacklist feature
            features['isBlacklisted'] = is_blacklisted

            # Add label
            features['isFraud'] = is_fraud

            # Add transaction metadata
            features['upiId'] = upi_id
            features['merchant'] = transaction.get('merchant', '')
            features['transactionId'] = str(transaction.get('_id', ''))

            dataset.append(features)

        except Exception as e:
            print(f"⚠️  Error processing transaction: {e}")
            continue

    if not dataset:
        print("❌ No valid data found")
        return None

    # Convert to DataFrame
    df = pd.DataFrame(dataset)

    # Ensure we have both fraud and non-fraud examples
    fraud_count = df['isFraud'].sum()
    total_count = len(df)

    print(f"📊 Dataset generated:")
    print(f"   Total samples: {total_count}")
    print(f"   Fraud cases: {fraud_count}")
    print(f"   Safe cases: {total_count - fraud_count}")
    print(".1f")

    return df

def save_dataset(df, filename='fraud_dataset.csv'):
    """Save dataset to CSV file"""
    try:
        df.to_csv(filename, index=False)
        print(f"💾 Dataset saved to {filename}")
        print(f"   File size: {os.path.getsize(filename)} bytes")
        return True
    except Exception as e:
        print(f"❌ Failed to save dataset: {e}")
        return False

def main():
    """Main execution function"""
    print("🤖 SecurePay AI - Dataset Generator")
    print("=" * 40)

    # Connect to database
    db = connect_mongodb()
    if not db:
        return

    # Generate dataset
    dataset = generate_dataset(db)
    if dataset is None:
        return

    # Save dataset
    success = save_dataset(dataset)

    if success:
        print("\n✅ Dataset generation completed successfully!")
        print("Next steps:")
        print("1. Run: python train_model.py")
        print("2. Run: python predict_api.py")
    else:
        print("\n❌ Dataset generation failed!")

if __name__ == "__main__":
    main()