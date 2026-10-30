# WBSL Bridge — Updated Todo List
BEFORE DOING CODE READ THIS AND CREATE A PLAN FIRST AFTER VISITING ALL FILES  THEN DO IT
---

### New Training Method

- Read and follow the updated training method in `model_training_zone`.
- Use the existing `test_model.py` system as a reference for model testing and validation.
- **WARNING: Never modify, delete, rename, or change any code or files inside `model_training_zone`.** It is our main reference and must remain completely untouched.

**1.1. Update Sign Detection**

- Update the sign detection system according to the new model architecture and training method.
- Follow the feature extraction, preprocessing, prediction, and inference logic defined by the new training system.
- Use the existing `test_model.py` system as a reference to ensure the live detection pipeline works consistently with the trained model.
- Ensure the serving pipeline uses exactly the same feature structure and normalization as the training pipeline.

**1.2. Update Simulation and Face Mask**

- Update the simulation and face mask according to the new avatar data structure.
- Ensure the simulation correctly uses the updated landmark and avatar data.

**1.3. Integrate future/new Models Outputs into Admin Panels** see training method

- Make use of all available output data, metadata, and model-related information from the following folder or upcoming in future in the website's existing admin panel tabs:

  `models/onnx_models/5` [things can get long so dont read in files]

- Model 5 is the only model trained according to the new architecture.
- Delete previous models 1, 2, 3, and 4, along with their unnecessary configurations and architecture-specific code.
- Remove compatibility requirements for the old architectures.
- Update the admin panels to display and use the available information from Model 5.
- Preserve the existing admin panel structure and tabs wherever possible.

---

### 2. Remove NMM Completely

- Completely remove NMM detection, configuration, UI, APIs, backend logic, and related dependencies.
- Remove all unused NMM-related code and references.
- No NMM-related implementation or unnecessary code should remain anywhere in the project.
- Do not retain NMM as an active or partially implemented feature.

### 3. Remove Community Contributions Completely
- Completely remove the Community Contributions UI, APIs, backend pipeline, database operations, and related dependencies.
- Remove all existing contribution-related implementation and unnecessary code.
- Keep only the **Community Contributions** tab/button listed as a planned future feature.
- Display its title, but make the button non-clickable and disabled.
- Do not retain any active contribution functionality.

---

### 4. Switch LLM Model

- Replace Gemma 4 E4B with `NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf`.
- Update all model paths, configurations, and related references accordingly.
- Delete the old Gemma model file and unnecessary `mmproj` file.
- Ensure the offline LLM configuration uses the new Nemotron model.

### 5. Add Online/Offline LLM Mode Selection

- Allow users to choose between **Offline** and **Online** LLM execution using `start.ps1`. for that Introduce a `.env` file containing an `AI_MODE` variable to select either `offline` or `online`.
- Maintain separate environment variables for online and offline API configurations.
- Do not comment out or overwrite one configuration when switching between modes.
- Only `AI_MODE` should determine which API configuration the application uses.

**Updated `.env` structure:**

```env
# ==========================================
# LLM MODE SELECTION
# ==========================================
# Allowed values: online, offline

AI_MODE=offline


# ==========================================
# ONLINE API CONFIGURATION
# ==========================================

AI_ONLINE_BASE_URL=https://openrouter.ai/api/v1
AI_ONLINE_API_KEY=
AI_ONLINE_MODEL_NAME=google/gemma-4-26b-a4b-it:free


# ==========================================
# OFFLINE API CONFIGURATION (KoboldCpp)
# ==========================================

AI_OFFLINE_BASE_URL=http://localhost:5001/v1
AI_OFFLINE_API_KEY=KoboldCppApi
AI_OFFLINE_MODEL_NAME=NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf

# ==========================================
# COMMON AI SETTINGS
# ==========================================

AI_STREAM=true
AI_REASONING=true
AI_REASONING_EFFORT=low
AI_TIMEOUT=180
```

**Important implementation requirements:**

1. `AI_MODE=online` → Use `AI_ONLINE_BASE_URL`, `AI_ONLINE_API_KEY`, and `AI_ONLINE_MODEL_NAME`.
2. `AI_MODE=offline` → Use `AI_OFFLINE_BASE_URL`, `AI_OFFLINE_API_KEY`, and `AI_OFFLINE_MODEL_NAME`.
3. `start.ps1` must read the `.env` file and identify the selected mode.
4. The application must load only the configuration corresponding to the selected mode.
5. Map the selected configuration to the application's existing AI configuration variables internally, wherever required.
6. All online and offline API variables must remain available in `.env` simultaneously for manual configuration and updating.
7. Do not automatically switch between online and offline modes if the selected API fails.
8. If the selected API is unavailable or incorrectly configured, show a clear error instead of switching modes.
9. Keep the common AI settings unchanged and applicable to both modes.
10. Ensure the backend and `start.ps1` follow the same mode-selection logic without configuration conflicts.

---

### General Implementation Rules

- Preserve the existing website design, functionality, and admin panel structure wherever they are not part of the requested changes.
- Remove obsolete code, dependencies, configurations, and references associated with deleted features and old models.
- Do not introduce unnecessary architecture changes.
- Do not modify anything inside `model_training_zone`.
- Test the updated sign detection, simulation, admin panels, LLM configuration, and application startup after implementation.
- Ensure the entire project works consistently with the new training architecture.