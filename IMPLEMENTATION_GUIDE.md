Upgrade the sign recognition system in our application to match the accuracy, performance, and recognition behaviour of `model_training_zone\test_model.py`.

The current application is not performing as well as the Python test model. Analyse the complete recognition pipeline in `test_model.py`, compare it with the implementation used in the application, identify all differences and missing features, and upgrade the application accordingly.

Goal: Make the application's live sign recognition work as closely as possible to the Python test model, including feature extraction, preprocessing, prediction, confidence handling, temporal smoothing, and sign detection logic.

Do not modify anything inside `model_training_zone`. Use it only as the reference implementation. Preserve the existing application architecture and UI wherever possible.