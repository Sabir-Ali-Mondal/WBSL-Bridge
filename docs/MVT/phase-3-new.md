# WBSL Bridge — Bengali NLG Model Testing

## 1. Models & Final Selection

| Model | Result | Main Issue |
|---|---|---|
| `gemma-4-12b-it-Q4_0.gguf` | **Best Quality / Reference** | Higher RAM |
| `gemma-4-E4B-it-Q4_K_M.gguf` | **Selected for Deployment** | Slightly lower semantic consistency |
| `gpt-oss-20b-Q4_K_M.gguf` | Failed | Poor Bengali |
| `Qwen3.6-35B-A3B-UD-IQ2_M.gguf` | Failed | Poor Bengali |
| `Qwen3.5-9B-UD-IQ3_XXS.gguf` | Failed | Poor Bengali |
| `gemma-4-26B-A4B-it-UD-IQ2_M.gguf` | Failed | Memory limit exceeded |

### Reference Model

`gemma-4-12b-it-Q4_0.gguf`

- ~97% observed manual accuracy
- Best overall Bengali quality
- Good WBSL gloss interpretation
- Good question and negation handling
- Good NMM and emotion handling
- ~13 GB RAM with Brave + KoboldCpp

### Deployment Model

`gemma-4-E4B-it-Q4_K_M.gguf`

- Very good Bengali generation
- Natural West Bengal Bengali
- Good question and negation handling
- Good NMM and emotion handling
- Good long-gloss handling after prompt optimization
- Faster CPU inference
- ~10 GB RAM with Brave + KoboldCpp
- Better memory efficiency

---

## 2. WBSL NLG Pipeline

```text
Temporal LSTM
      ↓
Sign Gloss Sequence
      +
Geometry NMM
      ↓
Question / Negation
      +
ViT-ONNX Emotion
      ↓
Inline Format Builder
      ↓
Gemma 4 E4B
      ↓
Natural Bengali Text
````

The LLM is used only for the **Bengali NLG stage**.

---

## 3. Input Format

Each gloss word is encoded as:

```text
WORD[emotion]
WORD[negation][emotion]
```

A question is marked **once at the end of the complete question clause**:

```text
WORD[emotion] ... END[?][emotion]
```

### Markers

```text
[?]         = the whole clause ending here is a question
[negation]  = this word carries negation
[emotion]   = signer emotion
```

Possible emotions:

```text
happy, sad, angry, neutral, surprise, fear, disgust
```

### Important

Do not put `[?]` on every question word.

Wrong:

```text
WHY[?] TODAY[?] COLLEGE[?] COME[?]
```

Correct:

```text
WHY[neutral] TODAY[neutral] COLLEGE[neutral] COME[?][neutral]
```

This means one question:

```text
আজ কলেজে আসিনি কেন?
```

Likewise, do not duplicate negation:

Wrong:

```text
BUY[negation] NOT[negation]
```

Use:

```text
BUY[negation]
```

The runtime formatter should normalize standalone `NOT` / `NO` markers so the model receives one clear negation signal.

Words are joined with `+` and read left to right in signing order.

---

## 4. Final NLG Prompt

```text
You are the Bengali NLG module of a WBSL communication system.

Convert the WBSL gloss into natural West Bengal Bengali.

INPUT FORMAT:

WORD[emotion]
WORD[negation][emotion]
WORD[?][emotion]

[?] appears ONLY on the LAST word of a complete question clause.
It means the whole clause ending there is a question.

[negation] marks the word whose meaning is negated.
Do not invent negation.

Emotion may be:
happy, sad, angry, neutral, surprise, fear, disgust.

MAIN GOAL:

Preserve the COMPLETE meaning of the gloss in natural Bengali.

RULES:

- Preserve every meaningful event, person, action, object, time, place,
  reason, result, relationship, tense, negation, ability, permission,
  obligation, condition, uncertainty and emotion.
- Do not summarize.
- Do not omit events.
- Do not invent information.
- Do not translate word by word.
- You may reorder words for natural Bengali.
- Preserve who does each action.
- Preserve event order and cause/effect.
- Keep separate events separate when needed.
- Use multiple Bengali sentences when necessary.
- Preserve CAN, CANNOT, MAY, MUST, SHOULD and NOT-NOW.
- Preserve IF/THEN/OTHERWISE.
- Preserve questions as questions.
- Preserve reported speech and speaker changes.
- Preserve WHETHER, NOT-SURE and HOPE.
- Reflect NMM and emotion naturally without adding facts.
- Use natural West Bengal Bengali.
- Prefer complete meaning over short output.
- Output ONLY Bengali text.

IMPORTANT:

[?] is one question boundary, not one question per word.

