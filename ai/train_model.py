#!/usr/bin/env python3
"""SecurePay AI - Model Training

Trains multiple classifiers on the QR fraud dataset and selects the best model.

This script:
  - loads fraud_dataset.csv
  - cleans and normalizes features
  - uses SMOTE to balance classes
  - trains RandomForest, GradientBoosting, and XGBoost models
  - evaluates models with cross-validation and held-out test set
  - selects best model based on F1 and ROC AUC
  - saves the winning model pipeline as fraud_model.pkl

"""

from __future__ import annotations

import argparse
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import (  # noqa: F401
    StratifiedKFold,
    cross_validate,
    train_test_split,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier


@dataclass(frozen=True)
class TrainConfig:
    dataset_csv: Path = Path("fraud_dataset.csv")
    output_model: Path = Path("fraud_model.pkl")
    output_scaler: Path = Path("scaler.pkl")
    test_size: float = 0.2
    random_state: int = 42
    cv_folds: int = 5


def load_dataset(path: Path) -> Optional[pd.DataFrame]:
    if not path.exists():
        print(f"❌ Dataset file not found: {path}")
        return None

    df = pd.read_csv(path)
    print(f"✅ Loaded dataset: {len(df)} samples")
    return df


def validate_dataset(df: pd.DataFrame) -> bool:
    required_columns = [
        "amount",
        "amountHighRisk",
        "keywordRisk",
        "upiDomainRisk",
        "merchantLength",
        "communityReports",
        "previousReports",
        "isBlacklisted",
        "label",
    ]
    missing = [c for c in required_columns if c not in df.columns]
    if missing:
        print(f"❌ Missing columns: {missing}")
        return False

    if df["label"].nunique() != 2:
        print("❌ Label column must have both 0 and 1")
        return False

    return True


def preprocess(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    # Fill missing values and ensure correct dtypes
    df = df.copy()

    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0.0)
    df["amountHighRisk"] = df["amountHighRisk"].fillna(0).astype(int)
    df["keywordRisk"] = df["keywordRisk"].fillna(0).astype(int)
    df["upiDomainRisk"] = df["upiDomainRisk"].fillna(0).astype(int)
    df["merchantLength"] = pd.to_numeric(df["merchantLength"], errors="coerce").fillna(0).astype(int)
    df["communityReports"] = pd.to_numeric(df["communityReports"], errors="coerce").fillna(0).astype(int)
    df["previousReports"] = pd.to_numeric(df["previousReports"], errors="coerce").fillna(0).astype(int)
    df["isBlacklisted"] = df["isBlacklisted"].fillna(0).astype(int)

    df["label"] = df["label"].fillna(0).astype(int)

    feature_cols = [
        "amount",
        "amountHighRisk",
        "keywordRisk",
        "upiDomainRisk",
        "merchantLength",
        "communityReports",
        "previousReports",
        "isBlacklisted",
    ]

    X = df[feature_cols]
    y = df["label"]
    return X, y


def build_pipeline(model) -> Pipeline:
    """Build a pipeline with scaling + model."""

    scaler = StandardScaler()
    return Pipeline(
        [
            ("scaler", scaler),
            ("model", model),
        ]
    )


def evaluate_model(
    name: str,
    pipeline: Pipeline,
    X_test: pd.DataFrame,
    y_test: pd.Series,
) -> Dict[str, float]:
    y_pred = pipeline.predict(X_test)
    y_proba = None
    if hasattr(pipeline, "predict_proba"):
        try:
            y_proba = pipeline.predict_proba(X_test)[:, 1]
        except Exception:
            y_proba = None

    metrics: Dict[str, float] = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, zero_division=0),
        "recall": recall_score(y_test, y_pred, zero_division=0),
        "f1": f1_score(y_test, y_pred, zero_division=0),
        "roc_auc": float("nan"),
    }

    if y_proba is not None and len(np.unique(y_test)) == 2:
        try:
            metrics["roc_auc"] = roc_auc_score(y_test, y_proba)
        except Exception:
            metrics["roc_auc"] = float("nan")

    cm = confusion_matrix(y_test, y_pred)

    print(f"\n🧪 Model: {name}")
    print("-" * (8 + len(name)))
    print(f"Accuracy : {metrics['accuracy']:.4f}")
    print(f"Precision: {metrics['precision']:.4f}")
    print(f"Recall   : {metrics['recall']:.4f}")
    print(f"F1 Score : {metrics['f1']:.4f}")
    print(f"ROC AUC  : {metrics['roc_auc']:.4f}")
    print("\nConfusion Matrix")
    print("\tPred Safe\tPred Fraud")
    print(f"True Safe\t{cm[0,0]}\t\t{cm[0,1]}")
    print(f"True Fraud\t{cm[1,0]}\t\t{cm[1,1]}")

    return metrics


