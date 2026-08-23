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
| `gemma-4-12b-it-Q4_0.gguf` | Best Quality | Higher RAM |
| `gemma-4-E4B-it-Q4_K_M.gguf` | Selected | Slightly lower semantic consistency |
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
ViT-ONNX Emotion
      ↓
Inline Format Builder
      ↓
Gemma 4 E4B
      ↓
Natural Bengali Text
```

The LLM is used only for the **Bengali NLG stage**.

---

## 4. Input Format

Each signed word is encoded as:

```text
GLOSS(QUESTION){NEGATION}[EMOTION]
```

| Bracket | Meaning | Values |
|---|---|---|
| `( )` | Question marker | YES or empty |
| `{ }` | Negation marker | YES or empty |
| `[ ]` | Emotion | happy, sad, angry, neutral, surprise, fear, disgust |

Words are joined by `+` in signing order.

### Future Extensibility

| Bracket | Meaning | Status |
|---|---|---|
| `( )` | Question marker | Active |
| `{ }` | Negation marker | Active |
| `[ ]` | Emotion | Active |
| `< >` | Mouthing (silent Bangla word) | Future |
| `\| \|` | Body posture / role shift | Future |

---

## 5. Final NLG Prompt

```text
You are the Bengali NLG module of a WBSL communication system.
Convert the WBSL gloss into natural West Bengal Bengali.

FORMAT GUIDE:

Each word is followed by three markers:
( ) = question marker. If YES inside, this word is part of a question.
{ } = negation marker. If YES inside, this word is negated.
[ ] = emotion. The feeling of the signer while signing this word.

Words are joined by + sign. Read left to right in signing order.

Possible values inside [ ]:
happy, sad, angry, neutral, surprise, fear, disgust

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
I(){}[neutral] + COLLEGE(){}[neutral] + GO(){}[neutral] + FRIEND(){}[neutral] + MEET(){}[neutral]

means:
আমি কলেজে গিয়েছিলাম। সেখানে বন্ধুর সঙ্গে দেখা হয়েছিল।

Do NOT incorrectly change it to:
আমি বন্ধুর সঙ্গে কলেজে গিয়েছিলাম।

Example:
THEY(){}[neutral] + ASK(){}[neutral] + CHEST_PAIN(YES){}[neutral] + SHE(){}[neutral] + SAY(){}[neutral] + NO(){YES}[neutral]

must preserve BOTH events:
তাঁরা জিজ্ঞাসা করলেন, বুকে ব্যথা আছে কি না।
তিনি বললেন, না।

Do NOT remove the second event.

IMPORTANT NEGATION RULE:

NOT, NO, CANNOT, DO-NOT and NOT-NOW must never be lost.
Any word with {YES} must produce negation in Bengali.

IMPORTANT CONDITION RULE:

IF + A + THEN + B + OTHERWISE + C
must remain a conditional structure in Bengali.

IMPORTANT QUESTION RULE:

Any word with (YES) is part of a question.
The Bengali output must be a question for those words.

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

Output ONLY the Bengali text.

