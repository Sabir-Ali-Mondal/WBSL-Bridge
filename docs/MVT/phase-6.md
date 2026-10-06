# MediaPipe → 3D Human Skeleton Retargeting POC

## 1. Project purpose

Build a small, separate proof-of-concept project that answers one question:

> Can recorded MediaPipe pose + hand landmark movement control the **Free Pack - Human Skeleton** 3D model correctly in Three.js?

This project is intentionally independent from WBSL Bridge. Do not modify or copy anything into WBSL Bridge until the retargeting works correctly.

The first target is accurate movement, not visual effects.

---

## 2. Reference 3D model

### Exact model to use

**Free Pack - Human Skeleton**  
**Creator:** PolyOne Studio  
**Sketchfab:**  
https://sketchfab.com/3d-models/free-pack-human-skeleton-950d0a46531f492ab8715777e312a5bf

The Sketchfab listing describes this as a minimalist low-poly human skeleton, gives a package description of one human skeleton, and lists Blender, FBX, OBJ, MA, USB and ZBrush formats. The listing is marked **CC Attribution (CC BY)**. It is also tagged with rig/rigged/rigging/humanoid/joint/skeleton. Verify the downloaded asset's actual armature before implementation; the web listing alone does not give the complete bone hierarchy.

Source: https://sketchfab.com/3d-models/free-pack-human-skeleton-950d0a46531f492ab8715777e312a5bf

https://github.com/hmthanh/3d-human-model/tree/main

### Attribution requirement

Keep attribution for the Human Skeleton asset because the Sketchfab listing marks it as CC Attribution.

At minimum, keep a visible or documented project credit such as:

`Human Skeleton model by PolyOne Studio — Sketchfab — CC BY`

Also keep the original source URL in this file and in the project documentation.

Do not remove or hide the creator/license information from the downloaded asset.

---

## 3. Main pipeline

```text
Webcam
  ↓
OpenCV + MediaPipe
  ↓
33 Pose landmarks
21 Left Hand landmarks
21 Right Hand landmarks
  ↓
movement.json
  ↓
React + Three.js / React Three Fiber
  ↓
Landmark normalization
  ↓
MediaPipe → Three.js coordinate conversion
  ↓
Landmark → bone direction calculation
  ↓
Bone quaternion retargeting
  ↓
Human Skeleton model
  ↓
Playback / scrub / front-side-3/4 camera views
```

Do not add face tracking in the first milestone.

Do not add an avatar, VRM, Kalidokit, IK, physics, NLG, backend, database or WBSL code in the first milestone.

---

## 4. Technology choice

### Python side

- Python
- OpenCV
- MediaPipe
- NumPy

Purpose:

- webcam capture
- landmark extraction
- optional webcam preview
- landmark recording
- JSON export

### Browser side

- Vite
- React
- TypeScript
- Three.js
- `@react-three/fiber`
- `@react-three/drei`

Purpose:

- GLB/GLTF/FBX-derived model display
- camera controls
- playback
- retargeting
- debugging overlays

Do not add unnecessary libraries.

---

## 5. Minimal project structure

Use as few files as practical:

```text
landmark-3d-test/
│
├── public/
│   ├── model.glb
│   └── movement.json
│
├── tools/
│   └── record.py
│
├── src/
│   ├── App.tsx
│   ├── SkeletonViewer.tsx
│   ├── retarget.ts
│   ├── main.tsx
│   └── style.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── requirements.txt
```

If the downloaded model is FBX or another format that is inconvenient in the browser, convert it once to GLB using Blender. Do not build a browser-side asset-conversion system.

---

## 6. Model inspection is mandatory before retargeting

Before writing bone mappings, inspect the downloaded model.

The browser app must print:

```text
MODEL NODES
MESHES
ARMATURES
BONES
SKINS
ANIMATIONS
```

Also print each bone's:

- name
- parent
- local position
- local rotation
- children

Example output format:

```text
Hips
  Spine
    Chest
      Neck
        Head
      LeftShoulder
        LeftUpperArm
          LeftLowerArm
            LeftHand
              ...
```

Do not guess bone names.

Do not implement `retarget.ts` until the actual downloaded file has been inspected.

---

## 7. Recording format

Record 33 pose landmarks and 21 landmarks for each hand.

Per pose landmark:

```text
[x, y, z, visibility]
```

Per hand landmark:

```text
[x, y, z]
```

Total values per frame:

```text
33 × 4 = 132
21 × 3 = 63
21 × 3 = 63
----------------
Total  = 258 values
```

This intentionally matches the 258-dimensional landmark representation used by the main WBSL project.

### `movement.json`

Use this structure:

