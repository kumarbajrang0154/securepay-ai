#!/usr/bin/env python3
"""SecurePay AI - Flask API for QR Fraud Prediction

Provides a simple API endpoint to upload a QR image and receive a fraud probability.

Endpoints:
  POST /predict_qr_image
    - Form field: file (image)
    - Returns JSON: {"fraudProbability": 0.76}

"""

from __future__ import annotations

import io
import logging
from pathlib import Path
from typing import Any, Dict

import flask
import tensorflow as tf
from PIL import Image


MODEL_PATH = Path("qr_fraud_cnn.h5")


def load_model(model_path: Path) -> tf.keras.Model:
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")
    return tf.keras.models.load_model(model_path)


def preprocess_image(file_stream: io.BytesIO, target_size: tuple[int, int] = (224, 224)) -> Any:
    img = Image.open(file_stream).convert("RGB")
    img = img.resize(target_size)
    arr = tf.keras.preprocessing.image.img_to_array(img)
    arr = arr / 255.0
    return tf.expand_dims(arr, axis=0)


def create_app(model: tf.keras.Model) -> flask.Flask:
    app = flask.Flask(__name__)

    @app.route("/predict_qr_image", methods=["POST"])
    def predict_qr_image() -> flask.Response:
        if "file" not in flask.request.files:
            return flask.jsonify({"error": "Missing file field (name=\"file\")"}), 400

        file = flask.request.files["file"]
        if file.filename == "":
            return flask.jsonify({"error": "Empty filename"}), 400

        try:
            file_bytes = file.read()
            img = preprocess_image(io.BytesIO(file_bytes))
            proba = float(model.predict(img, verbose=0)[0][0])
            return flask.jsonify({"fraudProbability": round(proba, 6)})
        except Exception as exc:
            logging.exception("Prediction failed")
            return flask.jsonify({"error": str(exc)}), 500

    @app.route("/health", methods=["GET"])
    def health() -> flask.Response:
        return flask.jsonify({"status": "ok"})

    return app


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    model = load_model(MODEL_PATH)
    app = create_app(model)
    app.run(host="0.0.0.0", port=5000)
