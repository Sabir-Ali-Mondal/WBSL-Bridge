# WBSL Bridge — Bengali NLG Model Testing

## 1. Current Best Model

**Model:** `gemma-4-12b-it-Q4_0.gguf`

**Status:** **Best model tested so far**

### Results

* ~97% observed accuracy in manual testing
* Good natural West Bengal Bengali
* Good WBSL gloss interpretation
* Good question and negation handling
* Good NMM and emotion handling
* Good generation speed
* Suitable for local CPU inference

### Memory

```text
System RAM:        ~15 GB
Brave + KoboldCpp: ~13 GB
Available headroom: ~2 GB
```

---

## 2. WBSL NLG Pipeline

```text
Temporal LSTM
      ↓
Sign Gloss Sequence + Geometry NMM
      ↓
Question / Negation
      +
DeepFace Emotion
      ↓
Bengali NLG LLM
      ↓
Natural Bengali Sentence
```

The LLM is used only for the **Natural Language Generation (NLG)** stage.

---

## 3. Final Prompt

```text
You are the Bengali NLG module of a WBSL communication system.

Convert the given WBSL sign information into ONE natural Bengali sentence.

Rules:
- Use natural West Bengal Bengali.
- Preserve the exact meaning of the gloss.
- Do not translate word-by-word.
- Preserve question and negation.
- Correctly handle Bengali SOV grammar.
- Use natural Bengali tense only when clearly indicated.
- Do not invent missing information.
- Do not add names, places, objects, time, gender, or relationships.
- Preserve uncertainty and emphasis if present.
- Emotion may affect wording only when naturally appropriate.
- NMM information is grammatically meaningful and must be respected.
- Question + negation must remain a question + negation.
- Output exactly ONE Bengali sentence.
- Do not explain the answer.
- Do not output English.
- Use Bengali punctuation.
- Output ONLY the final Bengali sentence.

Inputs:

Gloss:
{GLOSS}

Question:
{QUESTION}

Negation:
{NEGATION}

Emotion:
{EMOTION}

NMM:
{NMM}

Give Output:
```

---

# 4. Reduced Hard Test Suite

Use the **same prompt, settings, and generation parameters** for every model.

## Test 1 — Question + Negation

```text
Gloss:
YOU + TOMORROW + SCHOOL + GO + NOT

Question:
true

Negation:
true

Emotion:
neutral

NMM:
Eyebrow raise = question
Head shake = negation
```

**Expected:**

```text
তুমি কি আগামীকাল স্কুলে যাবে না?
```

---

## Test 2 — Past Question + Negation

```text
Gloss:
YOU + YESTERDAY + FRIEND + MEET + BUT + NOT + TALK + WHY

Question:
true

Negation:
true

Emotion:
confused

NMM:
Eyebrow raise = question
Head tilt = confusion
Head shake = negation
```

**Expected:**

```text
তুমি গতকাল বন্ধুর সাথে দেখা করলে কিন্তু কথা বললে না কেন?
```

---

## Test 3 — Ability + Negation

```text
Gloss:
I + EXAM + TOMORROW + HAVE + BUT + PREPARE + NOT + CAN

Question:
false

Negation:
true

Emotion:
worried

NMM:
Head shake = negation
Mouth tense = concern
```

**Expected:**

```text
আমার আগামীকাল পরীক্ষা আছে কিন্তু আমি প্রস্তুতি নিতে পারছি না।
```

---

## Test 4 — Natural Bengali Grammar

```text
Gloss:
YESTERDAY + I + RAIN + BECAUSE + SCHOOL + GO + NOT

Question:
false

Negation:
true

Emotion:
neutral

NMM:
Head shake = negation
```

**Expected:**

```text
গতকাল বৃষ্টির কারণে আমি স্কুলে যাইনি।
```

**Tests:** gloss reordering + Bengali grammar + past tense.

---

## Test 5 — Honorific + Question

```text
Gloss:
YOU + TEACHER + TODAY + SCHOOL + COME

Question:
true

Negation:
false

Emotion:
neutral

NMM:
Eyebrow raise = question
```

**Expected:**

```text
আপনি কি আজ স্কুলে এসেছেন?
```

**Tests:** honorific + question + natural tense.

---

## Test 6 — No Hallucination

```text
Gloss:
I + BOOK + READ

Question:
false

Negation:
false

Emotion:
happy

NMM:
None
```

**Expected:**

```text
আমি বই পড়ি।
```

The model must **not** add information such as:

```text
আমি আজ স্কুলে বসে বই পড়ি।
```

---

## Test 7 — Negative Frequency

```text
Gloss:
I + NEVER + SCHOOL + MISS + CLASS

Question:
false

Negation:
true

Emotion:
neutral

NMM:
Head shake = negation
```

**Expected:**

```text
আমি কখনও স্কুলের ক্লাস মিস করি না।
```

**Tests:** frequency + negative construction.

---

## Test 8 — Emotion Without Meaning Change

```text
Gloss:
I + LOSE + BOOK

Question:
false

Negation:
false

Emotion:
sad

NMM:
Mouth down = sadness
```

**Expected:**

```text
আমি বইটি হারিয়েছি।
```

Emotion must not introduce new information.

---

## Test 9 — Complex Question + Negation

```text
Gloss:
YOU + THIS + PROBLEM + SOLVE + NOT + CAN

Question:
true

Negation:
true

Emotion:
concerned

NMM:
Eyebrow raise = question
Head shake = negation
Mouth tense = concern
```

**Expected:**

```text
তুমি কি এই সমস্যাটি সমাধান করতে পারবে না?
```

---

# 5. Full Stress Test

## Test 10 — Multi-Clause WBSL NLG

```text
Gloss:
YOU + YESTERDAY + EXAM + HAVE + BUT + PREPARE + NOT + CAN + SO + RESULT + GOOD + NOT + WHY

Question:
true

Negation:
true

Emotion:
worried

NMM:
Eyebrow raise = question
Head shake = negation
Head tilt = confusion
Eyebrows raised + mouth tense = concern
```

### Tests

* Long gloss sequence
* Multiple clauses
* Question
* Multiple negations
* Cause/effect
* Emotion
* NMM
* Bengali sentence restructuring
* Hallucination control

This is the **primary stress test** for comparing larger models.

---

# 6. Scoring

For each test, evaluate:

| Criteria                  | Score |
| ------------------------- | ----: |
| Meaning preserved         |     1 |
| Question/negation correct |     1 |
| Bengali grammar natural   |     1 |
| NMM correctly handled     |     1 |
| No hallucination          |     1 |

**Maximum:** 5 points/test

```text
10 Tests × 5 = 50 points
```

### Accuracy

```text
Accuracy (%) = (Obtained Score / 50) × 100
```

For practical model comparison, also record:

```text
Model
Quantization
RAM Usage
Generation Speed
Score / 50
Accuracy %
Notes
```

---

# 7. Current Benchmark

```text
Gemma 4 12B Q4_0
        ↓
~97% observed accuracy
~13 GB RAM
Good speed
        ↓
BEST PRACTICAL CHOICE
```

### Comparison

```text
Qwen3.6-35B-A3B-IQ2_M
        ↓
Similar quality
~14 GB RAM
Good speed
        ↓
Higher capacity
but worse RAM efficiency
```

**Current conclusion:** `gemma-4-12b-it-Q4_0.gguf` remains the **best practical Bengali NLG model tested so far** for the WBSL Bridge local CPU setup.
