# WBSL Bridge — Bengali NLG Model Testing

## 1. Best Models

### Primary Reference Model

`gemma-4-12b-it-Q4_0.gguf`

* ~97% observed manual accuracy
* Best overall Bengali quality
* Good WBSL gloss interpretation
* Good question and negation handling
* Good NMM and emotion handling
* ~13 GB RAM with Brave + KoboldCpp

### Final Deployment Model

`gemma-4-E4B-it-Q4_K_M.gguf`

* Very good Bengali generation
* Natural West Bengal Bengali
* Good question and negation handling
* Good NMM and emotion handling
* Faster inference
* ~10 GB RAM with Brave + KoboldCpp
* Better memory efficiency
* Suitable for CPU inference

---

## 2. Models Tested

| Model                              | Result           | Main Issue                          |
| ---------------------------------- | ---------------- | ----------------------------------- |
| `gemma-4-12b-it-Q4_0.gguf`         | **Best Quality** | Higher RAM                          |
| `gemma-4-E4B-it-Q4_K_M.gguf`       | **Selected**     | Slightly lower semantic consistency |
| `gpt-oss-20b-Q4_K_M.gguf`          | Failed           | Poor Bengali                        |
| `Qwen3.6-35B-A3B-UD-IQ2_M.gguf`    | Failed           | Poor Bengali                        |
| `Qwen3.5-9B-UD-IQ3_XXS.gguf`       | Failed           | Poor Bengali                        |
| `gemma-4-26B-A4B-it-UD-IQ2_M.gguf` | Failed           | Memory limit exceeded               |

---

## 3. WBSL NLG Pipeline

```text
Temporal LSTM
      ↓
Sign Gloss Sequence
      +
Geometry NMM
      ↓
Question / Negation
      +
DeepFace Emotion
      ↓
Gemma 4 E4B
      ↓
Natural Bengali Sentence
```

The LLM is used only for the **Bengali NLG stage**.

---

## 4. Final NLG Prompt

```text
You are the Bengali NLG module of a WBSL communication system.

Convert the WBSL gloss into natural West Bengal Bengali.

PRIMARY GOAL:
Preserve ALL meaning from the gloss while producing natural Bengali.

STRICT RULES:

- Do NOT summarize the gloss.
- Do NOT omit meaningful information.
- Do NOT skip events or actions.
- Do NOT remove people, objects, places, time, reason, result,
  negation, ability, or relationships.
- Every meaningful gloss unit must be represented in the output.
- You may freely reorder the gloss to follow natural Bengali grammar.
- Do not translate word-by-word.
- Preserve the exact semantic meaning.
- Preserve tense when indicated.
- Preserve negation.
- Preserve question meaning.
- Preserve cause and effect.
- Preserve sequence of events.
- Preserve uncertainty.
- Preserve emotion naturally without changing the meaning.
- NMM information is grammatically meaningful.
- Do not invent information that is not present.
- Do not add names, places, time, objects, or relationships.
- Do not summarize multiple events into one vague statement.
- If the gloss contains many events, use multiple Bengali sentences.
- Prefer completeness over brevity.
- Use natural West Bengal Bengali.
- Output ONLY the Bengali text.
- Do not explain your answer.
- Do not output English.

Before generating the final answer, internally check that every
meaningful information unit from the gloss has been represented.
Do not output this internal check.

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

Output:
```

---

# 5. Reduced Test Suite

Use the **same prompt and generation settings** for every model.

### Test 1 — Question + Negation

```text
Gloss:
YOU + TOMORROW + SCHOOL + GO + NOT

Question: true
Negation: true
Emotion: neutral
NMM: Eyebrow raise = question; Head shake = negation
```

Expected:

```text
তুমি কি আগামীকাল স্কুলে যাবে না?
```

### Test 2 — Past Question + Negation

```text
Gloss:
YOU + YESTERDAY + FRIEND + MEET + BUT + NOT + TALK + WHY

Question: true
Negation: true
Emotion: confused
NMM: Eyebrow raise + Head tilt + Head shake
```

Expected:

```text
তুমি গতকাল বন্ধুর সাথে দেখা করলে কিন্তু কথা বললে না কেন?
```

### Test 3 — Natural Grammar

```text
Gloss:
YESTERDAY + I + RAIN + BECAUSE + SCHOOL + GO + NOT

Question: false
Negation: true
Emotion: neutral
NMM: Head shake = negation
```

Expected:

```text
গতকাল বৃষ্টির কারণে আমি স্কুলে যাইনি।
```

### Test 4 — Honorific Question

```text
Gloss:
YOU + TEACHER + TODAY + SCHOOL + COME

Question: true
Negation: false
Emotion: neutral
NMM: Eyebrow raise = question
```

Expected:

```text
আপনি কি আজ স্কুলে এসেছেন?
```

### Test 5 — No Hallucination

```text
Gloss:
I + BOOK + READ

Question: false
Negation: false
Emotion: happy
NMM: None
```

Expected:

```text
আমি বই পড়ি।
```

### Test 6 — Negative Ability

```text
Gloss:
YOU + THIS + PROBLEM + SOLVE + NOT + CAN

Question: true
Negation: true
Emotion: concerned
NMM: Eyebrow raise + Head shake
```

Expected:

```text
তুমি কি এই সমস্যাটি সমাধান করতে পারবে না?
```

### Test 7 — Emotion

```text
Gloss:
I + LOSE + BOOK

Question: false
Negation: false
Emotion: sad
NMM: Mouth down = sadness
```

Expected:

```text
আমি বইটি হারিয়েছি।
```

### Test 8 — Full Stress Test

```text
Gloss:
YOU + YESTERDAY + EXAM + HAVE + BUT + PREPARE + NOT + CAN + SO + RESULT + GOOD + NOT + WHY

Question: true
Negation: true
Emotion: worried
NMM: Eyebrow raise + Head shake + Head tilt + Mouth tense
```

Semantic target:

```text
তোমার গতকাল পরীক্ষা ছিল, কিন্তু তুমি প্রস্তুতি নিতে পারোনি, তাই ফল ভালো হবে না—কেন?
```

---

## Final Selection

```text
Reference:
gemma-4-12b-it-Q4_0.gguf

Deployment:
gemma-4-E4B-it-Q4_K_M.gguf
```

**Final deployment model:** `gemma-4-E4B-it-Q4_K_M.gguf`

**Reason:** Strong Bengali NLG with lower RAM usage and faster CPU inference, making it more practical for the WBSL Bridge system.