```json
{
  "version": 1,
  "fps": 30,
  "frameCount": 0,
  "duration": 0,
  "frames": [
    {
      "pose": [],
      "leftHand": [],
      "rightHand": []
    }
  ]
}
```

Also include source metadata where practical:

```json
{
  "source": {
    "width": 1280,
    "height": 720
  }
}
```

Do not store face mesh in the first version.

---

## 8. Recorder requirements

Create `tools/record.py`.

### Controls

```text
R     Start/stop recording
C     Clear current recording
ESC   Exit
```

### Preview information

Show:

```text
REC: ON/OFF
FPS
Frames
Pose: OK/Missing
Left Hand: OK/Missing
Right Hand: OK/Missing
```

When recording is active, save one landmark frame per processed video frame.

Use MediaPipe video-stream tracking/smoothing where available.

Do not heavily smooth the data in the recorder. The saved data should remain useful for later comparison and interpolation.

### Missing data

A missing hand must not be encoded as a random position.

Use an explicit missing/empty representation or a zero-filled landmark block plus a clear hand-presence indicator in metadata.

For the first minimal implementation, the viewer may hold the previous hand pose when a hand disappears.

---

## 9. Normalization

Do not drive the 3D skeleton directly from raw camera coordinates.

Calculate the shoulder centre:

```text
shoulderCenter = (leftShoulder + rightShoulder) / 2
```

Calculate shoulder width:

```text
shoulderWidth = distance(leftShoulder, rightShoulder)
```

Normalize each landmark:

```text
P_normalized = (P - shoulderCenter) / shoulderWidth
```

The purpose is to reduce dependency on:

- camera distance
- signer position in frame
- overall body scale

Do not continuously rescale each individual body segment. Keep human body proportions from the recorded movement.

---

## 10. Coordinate conversion

MediaPipe coordinates and Three.js coordinates use different conventions.

Create exactly one conversion function in `retarget.ts`:

```text
mediaPipeToThree(point)
```

All coordinate conversion must go through this function.

Do not scatter X/Y/Z sign changes across the code.

Test the conversion with a known movement:

```text
Raise right hand
```

The corresponding skeleton hand must move upward on screen.

If movement is mirrored, fix the single coordinate/handedness conversion layer rather than adding random inversions elsewhere.

---

## 11. Body landmark mapping

Use MediaPipe pose landmarks approximately as follows:

```text
11 = left shoulder
13 = left elbow
15 = left wrist

12 = right shoulder
14 = right elbow
16 = right wrist

23 = left hip
25 = left knee
27 = left ankle

24 = right hip
26 = right knee
28 = right ankle
```

The exact model bone names must come from the downloaded GLB/FBX inspection.

Conceptual mapping:

```text
11 → LeftUpperArm start
13 → LeftUpperArm end
13 → LeftLowerArm start
15 → LeftLowerArm end
15 → LeftHand
```

and similarly for the right side and legs.

Do not assume the model's left/right naming until verified against the actual model.

---

## 12. Bone rotation method

Do not set normal humanoid bones directly to landmark positions.

Instead:

```text
start landmark
      ↓
end landmark
      ↓
direction vector
      ↓
compare with model rest-pose bone direction
      ↓
quaternion rotation
      ↓
bone.quaternion
```

For a bone segment:

```text
D = end - start
```

Normalize when needed:

```text
D̂ = D / |D|
```

Then construct the rotation from the bone's rest direction to `D̂`.

Keep this math isolated in `retarget.ts`.

Do not mix rendering code with retargeting math.

---

## 13. Hands and fingers

After body retargeting works, add hand control.

MediaPipe hand indices:

```text
0  wrist

Thumb:
1 → 2 → 3 → 4

Index:
5 → 6 → 7 → 8

Middle:
9 → 10 → 11 → 12

Ring:
13 → 14 → 15 → 16

Pinky:
17 → 18 → 19 → 20
```

Use each landmark chain to determine finger segment directions.

Do not initially use one rotation for an entire finger.

Each phalanx should be controlled from its corresponding landmark segment whenever the model provides separate finger bones.

---

## 14. Finger and wrist accuracy rules

The main purpose of this POC is sign-language movement, so hands matter more than decorative body rendering.

Prioritize:

```text
wrist position/orientation
palm orientation
finger spread
finger bend
thumb position
```

A visually beautiful skeleton with incorrect fingers is considered a failed test.

---

## 15. Playback

`movement.json` is the source animation.

Implement:

```text
Play
Pause
Reset
0.5x
1x
2x
Timeline scrubber
```

The current frame should be easy to inspect.

Do not regenerate React state for every bone update.

Use refs and the Three.js/R3F render loop for high-frequency updates.

---

## 16. Frame interpolation

