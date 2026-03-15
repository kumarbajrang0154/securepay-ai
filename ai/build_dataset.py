#!/usr/bin/env python3
"""SecurePay AI - QR Dataset Builder

Builds a tabular dataset for fraud model training from UPI QR images.

Expected directory structure:
  dataset/
    safe_qr/
    fraud_qr/

Output:
  fraud_dataset.csv

This loader extracts UPI fields from QR payloads and produces feature columns for
model training.
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path
from typing import Dict, Iterator, List, Optional

try:
    import cv2  # type: ignore
    from pyzbar.pyzbar import decode as decode_qr  # type: ignore
except ImportError as e:
    raise ImportError(
        "Missing dependency: install opencv-python and pyzbar (e.g., `pip install opencv-python pyzbar`)."
    ) from e

from urllib.parse import parse_qs, urlparse


# Words often used in fraudulent offers
SUSPICIOUS_KEYWORDS = {
    "reward",
    "gift",
    "cashback",
    "lottery",
    "bonus",
    "offer",
    "free",
    "urgent",
    "win",
    "voucher",
    "discount",
    "surprise",
    "complimentary",
}

# Suspicious UPI domain fragments
SUSPICIOUS_UPI_DOMAINS = {
    "scam",
    "fraud",
    "fake",
    "test",
    "bot",
    "hack",
    "phish",
    "malware",
    "evil",
    "blacklist",
}


def list_qr_images(folder: Path) -> List[Path]:
    """Return a list of image files in the folder."""

    if not folder.exists():
        return []

    allowed_ext = {".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tiff"}
    return [p for p in folder.rglob("*") if p.suffix.lower() in allowed_ext]


def decode_qr_from_image(image_path: Path) -> Optional[str]:
    """Decode the first QR payload found in an image."""

    img = cv2.imread(str(image_path))
    if img is None:
        return None

    decoded = decode_qr(img)
    if not decoded:
        return None

    # Decode bytes to str; ignore characters that don't decode cleanly.
    return decoded[0].data.decode(errors="ignore")


def parse_upi_payload(payload: str) -> Dict[str, str]:
    """Parse a UPI payload and return extracted fields."""

    parsed: Dict[str, str] = {
        "upiId": "",
        "merchant": "",
        "amount": "",
        "currency": "",
    }

    if not payload:
        return parsed

    payload = payload.strip()

    # Standard UPI URI (e.g., upi://pay?pa=...&pn=...&am=...&cu=INR)
    if payload.startswith("upi:") or "?" in payload:
        try:
            parsed_url = urlparse(payload)
            query = parse_qs(parsed_url.query)
            parsed["upiId"] = query.get("pa", [""])[0]
            parsed["merchant"] = query.get("pn", [""])[0]
            parsed["amount"] = query.get("am", [""])[0]
            parsed["currency"] = query.get("cu", [""])[0]
            return parsed
        except Exception:
            pass

    # Some payloads are just a querystring without scheme (pa=...&pn=...)
    if "=" in payload and ("&" in payload or "%" in payload):
        try:
            query = parse_qs(payload)
            parsed["upiId"] = query.get("pa", [""])[0]
            parsed["merchant"] = query.get("pn", [""])[0]
            parsed["amount"] = query.get("am", [""])[0]
            parsed["currency"] = query.get("cu", [""])[0]
            return parsed
        except Exception:
            pass

    # Fallback: if it looks like a UPI ID, treat it as such.
    if "@" in payload and " " not in payload and "\n" not in payload:
        parsed["upiId"] = payload

    return parsed


def detect_keyword_risk(text: str) -> int:
    """Return 1 if any suspicious keyword appears in the text."""

    if not text:
        return 0
    normalized = text.lower()
    return int(any(k in normalized for k in SUSPICIOUS_KEYWORDS))


def detect_upi_domain_risk(upi_id: str) -> int:
    """Return 1 if the UPI ID contains suspicious domain fragments."""

    if not upi_id:
        return 0
    normalized = upi_id.lower()
    return int(any(d in normalized for d in SUSPICIOUS_UPI_DOMAINS))


def safe_float(value: str, default: float = 0.0) -> float:
    """Convert value to float safely."""

    try:
        return float(value)
    except Exception:
        return default


def build_dataset(dataset_root: Path, output_csv: Path) -> int:
    """Build dataset CSV from QR directories."""

    safe_dir = dataset_root / "safe_qr"
    fraud_dir = dataset_root / "fraud_qr"

    rows: List[Dict[str, object]] = []

    def process_image(path: Path, label: int) -> Optional[Dict[str, object]]:
        payload = decode_qr_from_image(path)
        if not payload:
            return None

        parsed = parse_upi_payload(payload)
        amount = safe_float(parsed.get("amount", "0"))
        amount_high_risk = int(amount > 3000)

        merchant = parsed.get("merchant") or ""
        merchant_len = len(merchant.strip()) if merchant else 0

        keyword_risk = detect_keyword_risk(merchant or parsed.get("upiId", ""))
        domain_risk = detect_upi_domain_risk(parsed.get("upiId", ""))

        # isBlacklisted is not directly available from QR; default 0
        is_blacklisted = 0

        return {
            "amount": amount,
            "amountHighRisk": amount_high_risk,
            "keywordRisk": keyword_risk,
            "upiDomainRisk": domain_risk,
            "merchantLength": merchant_len,
            "communityReports": 0,
            "previousReports": 0,
            "isBlacklisted": is_blacklisted,
            "label": label,
            # Optional debug columns
            "source": str(path.relative_to(dataset_root)),
            "rawPayload": payload,
        }

    for img in list_qr_images(safe_dir):
        sample = process_image(img, label=0)
        if sample:
            rows.append(sample)

    for img in list_qr_images(fraud_dir):
        sample = process_image(img, label=1)
        if sample:
            rows.append(sample)

    if not rows:
        raise RuntimeError(
            f"No QR codes decoded. Ensure {safe_dir} and {fraud_dir} contain readable QR images."
        )

    # Stable ordering for reproducibility
    rows.sort(key=lambda r: (r["label"], r["source"]))

    fieldnames = [
        "amount",
        "amountHighRisk",
        "keywordRisk",
        "upiDomainRisk",
        "merchantLength",
        "communityReports",
        "previousReports",
        "isBlacklisted",
        "label",
        "source",
        "rawPayload",
    ]

    with output_csv.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return len(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Build fraud dataset from UPI QR images.")
    parser.add_argument(
        "--dataset-dir",
        type=str,
        default="dataset",
        help="Root folder containing safe_qr/ and fraud_qr/",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="fraud_dataset.csv",
        help="Output CSV filename",
    )
    args = parser.parse_args()

    dataset_root = Path(args.dataset_dir)
    output_csv = Path(args.output)

    print("🤖 SecurePay AI - Build Dataset")
    print("=" * 48)
    print(f"Dataset root: {dataset_root}")

    if not dataset_root.exists():
        raise SystemExit(f"Dataset folder not found: {dataset_root}")

    count = build_dataset(dataset_root, output_csv)

    print(f"✅ Dataset built: {count} samples")
    print(f"📄 CSV saved to: {output_csv}")


if __name__ == "__main__":
    main()
