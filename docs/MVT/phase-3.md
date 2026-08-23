# WBSL Bridge — Bengali NLG Model Testing

## 1. Best Models

### Primary Reference Model

`gemma-4-12b-it-Q4_0.gguf`

- ~97% observed manual accuracy
- Best overall Bengali quality
- Good WBSL gloss interpretation
- Good question and negation handling
- Good NMM and emotion handling
- ~13 GB RAM with Brave + KoboldCpp

### Final Deployment Model

`gemma-4-E4B-it-Q4_K_M.gguf`

- Very good Bengali generation
- Natural West Bengal Bengali
- Good question and negation handling
- Good NMM and emotion handling
- Good long-gloss handling after prompt optimization
- Faster inference
- ~10 GB RAM with Brave + KoboldCpp
- Better memory efficiency
- Suitable for CPU inference

---

## 2. Models Tested

| Model | Result | Main Issue |
|---|---|---|
| `gemma-4-12b-it-Q4_0.gguf` | **Best Quality** | Higher RAM |
| `gemma-4-E4B-it-Q4_K_M.gguf` | **Selected** | Slightly lower semantic consistency |
| `gpt-oss-20b-Q4_K_M.gguf` | Failed | Poor Bengali |
| `Qwen3.6-35B-A3B-UD-IQ2_M.gguf` | Failed | Poor Bengali |
| `Qwen3.5-9B-UD-IQ3_XXS.gguf` | Failed | Poor Bengali |
| `gemma-4-26B-A4B-it-UD-IQ2_M.gguf` | Failed | Memory limit exceeded |

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
Natural Bengali Text
````

The LLM is used only for the **Bengali NLG stage**.

---

## 4. Final NLG Prompt

```text
You are the Bengali NLG module of a WBSL communication system.

Convert the WBSL gloss into natural West Bengal Bengali.

MAIN GOAL:
Preserve the COMPLETE meaning of the gloss while producing natural Bengali.

RULES:

- Preserve EVERY meaningful event, action, person, object, place, time,
  reason, result, relationship, negation, ability, permission,
  obligation, condition, uncertainty and emotion.
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

IMPORTANT EVENT RULE:

Treat separate actions as separate events when necessary.

Example:
I + COLLEGE + GO + FRIEND + MEET

means:
আমি কলেজে গিয়েছিলাম। সেখানে বন্ধুর সঙ্গে দেখা হয়েছিল।

Do NOT incorrectly change it to:
আমি বন্ধুর সঙ্গে কলেজে গিয়েছিলাম।

Example:
THEY + ASK + CHEST-PAIN + SHE + SAY + NO

must preserve BOTH events:
তাঁরা জিজ্ঞাসা করলেন, বুকে ব্যথা আছে কি না।
তিনি বললেন, না।

Do NOT remove the second event.

IMPORTANT NEGATION RULE:

NOT, NO, CANNOT, DO-NOT and NOT-NOW must never be lost.

IMPORTANT CONDITION RULE:

IF + A + THEN + B + OTHERWISE + C
must remain a conditional structure in Bengali.

IMPORTANT NO-HALLUCINATION RULE:

Do not add names, places, objects, time, causes, relationships,
symptoms or actions that are not present in the gloss.

FINAL INTERNAL CHECK:

Before answering, internally verify:
- every meaningful event is present
- no subject/action relationship changed
- no negation was lost
- no condition was lost
- no question was changed into a statement
- no information was invented

Do not output this check.

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

Output ONLY the Bengali text.
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

# 6. Large Bengali Power Test

This test evaluates the model's ability to handle a **long WBSL gloss sequence** rather than only individual grammatical cases.

```text
Gloss:
LAST-WEEK + I + COLLEGE + GO + FRIEND + MEET + THEN + WE + TOGETHER + LIBRARY + GO + MANY + BOOK + SEE + BUT + I + BOOK + BUY + NOT + BECAUSE + MONEY + HAVE + NOT + AFTER + LIBRARY + EXIT + HEAVY + RAIN + START + SO + WE + BUS + WAIT + BUT + BUS + COME + NOT + FINALLY + WE + WALK + HOME + GO + ON-THE-WAY + TEACHER + MEET + TEACHER + ASK + WHY + TODAY + COLLEGE + COME + NOT + I + EXPLAIN + RAIN + BECAUSE + LATE + ARRIVE + THEN + TEACHER + SAY + TOMORROW + EXAM + HAVE + PREPARE + WELL + MUST + I + WORRIED + BECAUSE + PREVIOUS + EXAM + RESULT + GOOD + NOT + BUT + FRIEND + SAY + THIS-TIME + RESULT + GOOD + WILL + I + HOPE + SO

Question:
false

Negation:
true

Emotion:
worried

NMM:
Head shake = negation
Mouth tense = concern
Head tilt = uncertainty
```

### Observed E4B Output

```text
গত সপ্তাহে আমি আমার বন্ধুর সাথে কলেজে গিয়েছিলাম। তারপর আমরা একসাথে লাইব্রেরিতে গিয়ে অনেক বই দেখেছি। কিন্তু আমি বই কিনিনি কারণ আমার কাছে টাকা ছিল না। লাইব্রেরি থেকে বের হওয়ার পরে ভারী বৃষ্টি শুরু হয়েছিল, তাই আমরা বাসের জন্য অপেক্ষা করছিলাম, কিন্তু বাস আসেনি। অবশেষে আমরা হেঁটে বাড়ি গেলাম। যাওয়ার পথে শিক্ষকের সাথে দেখা হলো। শিক্ষক জিজ্ঞেস করলেন, "আজ কলেজে কেন আসোনি?" আমি বললাম, "বৃষ্টির জন্য দেরি হয়ে গিয়েছিল।" তখন শিক্ষক বললেন, "কাল পরীক্ষা আছে, তোমাকে ভালোভাবে প্রস্তুত হতে হবে।" আমি চিন্তিত হয়ে পড়লাম কারণ আগের পরীক্ষার ফল ভালো হয়নি। কিন্তু বন্ধু বলল, এইবার ফল ভালো হবে। আমি আশা করি তাই হবে।
```

### Result

```text
Bengali Fluency:          Very Good
Naturalness:              Very Good
Information Preservation: Very Good
Long Gloss Handling:      Very Good
Grammar:                  Very Good
Overall:                  Strong
```

The original prompt caused the model to summarize the long gloss.
The optimized prompt significantly improved **information preservation and long-sequence Bengali generation**.

---

# 7. Inference Configuration

### KoboldCpp

```text
Context Size:
4096
```

### API

```json
{
  "max_context_length": 4096
}
```

Do not request `32768` when KoboldCpp is running with a `4096` context.

Observed long-test performance:

```text
Prompt processing: ~38 tok/s
Generation:        ~6.2 tok/s
RAM:                ~10 GB
```

---

# Final Selection

```text
Reference Model:
gemma-4-12b-it-Q4_0.gguf

Deployment Model:
gemma-4-E4B-it-Q4_K_M.gguf
```

**Final deployment model:** `gemma-4-E4B-it-Q4_K_M.gguf`

**Reason:** Strong Bengali NLG, good long-gloss handling with the optimized prompt, faster CPU inference, and significantly lower RAM usage, making it the most practical model for the WBSL Bridge system.
