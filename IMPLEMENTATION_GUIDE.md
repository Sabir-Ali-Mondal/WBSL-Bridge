Do undergivens one by one

### New Training Method
- Read and follow the updated training method in `model_training_zone`.

**1.1. Update Sign Detection**
- Update the sign detection system according to the new model architecture and training method and test_model.py system .

**1.2. Update Simulation and Face Mask**
- Update the simulation and face mask according to the new avatar data structure.

**1.3.** make use of all the outputs data/ model in this folders in website in admin panels existing tabs
models\onnx_models\5 only this model is trained according this architetecture  so we can delete previous 1,2,3,4

! warning: never touch any code in model_training_zone as its our main goal

---

### 2. Remove NMM completely no code should left for this /around this
- Remove NMM detection, configuration, UI, APIs, and related dependencies.

### 3. Remove Community Contributions completely no code should left for this /around this
- Remove the contribution UI, APIs, and existing backend pipeline.
- only Keep Community Contributions tab button listed as a planned future feature. in title of that button not clikable


### 4. Switch LLM Model
- Replace Gemma 4 E4B with `NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf`.
- Update all model paths and configurations accordingly.
- Delete the old Gemma model file and unnecessary `mmproj` file.

### 5. Add Online/Offline LLM Mode Selection
- Allow users to choose between **Offline** and **Online** LLM execution using `start.ps1`.
- Introduce a `.env` file containing a mode variable to select either `offline` or `online`.
- Keep the other three required environment variables in the `.env` file for manual configuration and updating.
- Update `start.ps1` to read the `.env` configuration and start the application using the selected mode.
- Ensure only the selected LLM mode is activated at a time.
- Do not use automatic fallback between online and offline modes.

heres direct guide
Add this configuration to the `.env` file. The `AI_MODE` variable will control whether the system uses the online or offline API.

Updated `.env` structure:

```
# LLM MODE: online or offline
AI_MODE=offline


# Online API Configuration
AI_BASE_URL=https://openrouter.ai/api/v1
AI_API_KEY=
AI_MODEL_NAME=google/gemma-4-26b-a4b-it:free


# Offline API Configuration (KoboldCpp)
# AI_BASE_URL=http://localhost:5001/v1
# AI_API_KEY=KoboldCppApi
# AI_MODEL_NAME=NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf


# Common AI Settings
AI_STREAM=true
AI_REASONING=true
AI_REASONING_EFFORT=low
AI_TIMEOUT=180
```

Important implementation requirements:

1. `AI_MODE=online` → Use the online API configuration.
2. `AI_MODE=offline` → Use the local KoboldCpp configuration.
3. `start.ps1` must read `AI_MODE` and activate the corresponding configuration.
4. The three API variables (`AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL_NAME`) should be manually maintained in `.env`.
5. Do not automatically switch modes if the selected API fails.
6. Keep the common AI settings unchanged for both modes.