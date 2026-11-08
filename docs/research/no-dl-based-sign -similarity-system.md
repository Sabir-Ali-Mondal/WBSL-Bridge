# Build Independent Non-Deep-Learning Sign Recognition System

Create a new experimental system inside the existing WBSL Bridge project:

`non_dl_recognition/`


for geting dat acontext read this model_training_zone\training-method\training_method.md D:\Download\Projects\WBSL Bridge\model_training_zone\extract.py

its already sasstraining files in D:\Download\Projects\WBSL Bridge\models\onnx_models\<id>\training_data
 like D:\Download\Projects\WBSL Bridge\models\onnx_models\5\training_data
## 1. Main Objective
Develop a standalone sign recognition system WITHOUT Deep Learning. We will test it independently and later integrate its best-performing recognition methods with our existing ONNX-based DL model as a verification layer.

## 2. Dataset
- Directly read the existing extracted 98-feature `.npy` training data.
- First inspect the project and locate the actual extracted dataset.
- Prefer the existing dataset associated with the current model if available; otherwise, use `model_training_zone/dataset_train/features/`.
- Do NOT copy or duplicate the dataset.
- Never modify original training data.

Each sample contains `(64, 98)` features.

Follow the existing feature specification exactly:
- 66 handshape values.
- 12 palm direction and facing values.
- 4 wrist position values.
- 4 elbow values.
- 6 wrist-to-face distances.
- 3 head values.
- 2 hand flags.
- 1 duration value.

## 3. Algorithms to Experiment With
Implement and compare:
- Dynamic Time Warping (DTW).
- K-Nearest Neighbours (KNN).
- Weighted Euclidean Distance.
- Cosine Similarity.
- Geometric and rule-based matching.
- Confidence and unknown-sign rejection.

Do not assume one algorithm is best. Evaluate them using actual extracted data.

## 4. Folder Structure

Keep the project simple:

non_dl_recognition/
- config.py
- recognition.py
- evaluation.py
- live_test.py
- main.py

Store experimental reports, settings and generated files inside this folder.

## 5. Evaluation
Test using proper training and validation separation. Avoid data leakage.

Measure:
- Overall accuracy.
- Per-class precision, recall and F1.
- Confusion matrix.
- Unknown-sign rejection.
- Recognition speed.
- CPU and RAM usage.

Use signer-independent evaluation if signer information is available.

## 6. Live Testing
Create an independent webcam testing mode using the SAME 98-feature extraction, coordinate system, frame completeness rules and sign-span detection specified in `model_training_zone` documentation.

Do not create another extraction or training pipeline unnecessarily.

## 7. Strict Restrictions
- Do NOT modify anything inside `model_training_zone`.
- Do NOT modify or overwrite existing ONNX models.
- Do NOT modify the existing production frontend or backend.
- Do NOT use Deep Learning in this experimental recognition engine.
- Do NOT duplicate existing datasets.
- Keep all experimental code and outputs isolated inside `non_dl_recognition/`.

## 8. Final Goal
First identify the best-performing Non-DL recognition approach independently.

Later, integrate it with the existing DL system so that:
- DL provides the primary sign prediction.
- Non-DL independently verifies the predicted sign.
- Agreement increases prediction reliability.
- Disagreement triggers additional verification.
- Uncertain predictions can be rejected as Unknown Sign.

## First Task
Before implementing algorithms, inspect the actual dataset structure, feature dimensions, labels, sample counts and extraction reports. Then implement the experiments based on the real data format.

Do not change existing project functionality.