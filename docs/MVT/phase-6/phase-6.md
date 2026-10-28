# Sign-to-Avatar: Standalone Technical Documentation & Reproduction Specification

## 1. Project Overview & Context

This project represents the **Minimal Viable Test Phase of a Web-Based Sign Language (WBSL) Movement Reproduction System**.

[test-demo-video-here](./phase-6.mp4)

The primary objective is **direct 3D movement reproduction from monocular RGB video**, **not** sign language recognition or classification. Rather than classifying signs into text and playing back canned generic animations, the system extracts the person's real-time visible motion vectors (head, shoulders, arms, wrists, hands, and fingers) and maps them directly onto a rigged 3D humanoid avatar.

### Project Status & Test Phase Findings
- **Status**: Completed as an experimental testbed / Proof of Concept (PoC).
- **Core Strengths**: Successfully reproduced gross upper-body kinematics, arm trajectories, shoulder-elbow-wrist elevations, head orientation (yaw, pitch, roll), and synchronized local playback.
- **Identified Limitations**: While it proves the feasibility of pure browser-side, zero-cloud sign reproduction, **fine finger curling and nuanced hand shape details remain imperfect and compromised**, especially during finger inter-occlusion and extreme foreshortening. This document serves as the single source of truth for understanding the architecture and building the next-generation production pipeline.

---

## 2. Technology Stack & Architectural Blueprint

```
                     ┌───────────────────────────────────────────┐
                     │            User Video Upload              │
                     │          (MP4 / WebM / Local)             │
                     └─────────────────────┬─────────────────────┘
                                           │
                                           ▼
                     ┌───────────────────────────────────────────┐
                     │          Offscreen Frame Extractor        │
                     │   (HTMLVideoElement / HTMLCanvasElement)  │
                     └─────────────────────┬─────────────────────┘
                                           │
                                           ▼
                     ┌───────────────────────────────────────────┐
                     │         MediaPipe Tasks Vision            │
                     │  - Pose Landmarker (Upper Body: Arms/Head)│
                     │  - Hand Landmarker (21 3D points per hand)│
                     │  - Face Landmarker (Head 3D Orientation)  │
                     └─────────────────────┬─────────────────────┘
                                           │
                                           ▼
                     ┌───────────────────────────────────────────┐
                     │         Motion Retargeting Engine         │
                     │  - Left/Right Hand Spatial Association    │
                     │  - Screen + World Hybrid Direction Solver │
                     │  - Forward Kinematics (FK) Bone Quats     │
                     │  - Rolling Quaternion Slerp Smoother      │
                     └─────────────────────┬─────────────────────┘
                                           │
                                           ▼
                     ┌───────────────────────────────────────────┐
                     │          Three.js / React Three Fiber     │
                     │  - SkinnedMesh Joint Hierarchy Control    │
                     │  - Slerp-Interpolated Timeline Playback   │
                     │  - Synchronized Video + 3D Viewport       │
                     └───────────────────────────────────────────┘
```

| Component | Library / Version | Role |
|---|---|---|
| **Framework** | Next.js 14.2+ (App Router) | Web application structure & routing |
| **Language** | TypeScript 5+ | Type safety & landmark data structures |
| **Frontend UI** | React 18, Tailwind CSS | 100vh responsive layout |
| **State Management** | Zustand 5.0+ | Global playback state & landmark cache |
| **Computer Vision** | `@mediapipe/tasks-vision` 0.10+ | Local client-side WASM inference (CPU delegate) |
| **3D Rendering** | `three` 0.169+, `@react-three/fiber` 8.18+, `@react-three/drei` 9.122+ | WebGL scene, GLTF loading & bone animation |
| **3D Avatar Format** | GLB (glTF 2.0 Binary) | Humanoid mesh with skeletal rigging |

---

## 3. Avatar Model Attribution & Rig Verification

