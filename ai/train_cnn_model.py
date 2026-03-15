#!/usr/bin/env python3
"""SecurePay AI - CNN Training for QR Fraud Detection

This script trains a simple convolutional neural network (CNN) on QR code images.
The dataset is expected to be structured as:
  dataset/
    safe_qr/   (legitimate QR images)
    fraud_qr/  (scam QR images)

The training pipeline includes:
  - data augmentation (rotation, shift, zoom, flip)
  - train/validation split
  - early stopping
  - model checkpointing
  - evaluation (accuracy, precision, recall, confusion matrix)

Output:
  qr_fraud_cnn.h5

"""

from __future__ import annotations

import argparse
import os
from pathlib import Path

import numpy as np
import tensorflow as tf
from sklearn.metrics import (  # type: ignore
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.preprocessing.image import ImageDataGenerator


def build_model(input_shape: tuple[int, int, int] = (224, 224, 3)) -> models.Model:
    """Builds a small CNN model for binary classification."""

    model = models.Sequential(
        [
            layers.Conv2D(32, (3, 3), activation="relu", input_shape=input_shape),
            layers.MaxPooling2D((2, 2)),
            layers.Conv2D(64, (3, 3), activation="relu"),
            layers.MaxPooling2D((2, 2)),
            layers.Flatten(),
            layers.Dense(128, activation="relu"),
            layers.Dropout(0.5),
            layers.Dense(1, activation="sigmoid"),
        ]
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )

    return model


def create_data_generators(
    data_dir: Path,
    image_size: tuple[int, int] = (224, 224),
    batch_size: int = 32,
    validation_split: float = 0.2,
):
    """Creates training and validation generators from folder structure."""

    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        fill_mode="nearest",
        validation_split=validation_split,
    )

    valid_datagen = ImageDataGenerator(rescale=1.0 / 255.0, validation_split=validation_split)

    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=image_size,
        batch_size=batch_size,
        class_mode="binary",
        subset="training",
        shuffle=True,
        seed=42,
    )

    validation_generator = valid_datagen.flow_from_directory(
        data_dir,
        target_size=image_size,
        batch_size=batch_size,
        class_mode="binary",
        subset="validation",
        shuffle=False,
        seed=42,
    )

    return train_generator, validation_generator


def evaluate_model(model: models.Model, generator: tf.keras.preprocessing.image.DirectoryIterator) -> None:
    """Evaluate the model on a data generator and print metrics."""

    # predict_proba for validation set
    y_true = generator.classes
    y_pred_proba = model.predict(generator, verbose=0)
    y_pred = (y_pred_proba >= 0.5).astype(int).reshape(-1)

    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, zero_division=0)
    rec = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)

    cm = confusion_matrix(y_true, y_pred)

    print("\n=== Evaluation ===")
    print(f"Accuracy : {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall   : {rec:.4f}")
    print(f"F1 score : {f1:.4f}")
    print("\nConfusion matrix:")
    print(cm)


def main(
    dataset_dir: str,
    output_model: str,
    epochs: int = 15,
    batch_size: int = 32,
    validation_split: float = 0.2,
) -> None:
    data_dir = Path(dataset_dir)

    if not data_dir.exists():
        raise FileNotFoundError(f"Dataset directory not found: {data_dir}")

    model_path = Path(output_model)

    train_gen, val_gen = create_data_generators(
        data_dir,
        image_size=(224, 224),
        batch_size=batch_size,
        validation_split=validation_split,
    )

    model = build_model(input_shape=(224, 224, 3))

    callbacks = [
        EarlyStopping(monitor="val_loss", patience=4, restore_best_weights=True),
        ModelCheckpoint(
            filepath=str(model_path),
            monitor="val_loss",
            save_best_only=True,
            save_weights_only=False,
            verbose=1,
        ),
    ]

    model.fit(
        train_gen,
        epochs=epochs,
        validation_data=val_gen,
        callbacks=callbacks,
        verbose=2,
    )

    # Ensure best weights are loaded (if checkpoint saved)
    if model_path.exists():
        model = tf.keras.models.load_model(model_path)

    evaluate_model(model, val_gen)

    # Save final model (if checkpoint was not triggered)
    model.save(model_path)
    print(f"\nSaved trained model to: {model_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train CNN fraud detection model")
    parser.add_argument(
        "--dataset",
        type=str,
        default="dataset",
        help="Root folder with safe_qr/ and fraud_qr/ subfolders",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="qr_fraud_cnn.h5",
        help="Output model file path",
    )
    parser.add_argument(
        "--epochs",
        type=int,
        default=15,
        help="Number of training epochs",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=32,
        help="Training batch size",
    )
    parser.add_argument(
        "--validation-split",
        type=float,
        default=0.2,
        help="Validation split fraction",
    )
    args = parser.parse_args()

    main(
        dataset_dir=args.dataset,
        output_model=args.output,
        epochs=args.epochs,
        batch_size=args.batch_size,
        validation_split=args.validation_split,
    )