First make direct frame-to-frame playback work.

Only then add interpolation.

For landmark positions:

```text
P = lerp(P0, P1, t)
```

For bone rotations:

```text
Q = slerp(Q0, Q1, t)
```

Interpolation must not modify the original `movement.json` data.

---

## 17. Missing-hand behaviour

Never move a missing hand to world origin.

Use:

```text
hand visible
    ↓
update hand

hand missing
    ↓
hold previous pose
```

Optional later behaviour:

```text
long missing period
    ↓
gradual fade / relaxed pose
```

The first version only needs the hold rule.

---

## 18. Viewer features

The viewer should contain:

```text
3D skeleton
OrbitControls
Zoom
Reset camera
Front view
Side view
3/4 view
Playback
Timeline
Debug landmark overlay
Bone-name debug mode
```

Keep the UI simple.

Do not spend time on complex visual effects during the retargeting milestone.

---

## 19. Debug mode

Implement a debug switch:

```text
SHOW LANDMARKS
```

When enabled, show:

```text
MediaPipe landmark points
+
landmark connection lines
+
3D skeleton
```

Implement another switch:

```text
SHOW BONE NAMES
```

This is temporary development UI and can be removed later.

Optional useful debug labels:

```text
LShoulder
LElbow
LWrist
RShoulder
RElbow
RWrist
```

---

## 20. Lighting and visual style

After movement is correct, use a clean anatomical presentation.

Preferred initial style:

- dark neutral background
- bone-like light material
- subtle secondary material for joints
- soft key light
- soft fill light
- subtle ground shadow
- no heavy bloom initially

The skeleton should remain clearly readable.

Do not add fantasy armor, weapons or character clothing.

The provided Human Skeleton model is being used because it makes captured movement easy to inspect.

---

## 21. Testing sequence

Test in this order.

### Test 1 — Still pose

Stand still for several seconds.

Expected:

- skeleton remains stable
- no large limb drift
- no obvious coordinate inversion

### Test 2 — Left arm

Raise and lower the left arm.

Expected:

- left upper arm follows shoulder → elbow
- left forearm follows elbow → wrist
- left hand follows wrist

### Test 3 — Right arm

Repeat on right side.

### Test 4 — Both arms

Raise both hands.

Expected:

- left/right are not swapped

### Test 5 — Wrist movement

Rotate/move the wrist.

Expected:

- hand follows correctly

### Test 6 — Hand opening

Open and close one hand.

Expected:

- fingers visibly follow landmark chains

### Test 7 — Finger articulation

Move individual fingers.

Expected:

- each finger segment follows the correct landmark segment

### Test 8 — Real sign

Record one simple sign.

Expected:

- complete movement plays correctly from `movement.json`

Only after all tests pass should the renderer be connected to WBSL Bridge.

---

## 22. Definition of success

The POC is successful when all of the following are true:

```text
[PASS] model loads
[PASS] bone hierarchy is inspectable
[PASS] recorded JSON loads
[PASS] body movement is correct
[PASS] left/right sides are correct
[PASS] wrist movement is acceptable
[PASS] finger movement is acceptable
[PASS] missing hands do not teleport
[PASS] playback works
[PASS] scrubber works
[PASS] front/side/3/4 views work
[PASS] interpolation looks smoother without changing source data
```

Accuracy is more important than appearance.

---

## 23. Do not make these architectural mistakes

### Do not

- rewrite the WBSL Bridge project during this experiment
- run MediaPipe again in the browser when the JSON already contains landmarks
- store the model's bones as React state every frame
- hard-code unknown bone names without inspecting the model
- mix coordinate conversion into rendering code
- convert missing hands to `[0, 0, 0]` and then directly use that position
- add a complex avatar rig before proving direct skeleton retargeting
- add face animation before hands work
- add unnecessary packages

### Do

- keep the recorder independent
- keep retargeting isolated
- keep the model replaceable
- keep the movement file replaceable
- make debugging visual
- test one arm before the whole body
- test fingers before visual polish

---

## 24. Recommended build order

### Milestone 1 — Project setup

Create Vite + React + TypeScript.

Install only the required Three.js/R3F dependencies.

### Milestone 2 — Model inspection

Put the downloaded Human Skeleton asset in the project.

Convert to GLB if required.

Load it and inspect every node/bone.

Do not retarget yet.

### Milestone 3 — Recorder

Build `tools/record.py`.

Record a 5–10 second movement and generate `movement.json`.

### Milestone 4 — Body retargeting

Control shoulders, elbows, wrists, hips, knees and ankles.

### Milestone 5 — Hand retargeting

Control palms and fingers.

### Milestone 6 — Playback

Add playback, speed and scrubber.

