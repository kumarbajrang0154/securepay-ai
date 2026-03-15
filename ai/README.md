# SecurePay AI - Machine Learning Pipeline

This directory contains the complete AI-powered fraud detection pipeline for SecurePay AI.

## 🚀 Quick Start

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Generate Training Dataset
```bash
python dataset_generator.py
```
This connects to MongoDB and creates `fraud_dataset.csv` from transaction and fraud data.

### 3. Train ML Model
```bash
python train_model.py
```
This trains a RandomForest model and saves it as `fraud_model.pkl`.

### 4. Start Prediction API
```bash
python predict_api.py
```
This starts the Flask API on `http://localhost:5001` for real-time predictions.

## 📊 Dataset Features

The ML model uses these features:
- `amount`: Transaction amount
- `communityReports`: Number of community fraud reports
- `previouslyReported`: Whether user previously reported this UPI
- `isBlacklisted`: Whether UPI is blacklisted
- `keywordRisk`: Binary flag for suspicious keywords in merchant name
- `upiPatternRisk`: Binary flag for suspicious patterns in UPI ID

## 🤖 Model Details

- **Algorithm**: RandomForestClassifier
- **Libraries**: scikit-learn, pandas, joblib
- **Output**: Fraud probability (0.0 to 1.0)
- **Training**: Automated from MongoDB data

## 🔌 API Endpoints

### Health Check
```bash
GET http://localhost:5001/health
```

### Fraud Prediction
```bash
POST http://localhost:5001/predict
Content-Type: application/json

{
  "amount": 5000,
  "communityReports": 6,
  "previouslyReported": false,
  "isBlacklisted": false,
  "keywordRisk": 1,
  "upiPatternRisk": 1
}
```

Response:
```json
{
  "fraudProbability": 0.84,
  "prediction": 1,
  "confidence": 0.84
}
```

## 🔄 Integration

The Node.js backend automatically uses the AI model when available. If the Python API is unavailable, it falls back to the rule-based system.

## 📈 Model Performance

After training, the model provides:
- Accuracy metrics
- Feature importance rankings
- Confusion matrix
- Classification report

## 🛠️ Troubleshooting

### Model Not Found
If `fraud_model.pkl` is missing, run the training pipeline:
```bash
python dataset_generator.py
python train_model.py
```

### MongoDB Connection Issues
Ensure MongoDB is running on `localhost:27017` or update the connection string in `dataset_generator.py`.

### Port Conflicts
The Flask API runs on port 5001. If needed, modify the port in `predict_api.py`.

## 📁 File Structure

```
ai/
├── dataset_generator.py    # Generate training data from MongoDB
├── train_model.py         # Train and save ML model
├── predict_api.py         # Flask API for predictions
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🔄 Workflow

1. **Data Collection**: Transactions and fraud reports accumulate in MongoDB
2. **Dataset Generation**: Extract features and labels from database
3. **Model Training**: Train RandomForest on historical data
4. **Real-time Prediction**: Flask API serves predictions to Node.js backend
5. **Continuous Learning**: Retrain model periodically with new data

The system provides both rule-based reliability and AI-powered accuracy for comprehensive fraud detection.