### Model Attribution & Source Details
- **Model Name**: "Cool Man"
- **Creator / Author**: **ardhanaputra** ([https://sketchfab.com/ardhanaputra](https://sketchfab.com/ardhanaputra))
- **Original Source URL**: [https://sketchfab.com/3d-models/cool-man-ad14b71697dd4ea7836c1f06c75e5f72](https://sketchfab.com/3d-models/cool-man-ad14b71697dd4ea7836c1f06c75e5f72)
- **License**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- **License Summary & Requirements**:
  - **Attribution**: You must give appropriate credit to creator `ardhanaputra`, provide a link to the original model and license, and indicate if changes were made.
  - **Commercial Use & Adaptation**: Free to share, adapt, and remix for any purpose.
- **Local Asset Path**: `public/models/cool_man.glb` (File size: ~7.96 MB, format: glTF/GLB 2.0 binary).
- **Modification & Usage Statement**:
  - The model's 3D mesh geometry, 2K textures, and materials (coat, skin, hair, glasses, gloves) are preserved unmodified.
  - The 6 pre-baked animations (`Pose`, `salute`, `sit`, `shakehand`, `walking`, `cough`) packaged within the original GLB have their AnimationMixer actions muted/stopped during retargeting playback so the skeleton can be dynamically manipulated in real time by the vision tracking pipeline.

### Avatar Skeleton & Bone Inspection
The GLB model contains **194 scene nodes**, **1 skin**, and **169 joints**, following the **Mixamo humanoid bone convention**:

| Target Body Part | Rig Bone Name | Role in Retargeting |
|---|---|---|
| **Head** | `mixamorig:Head_1` | Head yaw, pitch, and roll |
| **Neck** | `mixamorig:Neck_2` | Dampened secondary neck orientation (30% factor) |
| **Left Shoulder** | `mixamorig:LeftArm_40` | Upper arm orientation (shoulder to elbow vector) |
| **Left Forearm** | `mixamorig:LeftForeArm_39` | Forearm orientation (elbow to wrist vector) |
| **Left Wrist** | `mixamorig:LeftHand_38` | Hand orientation & palm alignment |
| **Right Shoulder** | `mixamorig:RightArm_79` | Upper arm orientation (shoulder to elbow vector) |
| **Right Forearm** | `mixamorig:RightForeArm_78` | Forearm orientation (elbow to wrist vector) |
| **Right Wrist** | `mixamorig:RightHand_77` | Hand orientation & palm alignment |
| **Left Fingers** | `mixamorig:LeftHandThumb1_6` to `3_4`, `mixamorig:LeftHandIndex1_10` to `3_8`, `Middle1_14` to `3_12`, `Ring1_18` to `3_16`, `Pinky1_22` to `3_20` | 3 joints per finger/thumb (15 joints total) |
| **Right Fingers** | `mixamorig:RightHandThumb1_45` to `3_43`, `mixamorig:RightHandIndex1_49` to `3_47`, `Middle1_53` to `3_51`, `Ring1_57` to `3_55`, `Pinky1_61` to `3_59` | 3 joints per finger/thumb (15 joints total) |
| **Stationary Base** | `mixamorig:Hips_94`, `mixamorig:Spine_83`, `mixamorig:LeftUpLeg_88`, etc. | Kept stationary in neutral pose |

---

## 4. Video-to-Sign Pipeline Implementation

### 4.1. Local Frame Extraction
Video processing is performed 100% locally on the client to preserve privacy and eliminate cloud costs:
1. Video metadata is loaded into an offscreen `<video>` element.
2. A fixed sampling interval (e.g., 15 FPS: $\Delta t = \frac{1}{15}\text{ s}$) steps sequentially through the timeline via `video.currentTime = t`.
3. The video frame is rendered into a hardware-accelerated 640×360 canvas context: `ctx.drawImage(video, 0, 0, canvas.width, canvas.height)`.
4. Extracted image data is fed into MediaPipe trackers via `detectForVideo(canvas, timestampMs)`.

### 4.2. Landmark Tracking Modules
Three MediaPipe Landmarker instances run per frame:
1. **MediaPipe Pose Landmarker** (`pose_landmarker_lite.task`):
   - Extracts 33 3D world landmarks ($\text{x, y, z}$ in meters) and 2D normalized screen landmarks.
   - Extracts shoulders (`LEFT_SHOULDER: 11`, `RIGHT_SHOULDER: 12`), elbows (`13, 14`), and wrists (`15, 16`).
2. **MediaPipe Hand Landmarker** (`hand_landmarker.task`):
   - Extracts 21 3D points per hand (wrist, CMC, MCP, PIP, DIP, Tip for 5 digits).
3. **MediaPipe Face Landmarker** (`face_landmarker.task`):
   - Extracts 478 face landmarks. Key landmarks used for head pose: nose tip (`1`), chin (`152`), left eye corner (`33`), right eye corner (`263`).

### 4.3. Left vs. Right Hand Disambiguation
**Critical Fix Discovered During Development**:
By default, MediaPipe Hand Landmarker assumes a mirrored selfie camera. When viewing a third-person signing video, this causes severe left/right hand flipping.
**The Solution**:
Spatial association with the Pose skeleton:
$$\text{distLeft} = \|\mathbf{x}_{\text{handWrist}} - \mathbf{x}_{\text{poseLeftWrist}}\|, \quad \text{distRight} = \|\mathbf{x}_{\text{handWrist}} - \mathbf{x}_{\text{poseRightWrist}}\|$$
- If $\text{distLeft} < \text{distRight} \implies \text{Hand is Person's Left Hand}$.
- If $\text{distRight} \le \text{distLeft} \implies \text{Hand is Person's Right Hand}$.

---

## 5. Motion Retargeting Engine

### 5.1. Arm Elevation & Hybrid Direction Vector
A single monocular camera frequently foreshortens depth ($Z$), which causes arm elevations in pure 3D world space to collapse towards the torso.
To solve this, we implemented a **Hybrid Screen-Space + 3D Depth Direction Vector**:
1. Take 2D unprojected screen landmarks: $\Delta x = x_{\text{target}} - x_{\text{base}}$, $\Delta y = -(y_{\text{target}} - y_{\text{base}})$ (invert $Y$ because image coordinates increase downward).
2. Compute the 2D direction unit vector: $\mathbf{u}_{2D} = \frac{(\Delta x, \Delta y)}{\|(\Delta x, \Delta y)\|}$.
3. Preserve the estimated normalized $Z$ depth from MediaPipe 3D world landmarks while scaling $XY$ to enforce the visual screen height:
   $$\mathbf{v}_{\text{hybrid}} = \left( u_{2D, x} \cdot \sqrt{1 - z^2}, \; u_{2D, y} \cdot \sqrt{1 - z^2}, \; z \right)$$

### 5.2. Forward Kinematic (FK) Arm Bone Solvers
In the Mixamo rig, arm bones point along their **local $+Y$ axis** in rest pose:
1. **Upper Arm (Shoulder)**:
   - Identify the rest world orientation of the shoulder's parent bone: $\mathbf{q}_{\text{parentWorld}}$.
   - Transform the target arm direction into parent local space:
     $$\mathbf{d}_{\text{parent}} = \mathbf{q}_{\text{parentWorld}}^{-1} \cdot \mathbf{v}_{\text{upperArm}}$$
   - The local rotation is the shortest arc from $(0, 1, 0)$ to $\mathbf{d}_{\text{parent}}$:
     $$\mathbf{q}_{\text{shoulderLocal}} = \text{Quaternion.setFromUnitVectors}\left((0, 1, 0), \; \mathbf{d}_{\text{parent}}\right)$$
2. **Forearm (Elbow)**:
   - The forearm's active parent in world space is $\mathbf{q}_{\text{shoulderWorld}} = \mathbf{q}_{\text{parentWorld}} \cdot \mathbf{q}_{\text{shoulderLocal}}$.
   - Transform the forearm target direction into upper-arm local space:
     $$\mathbf{d}_{\text{upperArm}} = \mathbf{q}_{\text{shoulderWorld}}^{-1} \cdot \mathbf{v}_{\text{foreArm}}$$
   - Solve local forearm quaternion:
     $$\mathbf{q}_{\text{elbowLocal}} = \text{Quaternion.setFromUnitVectors}\left((0, 1, 0), \; \mathbf{d}_{\text{upperArm}}\right)$$

### 5.3. Finger Bending & Curling Engine
Finger curling rotates bones around the bone's **local $+X$ axis** relative to its rest pose $\mathbf{q}_{\text{rest}}$:
1. **Palm Normalization**:
   - Compute palm reference scale: $L_{\text{palm}} = \|\mathbf{x}_{\text{wrist}} - \mathbf{x}_{\text{middleMCP}}\|$.
2. **Curl Ratio Calculation**:
   - For Index, Middle, Ring, Pinky:
     $$\text{curlRatio} = \max\left(0, \; \min\left(1, \; 1 - \frac{\|\mathbf{x}_{\text{tip}} - \mathbf{x}_{\text{MCP}}\|}{1.2 \cdot L_{\text{palm}}}\right)\right)$$
   - Segment angular deflection:
     $$\theta_{\text{segment}} = \arccos\left(\frac{\mathbf{v}_{1} \cdot \mathbf{v}_{2}}{\|\mathbf{v}_{1}\| \|\mathbf{v}_{2}\|}\right)$$
   - Joint rotation: $\theta = \max(\theta_{\text{segment}} \times 1.1, \; \text{curlRatio} \times 0.48\pi)$.
3. **Thumb Gesture Handling**:
   - Distance between thumb tip and pinky MCP indicates thumb tuck vs. extension (e.g. **Thumbs-Up**):
     - If $D_{\text{thumb-pinky}} > 1.05 \cdot L_{\text{palm}} \implies$ **Extended thumb**: preserve open thumb orientation.
     - If $D_{\text{thumb-pinky}} \le 1.05 \cdot L_{\text{palm}} \implies$ **Tucked thumb**: rotate thumb joints inward.

### 5.4. Motion Smoothing (`QuatSmoother`)
High-frequency camera jitter is dampened using a 5-frame rolling average quaternion buffer with shortest-path antipodal dot-product correction ($\text{if } q_0 \cdot q_i < 0 \implies q_i = -q_i$).

---

## 6. Web User Interface Specifications

- **Strict 100vh Layout**: The viewport is locked to `h-screen w-screen overflow-hidden` with zero vertical scrolling.
- **Side-by-Side Synchronized View**:
  - **Left**: Original video player with real-time SVG/Canvas landmark overlay (yellow pose skeleton, cyan right hand, green left hand, magenta facial markers).
  - **Right**: WebGL Three.js viewport hosting the 3D avatar with shadow mapping and orbit controls (pan, zoom, tilt).
- **Control Bar**:
  - Timestamp-accurate scrubbing bar (`<input type="range">`).
  - Play/Pause, Restart.
  - Speed presets: `0.25x`, `0.5x`, `1.0x`, `1.5x`, `2.0x`.
  - Landmark toggle button.
  - GLB Animation Export button.

---

## 7. Test Results, Evaluation & Shortcomings

### Test Video Evaluation (`sign-video.mp4`)
- **Video Specifications**: 1280×720 MP4, ~2.8 seconds, signing person performing a thumbs-up gesture and hand transition.
- **Benchmark Platform**: Windows 11, Ryzen 7 U-series, 16 GB RAM, integrated graphics.
- **Inference Speed**: ~85 ms per frame on CPU (MediaPipe WASM). Complete video processed in ~3.8 seconds.

### Successes
1. **Arm & Hand Trajectory Tracking**: The avatar's right arm successfully lifts from the side, bends at the elbow, and positions the hand in front of the chest corresponding with the person's sign height.
2. **Head Tilting & Rotation**: Subtle nodding and head roll were captured and reflected.
3. **No Drift / Jitter**: Quaternions smoothed without accumulation or gimbal lock.
4. **Torso & Legs Stationary**: Excluded bones maintained their rest pose without unnatural compensations.

### Root Causes of Finger & Hand Shortcomings
1. **Monocular Occlusion**: When the signer closes their hand into a fist or turns their palm toward the camera, finger tips are occluded by knuckles. MediaPipe estimates 3D finger positions via a trained 2D-to-3D prior which flattens out during self-occlusion.
2. **Wrist Twist Discrepancy**: The avatar's coat sleeve geometry has rigid vertex weights. Over-rotating the wrist bone causes mesh pinch ("candy wrapper" artifact) unless forearm twist bones (`Ctrl_ForeArm_FK`) are distributed along the sleeve.
3. **Rig Limits of "Cool Man"**: The "Cool Man" model's finger segments are thick cartoonish glove meshes. Even with high anatomical curl angles, the thick mesh surfaces collide visually, making tight sign gestures (like 'A', 'S', or thumbs-up) appear bulkier and less articulated than the human hand.

---

## 8. Recommendations for Next-Generation Implementation

1. **Avatar Mesh Recommendation**:
   - Replace the clothed character with a **dedicated sign-language avatar** featuring separated finger geometry (non-gloved) with custom linear blend skinning (LBS) or dual quaternion skinning (DQS) to prevent sleeve pinching.
2. **Finger Kinematics Upgrade**:
   - Implement **MediaPipe Hand Landmarker in IMAGE mode with Multi-Pass Crop**: re-crop high-resolution bounding boxes around each detected wrist at full source resolution (1080p) before running hand detection. This dramatically improves landmark precision for curled fingers.
3. **Sign Pose Priors**:
   - Implement an inverse-kinematics (IK) constraint solver with anatomical joint angle limits (DIP/PIP hinge limits $[0^\circ, 90^\circ]$) to prevent hyperextension during rapid transitions.

## Current Approach

We currently use a custom-coded 3D model built with Three.js and React Three Fiber (R3F), as the existing GLB-based avatar simulation model lacks detailed finger movements and sign-specific actions.