def select_best_model(
    scores: Dict[str, Dict[str, float]]
) -> str:
    """Choose best model by F1 then ROC AUC."""

    best = None
    best_tuple: Tuple[float, float] = (-1.0, -1.0)

    for name, metrics in scores.items():
        f1 = metrics.get("f1", 0.0)
        roc = metrics.get("roc_auc", 0.0)
        candidate = (f1, roc)
        if candidate > best_tuple:
            best_tuple = candidate
            best = name

    return best or ""


def cross_validate_model(
    pipeline: Pipeline,
    X: pd.DataFrame,
    y: pd.Series,
    cv: int,
) -> Dict[str, float]:
    scoring = {
        "accuracy": "accuracy",
        "precision": "precision",
        "recall": "recall",
        "f1": "f1",
        "roc_auc": "roc_auc",
    }

    cv_results = cross_validate(
        pipeline,
        X,
        y,
        cv=cv,
        scoring=scoring,
        return_train_score=False,
        n_jobs=-1,
    )

    return {k: float(np.mean(v)) for k, v in cv_results.items() if k.startswith("test_")}


def main(config: TrainConfig) -> None:
    print("🤖 SecurePay AI - Train Advanced Fraud Model")
    print("=" * 56)

    df = load_dataset(config.dataset_csv)
    if df is None:
        return

    if not validate_dataset(df):
        return

    X, y = preprocess(df)
    print(f"📊 Dataset shape: {X.shape}")
    print(f"📊 Label distribution: {y.value_counts().to_dict()}")

    # Split for final evaluation
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=config.test_size, random_state=config.random_state, stratify=y
    )

    print(f"   Training samples: {len(X_train)}")
    print(f"   Testing samples : {len(X_test)}")

    # Balance training data with SMOTE
    smote = SMOTE(random_state=config.random_state)
    X_train_bal, y_train_bal = smote.fit_resample(X_train, y_train)
    print(f"📈 After SMOTE: {len(X_train_bal)} samples (label dist: {pd.Series(y_train_bal).value_counts().to_dict()})")

    # Define candidate models
    candidates = {
        "RandomForest": RandomForestClassifier(
            n_estimators=200,
            max_depth=12,
            class_weight="balanced",
            random_state=config.random_state,
            n_jobs=-1,
        ),
        "GradientBoosting": GradientBoostingClassifier(
            n_estimators=200,
            max_depth=8,
            random_state=config.random_state,
        ),
        "XGBoost": XGBClassifier(
            use_label_encoder=False,
            eval_metric="logloss",
            n_estimators=200,
            max_depth=8,
            scale_pos_weight=1,
            random_state=config.random_state,
            n_jobs=-1,
        ),
    }

    all_scores: Dict[str, Dict[str, float]] = {}

    for name, model in candidates.items():
        pipeline = build_pipeline(model)

        # Cross validation on the balanced training set
        cv_scores = cross_validate_model(pipeline, X_train_bal, y_train_bal, config.cv_folds)
        print(f"\n🧪 Cross-validation results for {name} (mean over {config.cv_folds} folds):")
        for metric_name, val in cv_scores.items():
            print(f"  {metric_name.replace('test_', ''):10s}: {val:.4f}")

        # Train full pipeline on balanced training data
        pipeline.fit(X_train_bal, y_train_bal)
        metrics = evaluate_model(name, pipeline, X_test, y_test)
        all_scores[name] = metrics

    best_name = select_best_model(all_scores)
    if not best_name:
        print("❌ Could not select a best model")
        return

    print(f"\n🏆 Selected best model: {best_name}")

    best_pipeline = build_pipeline(candidates[best_name])
    best_pipeline.fit(X_train_bal, y_train_bal)

    # Save pipelines
    joblib.dump(best_pipeline, config.output_model)
    print(f"💾 Best model saved to: {config.output_model}")

    # Save scaler separately (useful for downstream feature scaling)
    scaler = best_pipeline.named_steps.get("scaler")
    if scaler is not None:
        joblib.dump(scaler, config.output_scaler)
        print(f"💾 Scaler saved to: {config.output_scaler}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train fraud detection model")
    parser.add_argument(
        "--dataset",
        type=str,
        default="fraud_dataset.csv",
        help="Path to fraud dataset CSV",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="fraud_model.pkl",
        help="Path to save the trained model pipeline",
    )
    parser.add_argument(
        "--scaler",
        type=str,
        default="scaler.pkl",
        help="Path to save the trained scaler",
    )
    parser.add_argument(
        "--test-size",
        type=float,
        default=0.2,
        help="Hold-out test set fraction",
    )
    parser.add_argument(
        "--random-state",
        type=int,
        default=42,
        help="Random seed",
    )
    parser.add_argument(
        "--cv-folds",
        type=int,
        default=5,
        help="Number of cross-validation folds",
    )

    args = parser.parse_args()

    cfg = TrainConfig(
        dataset_csv=Path(args.dataset),
        output_model=Path(args.output),
        output_scaler=Path(args.scaler),
        test_size=args.test_size,
        random_state=args.random_state,
        cv_folds=args.cv_folds,
    )

    main(cfg)