Example:
YOU + YESTERDAY + EXAM + HAVE + BUT + PREPARE[negation] +
CAN[negation] + RESULT[negation] + GOOD[negation] + WHY[?]

must be one connected question, not two questions.

Example:
THEY + ASK + CHEST_PAIN + SHE + SAY + NO

must preserve both events:
তাঁরা জিজ্ঞাসা করলেন, বুকে ব্যথা আছে কি না।
তিনি বললেন, না।

Example:
I + COLLEGE + GO + FRIEND + MEET

means:
আমি কলেজে গিয়েছিলাম। সেখানে বন্ধুর সঙ্গে দেখা হয়েছিল।

Do not change it to:
আমি বন্ধুর সঙ্গে কলেজে গিয়েছিলাম।

NEGATION:
Only use negation when the gloss provides it.
Do not make an unmarked word negative.

NO HALLUCINATION:
Do not add names, places, objects, causes, time, relationships,
symptoms or actions not present in the gloss.

Before answering, internally check:
every event, subject, negation, question, condition and speaker is preserved.

Do not output the check.

Output ONLY the final natural West Bengal Bengali text.
```

---

## 5. Test Suite

### Test 1 — Question + Negation

```text
YOU[neutral] + TOMORROW[neutral] +
SCHOOL[neutral] + GO[negation][?][neutral]
```

Expected:

```text
তুমি কি আগামীকাল স্কুলে যাবে না?
```

---

### Test 2 — Natural Grammar

```text
YESTERDAY[neutral] + I[neutral] + RAIN[neutral] +
BECAUSE[neutral] + SCHOOL[negation][neutral] +
GO[negation][neutral]
```

Expected:

```text
গতকাল বৃষ্টির কারণে আমি স্কুলে যাইনি।
```

---

### Test 3 — Honorific Question

```text
YOU[neutral] + TEACHER[neutral] +
TODAY[neutral] + SCHOOL[neutral] +
COME[?][neutral]
```

Expected:

```text
আপনি কি আজ স্কুলে এসেছেন?
```

---

### Test 4 — No Hallucination

```text
I[happy] + BOOK[happy] + READ[happy]
```

Expected:

```text
আমি বই পড়ি।
```

---

### Test 5 — Negative Ability

```text
YOU[neutral] + THIS[neutral] + PROBLEM[neutral] +
SOLVE[negation][neutral] + CAN[negation][?][neutral]
```

Expected:

```text
তুমি কি এই সমস্যাটি সমাধান করতে পারবে না?
```

---

### Test 6 — Emotion

```text
I[sad] + LOSE[sad] + BOOK[sad]
```

Expected:

```text
আমি বইটি হারিয়েছি।
```

---

### Test 7 — Full Stress Test

```text
YOU[angry] +
YESTERDAY[angry] +
EXAM[angry] +
HAVE[angry] +
BUT[angry] +
PREPARE[negation][angry] +
CAN[negation][angry] +
SO[angry] +
RESULT[negation][angry] +
GOOD[negation][angry] +
WHY[?][angry]
```

Expected:

```text
তোমার গতকাল পরীক্ষা ছিল, কিন্তু তুমি প্রস্তুতি নিতে পারোনি,
তাই ফল ভালো হবে না—কেন?
```

This specifically tests:

* one long question
* multiple negations
* ability
* cause/effect
* emotion
* semantic scope

---

### Test 8 — Multi-Event Semantic Test

```text
THEY[neutral] +
ASK[neutral] +
CHEST_PAIN[neutral] +
SHE[neutral] +
SAY[neutral] +
NO[negation][?][neutral] +
BREATHING[neutral] +
VERY[neutral] +
FAST[neutral]
```

Expected:

```text
তাঁরা জিজ্ঞাসা করলেন, তাঁর বুকে ব্যথা আছে কি না।
তিনি বললেন, না।
তবে তাঁর শ্বাস-প্রশ্বাস খুব দ্রুত হচ্ছিল।
```

This tests:

* question scope
* negation
* subject binding
* separate events
* reported speech

---

## Observed Performance

```text
Prompt processing: ~38 tok/s
Generation:        ~6.2 tok/s
RAM:               ~10 GB
```

### Long Stress Test

```text
Processed:         ~650 tokens
Generated:         ~212 tokens
Generation speed:  ~6.16 tok/s
Total request:     ~109 sec
```

---

## Final Selection

```text
Reference Model:
gemma-4-12b-it-Q4_0.gguf

Deployment Model:
gemma-4-E4B-it-Q4_K_M.gguf
```

**Final deployment model:** `gemma-4-E4B-it-Q4_K_M.gguf`

Strong Bengali NLG, good long-gloss handling, good question and negation
handling, faster CPU inference, and lower RAM usage make it the most practical
current model for the WBSL Bridge Bengali NLG stage.
