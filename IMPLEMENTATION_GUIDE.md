# WBSL Bridge — Updated Todo List


---
**1.1. Code and train and test model using training method**
- build model_training_zone\training-method\training_method.md

**1.2. Update Sign Detection** as per new model sytem

**1.3. Update Simulation and facemask** as per new data of avatar

---

**2. Remove NMM**
- Remove NMM detection, configuration, UI, APIs, and dependencies.
- Keep it as a planned future feature.

**2. Remove Community Contributions**
- Remove the contribution UI, APIs, and existing backend pipeline.
- Keep it as a planned future feature.

**3. Switch LLM Model**
- Replace Gemma 4 E4B with `NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf`.
- Update model paths and configuration.
- Delete the old Gemma model and unnecessary `mmproj` file.