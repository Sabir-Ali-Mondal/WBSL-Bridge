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

Each gloss word uses:

```text
GLOSS[?][negation][emotion]
```

* `[?]` = word belongs to a question clause
* `[negation]` = word is negated
* `[emotion]` = emotion of the signer

Possible emotions:

```text
happy, sad, angry, neutral, surprise, fear, disgust
```

Markers that are not applicable are omitted.

Example:

```text
I[neutral] + BOOK[?][neutral] + BUY[?][negation][neutral]
```

Consecutive `[?]` words normally form **one question**, not separate questions.

Example:

```text
WHY[?][neutral] + TODAY[?][neutral] +
COLLEGE[?][neutral] + COME[?][negation][neutral]
```

means:

```text
আজ কলেজে আসিনি কেন?
```

`[?]` and `[negation]` are independent markers.

---

## 4. Final NLG Prompt

```text
You are the Bengali NLG module of a WBSL communication system.

Convert the WBSL gloss into natural West Bengal Bengali.

FORMAT GUIDE:

Each word may contain:

[?] = belongs to a question clause
[negation] = negated
[emotion] = emotion while signing this word

Possible emotions:
happy, sad, angry, neutral, surprise, fear, disgust

Words are joined by + and must be read in signing order.

MAIN GOAL:

Preserve the COMPLETE meaning of the gloss while producing natural Bengali.

RULES:

- Preserve EVERY meaningful event, action, person, object, place, time,
  reason, result, relationship, ability, permission, obligation,
  condition, uncertainty and emotion.
- Do NOT summarize or omit information.
- Do NOT invent information.
- Do NOT translate word-by-word.
- You may reorder words to make natural Bengali.
- Preserve tense, time, sequence, cause and effect.
- Preserve who performs each action and who receives it.
- Do NOT merge separate events if doing so changes their meaning.
- If the gloss contains multiple events, use multiple Bengali sentences.
- Preserve negation exactly.
- Preserve CAN, CANNOT, MAY, MUST, SHOULD and NOT-NOW correctly.
- Preserve IF/THEN/OTHERWISE conditions.
- Preserve questions as questions.
- Preserve reported speech and speaker changes.
- Preserve uncertainty such as WHETHER, NOT-SURE and HOPE.
- NMM information is meaningful and must be reflected naturally.
- Emotion should be expressed naturally without adding emotion not given.
- Use natural West Bengal Bengali.
- Prefer completeness over brevity.

QUESTION RULE:

Consecutive words containing [?] normally belong to ONE question clause.
Do NOT create a separate question for every [?].

NEGATION RULE:

[negation] must never be lost.
Do not introduce negation for a word that has no [negation] marker unless
the gloss explicitly contains another negation unit.

EVENT RULE:

Keep separate semantic events separate when necessary.

Example:

I[neutral] + COLLEGE[neutral] + GO[neutral] +
FRIEND[neutral] + MEET[neutral]

means:

আমি কলেজে গিয়েছিলাম। সেখানে বন্ধুর সঙ্গে দেখা হয়েছিল।

Do NOT change it to:

আমি বন্ধুর সঙ্গে কলেজে গিয়েছিলাম।

Another example:

THEY[neutral] + ASK[neutral] + CHEST_PAIN[?][neutral] +
SHE[neutral] + SAY[neutral] + NO[?][negation][neutral]

must preserve both events:

তাঁরা জিজ্ঞাসা করলেন, বুকে ব্যথা আছে কি না।
তিনি বললেন, না।

CONDITION RULE:

IF + A + THEN + B + OTHERWISE + C
must remain a conditional structure in Bengali.

NO-HALLUCINATION RULE:

Do not add names, places, objects, time, causes, relationships,
symptoms or actions that are not present in the gloss.

Before answering, internally verify that:
- every meaningful event is present
- no subject/action relationship changed
- no negation was lost
- no condition was lost
- no question was changed into a statement
- no information was invented

Do not output this check.

Output ONLY the Bengali text.
```

---

## 5. Test Suite

### Test 1 — Question + Negation

```text
YOU[?][neutral] + TOMORROW[?][neutral] +
SCHOOL[?][neutral] + GO[?][negation][neutral]
```

Expected:

```text
তুমি কি আগামীকাল স্কুলে যাবে না?
```

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

### Test 3 — Honorific Question

```text
YOU[?][neutral] + TEACHER[?][neutral] +
TODAY[?][neutral] + SCHOOL[?][neutral] +
COME[?][neutral]
```

Expected:

```text
আপনি কি আজ স্কুলে এসেছেন?
```

### Test 4 — No Hallucination

```text
I[happy] + BOOK[happy] + READ[happy]
```

Expected:

```text
আমি বই পড়ি।
```

### Test 5 — Negative Ability

```text
YOU[?][neutral] + THIS[?][neutral] +
PROBLEM[?][neutral] + SOLVE[?][negation][neutral] +
CAN[?][negation][neutral]
```

Expected:

```text
তুমি কি এই সমস্যাটি সমাধান করতে পারবে না?
```

### Test 6 — Emotion

```text
I[sad] + LOSE[sad] + BOOK[sad]
```

Expected:

```text
আমি বইটি হারিয়েছি।
```

### Test 7 — Full Stress Test

```text
YOU[?][angry] + YESTERDAY[?][angry] +
EXAM[?][angry] + HAVE[?][angry] +
BUT[?][angry] + PREPARE[?][negation][angry] +
CAN[?][negation][angry] + SO[?][angry] +
RESULT[?][negation][angry] +
GOOD[?][negation][angry] +
WHY[?][angry]
```

Expected:

```text
তোমার গতকাল পরীক্ষা ছিল, কিন্তু তুমি প্রস্তুতি নিতে পারোনি,
তাই ফল ভালো হবে না—কেন?
```

### Test 8 — Multi-Event Semantic Test

```text
THEY[neutral] + ASK[neutral] +
CHEST_PAIN[?][neutral] +
SHE[neutral] + SAY[neutral] +
NO[?][negation][neutral] +
BREATHING[neutral] + VERY[neutral] + FAST[neutral]
```

Expected:

```text
তাঁরা জিজ্ঞাসা করলেন, তাঁর বুকে ব্যথা আছে কি না।
তিনি বললেন, না।
তবে তাঁর শ্বাস-প্রশ্বাস খুব দ্রুত হচ্ছিল।
```

This specifically tests **question scope, negation, subject binding, and separate event preservation**.

---

## Observed Performance

```text
Prompt processing: ~38 tok/s
Generation:        ~6.2 tok/s
RAM:               ~10 GB
```

Long stress test:

```text
Processed: ~650 tokens
Generated: ~212 tokens
Generation speed: ~6.16 tok/s
Total request: ~109 sec
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

Reason: strong Bengali NLG, good long-gloss handling, good question and negation handling, faster CPU inference, and lower RAM usage.