Now translate:
```

---

## 6. Test Suite

### Test 1 — Question + Negation

```text
YOU(YES){}[neutral] + TOMORROW(YES){}[neutral] + SCHOOL(YES){}[neutral] + GO(YES){YES}[neutral] + NOT(YES){YES}[neutral]
```

Expected:

```text
তুমি কি আগামীকাল স্কুলে যাবে না?
```

---

### Test 2 — Past Question + Negation

```text
YOU(YES){}[surprise] + YESTERDAY(YES){}[surprise] + FRIEND(YES){}[surprise] + MEET(YES){}[surprise] + BUT(YES){}[surprise] + NOT(YES){YES}[surprise] + TALK(YES){YES}[surprise] + WHY(YES){}[surprise]
```

Expected:

```text
তুমি গতকাল বন্ধুর সাথে দেখা করলে কিন্তু কথা বললে না কেন?
```

---

### Test 3 — Natural Grammar

```text
YESTERDAY(){}[neutral] + I(){}[neutral] + RAIN(){}[neutral] + BECAUSE(){}[neutral] + SCHOOL(){YES}[neutral] + GO(){YES}[neutral] + NOT(){YES}[neutral]
```

Expected:

```text
গতকাল বৃষ্টির কারণে আমি স্কুলে যাইনি।
```

---

### Test 4 — Honorific Question

```text
YOU(YES){}[neutral] + TEACHER(YES){}[neutral] + TODAY(YES){}[neutral] + SCHOOL(YES){}[neutral] + COME(YES){}[neutral]
```

Expected:

```text
আপনি কি আজ স্কুলে এসেছেন?
```

---

### Test 5 — No Hallucination

```text
I(){}[happy] + BOOK(){}[happy] + READ(){}[happy]
```

Expected:

```text
আমি বই পড়ি।
```

---

### Test 6 — Negative Ability

```text
YOU(YES){}[neutral] + THIS(YES){}[neutral] + PROBLEM(YES){}[neutral] + SOLVE(YES){YES}[neutral] + NOT(YES){YES}[neutral] + CAN(YES){YES}[neutral]
```

Expected:

```text
তুমি কি এই সমস্যাটি সমাধান করতে পারবে না?
```

---

### Test 7 — Emotion

```text
I(){}[sad] + LOSE(){}[sad] + BOOK(){}[sad]
```

Expected:

```text
আমি বইটি হারিয়েছি।
```

---

### Test 8 — Full Stress Test

```text
YOU(YES){}[angry] + YESTERDAY(YES){}[angry] + EXAM(YES){}[angry] + HAVE(YES){}[angry] + BUT(YES){}[angry] + PREPARE(YES){YES}[angry] + NOT(YES){YES}[angry] + CAN(YES){YES}[angry] + SO(YES){}[angry] + RESULT(YES){YES}[angry] + GOOD(YES){YES}[angry] + NOT(YES){YES}[angry] + WHY(YES){}[angry]
```

Expected:

```text
তোমার গতকাল পরীক্ষা ছিল, কিন্তু তুমি প্রস্তুতি নিতে পারোনি, তাই ফল ভালো হবে না—কেন?
```

---

## 7. Large Bengali Power Test

This test evaluates the model's ability to handle a **long WBSL gloss sequence** with multiple events, conditions, speaker changes, and emotion shifts.

### Input

```text
LAST_WEEK(){}[neutral] + I(){}[neutral] + COLLEGE(){}[neutral] + GO(){}[neutral] + FRIEND(){}[neutral] + MEET(){}[neutral] + THEN(){}[neutral] + WE(){}[neutral] + TOGETHER(){}[neutral] + LIBRARY(){}[neutral] + GO(){}[neutral] + MANY(){}[neutral] + BOOK(){}[neutral] + SEE(){}[neutral] + BUT(){}[neutral] + I(){YES}[neutral] + BOOK(){YES}[neutral] + BUY(){YES}[neutral] + NOT(){YES}[neutral] + BECAUSE(){}[neutral] + MONEY(){YES}[neutral] + HAVE(){YES}[neutral] + NOT(){YES}[neutral] + AFTER(){}[neutral] + LIBRARY(){}[neutral] + EXIT(){}[neutral] + HEAVY(){}[neutral] + RAIN(){}[neutral] + START(){}[neutral] + SO(){}[neutral] + WE(){}[neutral] + BUS(){}[neutral] + WAIT(){}[neutral] + BUT(){}[neutral] + BUS(){YES}[neutral] + COME(){YES}[neutral] + NOT(){YES}[neutral] + FINALLY(){}[neutral] + WE(){}[neutral] + WALK(){}[neutral] + HOME(){}[neutral] + GO(){}[neutral] + ON_THE_WAY(){}[neutral] + TEACHER(){}[neutral] + MEET(){}[neutral] + TEACHER(){}[neutral] + ASK(){}[neutral] + WHY(YES){}[neutral] + TODAY(YES){}[neutral] + COLLEGE(YES){}[neutral] + COME(YES){YES}[neutral] + NOT(YES){YES}[neutral] + I(){}[neutral] + EXPLAIN(){}[neutral] + RAIN(){}[neutral] + BECAUSE(){}[neutral] + LATE(){}[neutral] + ARRIVE(){}[neutral] + THEN(){}[neutral] + TEACHER(){}[neutral] + SAY(){}[neutral] + TOMORROW(){}[neutral] + EXAM(){}[neutral] + HAVE(){}[neutral] + PREPARE(){}[neutral] + WELL(){}[neutral] + MUST(){}[neutral] + I(){}[angry] + WORRIED(){}[angry] + BECAUSE(){}[angry] + PREVIOUS(){}[angry] + EXAM(){}[angry] + RESULT(){YES}[angry] + GOOD(){YES}[angry] + NOT(){YES}[angry] + BUT(){}[happy] + FRIEND(){}[happy] + SAY(){}[happy] + THIS_TIME(){}[happy] + RESULT(){}[happy] + GOOD(){}[happy] + WILL(){}[happy] + I(){}[happy] + HOPE(){}[happy] + SO(){}[happy]
```

### Observed E4B Output

```text
গত সপ্তাহে আমি আমার বন্ধুর সাথে কলেজে গিয়েছিলাম। তারপর আমরা একসাথে লাইব্রেরিতে গিয়ে অনেক বই দেখেছি। কিন্তু আমি বই কিনিনি কারণ আমার কাছে টাকা ছিল না। লাইব্রেরি থেকে বের হওয়ার পরে ভারী বৃষ্টি শুরু হয়েছিল, তাই আমরা বাসের জন্য অপেক্ষা করছিলাম, কিন্তু বাস আসেনি। অবশেষে আমরা হেঁটে বাড়ি গেলাম। যাওয়ার পথে শিক্ষকের সাথে দেখা হলো। শিক্ষক জিজ্ঞেস করলেন, "আজ কলেজে কেন আসোনি?" আমি বললাম, "বৃষ্টির জন্য দেরি হয়ে গিয়েছিল।" তখন শিক্ষক বললেন, "কাল পরীক্ষা আছে, তোমাকে ভালোভাবে প্রস্তুত হতে হবে।" আমি চিন্তিত হয়ে পড়লাম কারণ আগের পরীক্ষার ফল ভালো হয়নি। কিন্তু বন্ধু বলল, এইবার ফল ভালো হবে। আমি আশা করি তাই হবে।
```

### Result

```text
Bengali Fluency:          Very Good
Naturalness:              Very Good
Information Preservation: Very Good
Long Gloss Handling:      Very Good
Grammar:                  Very Good
Emotion Shift Handling:   Very Good (neutral → angry → happy)
Overall:                  Strong
```

---

## 8. Inference Configuration

### KoboldCpp

```text
Context Size: 4096
```

### API

```json
{
  "max_context_length": 4096
}
```

Do not request `32768` when KoboldCpp is running with a `4096` context.

### Observed Performance

```text
Prompt processing: ~38 tok/s
Generation:        ~6.2 tok/s
RAM:               ~10 GB
```

---

## 9. Runtime Format Builder Logic

```text
For each gloss word from LSTM:
    question = "YES" if nmm_flags["question"] else ""
    negation = "YES" if nmm_flags["negation"] else ""
    emotion  = vit_onnx output

    token = f"{word}({question}){{{negation}}}[{emotion}]"

final_input = " + ".join(all_tokens)
```

---

## 10. Final Selection

```text
Reference Model:   gemma-4-12b-it-Q4_0.gguf
Deployment Model:  gemma-4-E4B-it-Q4_K_M.gguf
```

**Reason:** Strong Bengali NLG, good long-gloss handling with the optimized prompt, faster CPU inference, and significantly lower RAM usage, making it the most practical model for the WBSL Bridge system.