### Milestone 7 — Interpolation

Add position lerp and quaternion slerp.

### Milestone 8 — Visual polish

Lighting, material, shadows and camera presets.

### Milestone 9 — WBSL integration

Only after the separate POC is stable.

---

## 25. WBSL Bridge integration plan

Do not copy the whole test project into WBSL Bridge.

The eventual integration should be approximately:

```text
WBSL Bridge
│
├── existing landmark extraction
├── existing normalization
├── existing playback/data
│
└── 3D visualization
      ├── SkeletonViewer
      └── retarget.ts
```

The existing WBSL landmark data can then become the source instead of `movement.json`.

Conceptually:

```text
WBSL frames
   ↓
existing 258-dim / pose+hand data
   ↓
retarget adapter
   ↓
3D skeleton
```

Keep the existing 2D Canvas implementation as a fallback until the new renderer is proven stable.

---

## 26. Future extensions — not part of first POC

After the direct skeleton system works, possible extensions are:

```text
Face landmarks
Head orientation
Facial expression
VRM avatar
Mixamo-style avatar
Alternative GLB skeletons
Live webcam browser control
Side-by-side 2D + 3D view
Screenshot/export
3D movement recording
```

A rigged humanoid avatar can be tested later, but the anatomical skeleton should remain the reference/debug mode because it exposes whether the captured landmark movement is actually being reproduced.

---

## 27. Coding IDE operating rules

The coding IDE must work incrementally.

Before changing code:

1. Inspect the actual repository.
2. Inspect the actual model file.
3. Report the discovered bone hierarchy.
4. Make one small implementation step.
5. Run/build the project.
6. Fix errors before moving to the next milestone.

Never invent a model bone name.

Never silently replace the chosen Sketchfab model with another model.

Never silently add a new framework.

Never modify WBSL Bridge from this repository.

Prefer simple, readable TypeScript over abstraction-heavy architecture.

---

## 28. First prompt for the coding IDE

Use this as the first instruction:

```text
Read BUILD.md completely before changing anything.

This is a separate proof-of-concept project for MediaPipe landmark retargeting.

The target model is the exact Sketchfab asset documented in BUILD.md:
Free Pack - Human Skeleton by PolyOne Studio.

First task ONLY:
1. Create the minimal Vite React TypeScript project.
2. Add the required Three.js, React Three Fiber and Drei dependencies.
3. Put the provided model file in public/model.glb if it is already GLB.
4. If the model is FBX/another format, do not invent a browser conversion system; explain the simplest Blender conversion step and then continue after model.glb exists.
5. Load model.glb in Three.js.
6. Traverse the scene and print every node, mesh, skinned mesh, skeleton, bone, parent-child relationship and animation to the console.
7. Add OrbitControls and basic lighting.
8. Do NOT implement MediaPipe retargeting yet.
9. Do NOT add face tracking, VRM, Kalidokit, IK, backend, database or WBSL integration.
10. Keep the project minimal and follow BUILD.md exactly.

At the end, report:
- whether the model loaded
- whether an armature/skeleton exists
- the exact bone names and hierarchy
- whether the asset appears directly usable for bone retargeting
- any problem that must be solved before Milestone 3
```

---

## 29. Important model note

The selected Sketchfab Human Skeleton is a good candidate because the listing describes it as a human skeleton, optimized low-poly asset and includes rig/rigged/rigging-related tags. However, the final technical decision must be based on the actual downloaded asset's armature and bone hierarchy, not only the webpage metadata.

If the downloaded Human Skeleton turns out to be a static mesh without usable bones, stop at the inspection milestone and decide whether to rig it in Blender or switch to another **explicitly rigged** skeleton asset.

Do not implement a large retargeting system around an unrigged mesh.

---

## 30. Asset source record

**Asset:** Free Pack - Human Skeleton  
**Creator:** PolyOne Studio  
**Platform:** Sketchfab  
**Source URL:** https://sketchfab.com/3d-models/free-pack-human-skeleton-950d0a46531f492ab8715777e312a5bf  
**License shown on listing:** CC Attribution (CC BY)  
**Listing date shown:** October 11, 2025  
**Listing details:** 51.7k triangles / 26.4k vertices on the Sketchfab model page; package description says one human skeleton and lists multiple source formats.

Keep this section unchanged when the asset is used in the project unless the source/license changes.

---

## 31. Final target

The final POC should demonstrate:

```text
Record a movement with OpenCV
          ↓
movement.json
          ↓
Open the web viewer
          ↓
Load the exact Human Skeleton
          ↓
Press Play
          ↓
The skeleton reproduces the recorded body + hand + finger movement
```

When this works reliably for a real sign-language movement, the project has achieved its purpose.
