## WBSL Bridge — Updated Todo List

1\.The main model is currently models\llm\gemma-4-E4B-it-Q4_K_M.gguf, but I want to switch to models\llm\NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf from now on. It is based on the same E4B model family and has been further improved using NVIDIA's reinforcement learning, making it significantly more accurate.
and delete the gemma model from here
and the mmproj file that dont need.

6\. Update Sign Detection Logic: Use the hands-down position as the sign boundary trigger. Hands down means no active sign; raising the hands begins a sign, and returning them both down ends it.

7\. Update Simulation: Modify the simulation code to use the new body and hand data while retaining facial data only for the existing visual simulation requirements.

8\. Remove NMM Completely: Remove NMM detection, configuration, UI, and related dependencies. Keep it as a planned future feature.

9\. Remove Community Contribution Feature: Completely remove the community contribution interface and its existing contribution pipeline, as the current implementation does not meet requirements. It may be redesigned and reintroduced in the future.

10\. Verify the Complete Pipeline: Test data extraction, model training, inference, sign boundary detection, and simulation to ensure everything works without face tracking in recognition.