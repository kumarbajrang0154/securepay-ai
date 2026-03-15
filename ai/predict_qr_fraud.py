#!/usr/bin/env python3
"""SecurePay AI - QR Fraud Prediction (CNN)

Loads a trained CNN model (qr_fraud_cnn.h5) and predicts probability that an
input QR image is fraudulent.

Example:
  python ai/predict_qr_fraud.py --image path/to/qr.png

Output:
  {"fraudProbability": 0.76}
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import tensorflow as tf


def load_model(model_path: Path) -> tf.keras.Model:
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")
    return tf.keras.models.load_model(model_path)


def preprocess_image(image_path: Path, target_size: tuple[int, int] = (224, 224)) -> np.ndarray:
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=target_size)
    arr = tf.keras.preprocessing.image.img_to_array(img)
    arr = arr / 255.0
    return np.expand_dims(arr, axis=0)


def predict(model: tf.keras.Model, image_array: np.ndarray) -> float:
    proba = model.predict(image_array, verbose=0)
    # Output is probability of class 1 (fraud) since sigmoid output
    return float(proba[0][0])


def main() -> None:
    parser = argparse.ArgumentParser(description="Predict fraud probability for a QR image")
    parser.add_argument("--image", required=True, type=str, help="Path to QR image file")
    parser.add_argument(
        "--model",
        type=str,
        default="qr_fraud_cnn.h5",
        help="Path to trained CNN model",
    )
    args = parser.parse_args()

    model_path = Path(args.model)
    image_path = Path(args.image)

    if not image_path.exists():
        raise FileNotFoundError(f"Image file not found: {image_path}")

    model = load_model(model_path)
    img_arr = preprocess_image(image_path)

    fraud_probability = predict(model, img_arr)

    print({"fraudProbability": round(fraud_probability, 6)})


if __name__ == "__main__":
    main()
