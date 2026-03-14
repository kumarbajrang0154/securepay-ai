import joblib
import pandas as pd
import sys
import json

model = joblib.load("fraud_model.pkl")

data = json.loads(sys.argv[1])

df = pd.DataFrame([data])

prediction = model.predict(df)

print(prediction[0])