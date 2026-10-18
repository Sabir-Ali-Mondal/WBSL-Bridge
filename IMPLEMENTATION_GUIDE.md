## WBSL Bridge — Updated Todo List

1\. Reduce Face Data Extraction: Keep face data extraction only for the simulation requirements, reusing the existing cute face model and ensuring consistent data.

2\. Remove Face Data from Recognition: Do not use facial data for training or sign detection to avoid unnecessary complexity and confusion.

3\. Update Data Extraction (mannualy not auto): Extract the required non-face data, including fingers, hands, arms, shoulders, and body pose.

4\. Retrain the Model (mannualy not auto): Train a new model using only hand, finger, arm, shoulder, and body-pose data, without facial landmarks.

5\. Update Model Runner: Modify the app's model runner, input dimensions, preprocessing, and inference pipeline to support the new model architecture.

6\. Update Sign Detection Logic: Use the hands-down position as the sign boundary trigger. Hands down means no active sign; raising the hands begins a sign, and returning them both down ends it.

7\. Update Simulation: Modify the simulation code to use the new body and hand data while retaining facial data only for the existing visual simulation requirements.

8\. Remove NMM Completely: Remove NMM detection, configuration, UI, and related dependencies. Keep it as a planned future feature.

9\. Remove Community Contribution Feature: Completely remove the community contribution interface and its existing contribution pipeline, as the current implementation does not meet requirements. It may be redesigned and reintroduced in the future.

10\. Verify the Complete Pipeline: Test data extraction, model training, inference, sign boundary detection, and simulation to ensure everything works without face tracking in recognition.