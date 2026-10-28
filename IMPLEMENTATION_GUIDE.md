# WBSL Bridge — Updated Todo List

**1. Switch LLM Model**
- Replace Gemma 4 E4B with `NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf`.
- Update model paths and configuration.
- Delete the old Gemma model and unnecessary `mmproj` file.

**2. Update Sign Detection**
- Both hands down = no active sign.
- Hands raised = start sign detection.
- Both hands down again = end the sign.

**3. Update Simulation**
- Use updated hand, arm, shoulder, and body data.
- Retain facial data only for visual simulation, not recognition.

**4. Remove NMM**
- Remove NMM detection, configuration, UI, APIs, and dependencies.
- Keep it as a planned future feature.

**5. Remove Community Contributions**
- Remove the contribution UI, APIs, and existing backend pipeline.
- Keep it as a planned future feature.