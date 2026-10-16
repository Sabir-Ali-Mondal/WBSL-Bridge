"""
test_video_sign.py — Test video sign classification using the trained ONNX model.

Takes a video file as input, extracts 258-dim MediaPipe Holistic landmarks
using the exact feature extraction pipeline from train_all_glosses.py,
and predicts the sign class using the trained model in models/onnx_models/3.
"""

import argparse
import json
import sys
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
import onnxruntime as ort

ROOT = Path(__file__).resolve().parent.parent
TRAINING_ZONE = ROOT / "model_training_zone"
sys.path.insert(0, str(ROOT))

from backend.pose import POSE_DIM, pose_from_landmarks  # noqa: E402

DEFAULT_MODEL_DIR = ROOT / "models" / "onnx_models" / "3"
SEQ_T = 32
DIM = 126 + POSE_DIM  # 258

_hol = mp.solutions.holistic.Holistic(
    static_image_mode=False,
    min_detection_confidence=0.5,
)


def extract_frame_features(bgr: np.ndarray) -> np.ndarray | None:
    """
    Extracts 258-dim normalized features from a single frame.
    Matches train_all_glosses.py extract_frame_data().
    """
    res = _hol.process(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
    if not res.left_hand_landmarks or not res.right_hand_landmarks or res.pose_landmarks is None:
        return None

    lh = np.array([[p.x, p.y, p.z] for p in res.left_hand_landmarks.landmark], np.float32)
    rh = np.array([[p.x, p.y, p.z] for p in res.right_hand_landmarks.landmark], np.float32)

    pose = pose_from_landmarks(res.pose_landmarks)

    # Normalize relative to right hand (rh[0] wrist, rh[9] MCP scale)
    ref, scale = rh[0], np.linalg.norm(rh[9] - rh[0]) + 1e-6
    lh_norm = (lh - ref) / scale
    rh_norm = (rh - ref) / scale
    pose_norm = pose.copy()
    pose_norm[:, :3] = (pose_norm[:, :3] - ref) / scale

    # Flatten correctly to 258 dims: 63 (lh) + 63 (rh) + 132 (pose)
    model_features = np.concatenate([
        lh_norm.flatten(),
        rh_norm.flatten(),
        pose_norm.flatten(),
    ]).astype(np.float32)

    return model_features


def process_video(path: Path | str, start_frac: float = 0.10, end_frac: float = 0.90) -> np.ndarray | None:
    """Samples SEQ_T (32) frames and extracts 258-dim feature sequence."""
    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened():
        print(f"Error: Could not open video file '{path}'")
        return None

    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if frame_count < 8:
        print(f"Error: Video too short ({frame_count} frames). Minimum 8 frames required.")
        cap.release()
        return None

    start_idx = int(frame_count * start_frac)
    end_idx = max(int(frame_count * start_frac) + 1, int(frame_count * end_frac) - 1)
    idxs = np.linspace(start_idx, end_idx, SEQ_T).astype(int)

    out_feat = []
    last_feat, good = None, 0

    for ix in idxs:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(ix))
        ok, fr = cap.read()
        if not ok:
            out_feat.append(None)
            continue

        feat = extract_frame_features(fr)
        if feat is not None:
            last_feat = feat
            good += 1

        out_feat.append(feat if feat is not None else last_feat)

    cap.release()

    if good < SEQ_T // 2:
        print(f"Warning: Low detection quality. Detected valid landmarks in only {good}/{SEQ_T} sampled frames.")
        if good == 0:
            return None

    # Replace initial None entries (if any) with the first valid feature vector or zeros
    first_valid = next((f for f in out_feat if f is not None), np.zeros(DIM, np.float32))
    cleaned = []
    curr = first_valid
    for o in out_feat:
        if o is not None:
            curr = o
        cleaned.append(curr if curr is not None else np.zeros(DIM, np.float32))

    features = np.array(cleaned, dtype=np.float32)
    return features


def predict_sign(
    video_path: Path | str,
    model_dir: Path = DEFAULT_MODEL_DIR,
    top_k: int = 5,
):
    video_path = Path(video_path)
    if not video_path.exists():
        print(f"Error: File not found: {video_path}")
        return None

    onnx_path = model_dir / "sign_daily_lstm.onnx"
    classes_path = model_dir / "sign_daily_classes.json"

    if not onnx_path.exists():
        print(f"Error: ONNX model not found at {onnx_path}")
        return None
    if not classes_path.exists():
        print(f"Error: Classes file not found at {classes_path}")
        return None

    with open(classes_path, "r", encoding="utf-8") as f:
        classes = json.load(f)

    print(f"Loading model from: {onnx_path}")
    session = ort.InferenceSession(str(onnx_path), providers=["CPUExecutionProvider"])
    input_name = session.get_inputs()[0].name

    print(f"Processing video: {video_path.name} ...")
    features = process_video(video_path)
    if features is None:
        print("Failed to extract landmark sequence from video.")
        return None

    # Shape: (1, SEQ_T, DIM) -> (1, 32, 258)
    batch_input = features[np.newaxis, :, :].astype(np.float32)
    logits = session.run(None, {input_name: batch_input})[0][0]

    # Softmax
    exp_logits = np.exp(logits - np.max(logits))
    probs = exp_logits / np.sum(exp_logits)

    sorted_indices = np.argsort(probs)[::-1]
    predicted_idx = sorted_indices[0]
    predicted_label = classes[predicted_idx]
    confidence = float(probs[predicted_idx])

    print("\n" + "=" * 55)
    print(f" PREDICTED SIGN: {predicted_label} ({confidence * 100:.2f}%)".center(55))
    print("=" * 55)

    print(f"\nTop-{min(top_k, len(classes))} Predictions:")
    for rank, idx in enumerate(sorted_indices[:top_k], start=1):
        lbl = classes[idx]
        conf = float(probs[idx]) * 100
        bar = "#" * int(conf / 5)
        print(f"  {rank}. {lbl:<22} : {conf:6.2f}%  [{bar:<20}]")

    return {
        "predicted": predicted_label,
        "confidence": confidence,
        "top_k": [
            {"label": classes[i], "confidence": float(probs[i])}
            for i in sorted_indices[:top_k]
        ],
    }


def main():
    parser = argparse.ArgumentParser(description="Test trained sign model on a video file.")
    parser.add_argument("video", type=str, help="Path to input video file (.mp4, etc.)")
    parser.add_argument(
        "--model-dir",
        type=str,
        default=str(DEFAULT_MODEL_DIR),
        help="Path to directory containing sign_daily_lstm.onnx and sign_daily_classes.json",
    )
    parser.add_argument("--top-k", type=int, default=5, help="Number of top predictions to display")
    args = parser.parse_args()

    predict_sign(args.video, model_dir=Path(args.model_dir), top_k=args.top_k)


if __name__ == "__main__":
    main()
