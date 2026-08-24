# WBSL Bridge — Bengali NLG Model Testing

## 1. Objective

Test local LLMs for the **Bengali NLG stage** of WBSL Bridge.

The model receives WBSL gloss with:

* semantic markers
* negation
* question boundaries
* emotion
* temporal information
* multiple events
* reported speech
* conditional structures

The output must be **natural West Bengal Bengali while preserving the complete semantic meaning**.

---

# 2. Model Tests

| Model                              | Result                       | Main Observation                                    |
| ---------------------------------- | ---------------------------- | --------------------------------------------------- |
| `gemma-4-12b-it-Q4_0.gguf`         | **Best Quality / Reference** | Best Bengali and semantic consistency; higher RAM   |
| `gemma-4-E4B-it-Q4_K_M.gguf`       | **Selected for Deployment**  | Very good Bengali, good speed and memory efficiency |
| `gpt-oss-20b-Q4_K_M.gguf`          | Failed                       | Poor Bengali quality                                |
| `Qwen3.6-35B-A3B-UD-IQ2_M.gguf`    | Failed                       | Poor Bengali for this task                          |
| `Qwen3.5-9B-UD-IQ3_XXS.gguf`       | Failed                       | Poor Bengali quality                                |
| `gemma-4-26B-A4B-it-UD-IQ2_M.gguf` | Failed                       | Memory limit exceeded                               |

## Reference Model

```text
gemma-4-12b-it-Q4_0.gguf
```

Observed:

```text
~97% manual accuracy
~13 GB RAM with Brave + KoboldCpp
```

Best overall quality and semantic interpretation.

## Selected Deployment Model

```text
gemma-4-E4B-it-Q4_K_M.gguf
```

Reasons:

* Strong Bengali generation
* Natural West Bengal Bengali
* Good question handling
* Good negation handling
* Good long-gloss performance
* Lower memory usage
* Faster CPU inference
* Practical for local deployment

---

# 3. Final NLG Prompt

```text
You are the Bengali NLG module of a WBSL communication system.

Convert WBSL gloss into natural West Bengal Bengali.

FORMAT:
WORD[emotion]
WORD[negation][emotion]
WORD[?][emotion]

[?] appears ONLY on the last word of a complete direct question.
[negation] marks only the semantic unit being negated.
Emotion: happy, sad, angry, neutral, surprise, fear, disgust.

CORE RULE:
Preserve COMPLETE meaning, event order, subjects, objects, tense, time,
place, cause/effect, negation, ability, permission, obligation, condition,
uncertainty, emotion and speaker.

Do not summarize, omit, invent or change meaning.
Natural Bengali word order is allowed.
Semantic accuracy is more important than fluency or brevity.

QUESTION:
[?] marks ONE direct-question boundary only.
If [?] is present, output a direct Bengali question.
Do not convert a [?] question into "কি না" unless it is introduced by WHETHER.

WHAT, WHY, HOW, WHETHER, IF and ASK do not create extra direct questions.

WHETHER introduces an embedded question and must remain embedded:
"কি না", "হয় কি না", "পারবে কি না", etc.

A later WHETHER must not turn an earlier statement or IF/THEN clause
into a question.

NEGATION:
Use negation only when marked.
Keep it local to the marked semantic unit.
Never turn a specific negated action into a general negative state.
Do not create double negation.
Standalone NO/NOT may be a separate answer.

EVENTS:
Treat the gloss as ordered semantic events.
Preserve separate actions, subjects, speakers and speech events.
Do not merge events when meaning changes.
Do not invent or duplicate ASK, SAY, TELL or EXPLAIN events.
The explicit subject controls the speech event.

SCOPE:
Preserve IF/THEN/OTHERWISE as conditions.
Preserve WHETHER ... OR NOT as one uncertainty unit.
Preserve BEFORE, AFTER, UNTIL and THEN temporal scope.
Do not let later words change earlier tense, polarity, speaker,
question status or meaning.
Past time markers keep related events in the past unless a new time is given.

NATURAL BENGALI:
Use correct Bengali tense, pronouns, honorifics, case markers and postpositions.
Prefer natural West Bengal Bengali without changing the original meaning.

NO HALLUCINATION:
Do not add names, places, objects, causes, time, relationships,
symptoms or actions not present in the gloss.

Before answering, internally verify:
event preservation, subject/object, negation scope, question scope,
WHETHER scope, IF/THEN scope, speaker, tense, temporal relations,
and absence of invented or omitted information.

Output ONLY the final natural West Bengal Bengali text.
```

---

# 4. Small Test

### Input

```text
YOU[neutral] +
TOMORROW[neutral] +
SCHOOL[neutral] +
GO[negation][?][neutral]
```

### Expected Output

```text
তুমি কি আগামীকাল স্কুলে যাবে না?
```

Tests:

```text
Question scope
+
Negation
+
Natural Bengali grammar
```

---

# 5. Long Semantic Stress Test

This is the main benchmark for future model and prompt testing.

### Test Configuration

```text
max_context_length: 32768
max_length: 1536
temperature: 0.75
top_p: 0.92
top_k: 100
rep_pen: 1.05
rep_pen_range: 360
rep_pen_slope: 0.7
reasoning_effort: minimal
```

### Input

```text
THREE-DAY-AGO[neutral] +
MORNING[neutral] +
I[neutral] +
BANK[neutral] +
GO[neutral] +
BECAUSE[neutral] +
NEW[neutral] +
ACCOUNT[neutral] +
OPEN[neutral] +
MUST[neutral] +
I[neutral] +
DOCUMENT[neutral] +
BRING[neutral] +
THEN[neutral] +
COUNTER[neutral] +
WAIT[neutral] +
WHILE[neutral] +
MY[neutral] +
PHONE[neutral] +
BANK_APP[neutral] +
OPEN[neutral] +
SUDDENLY[neutral] +
I[neutral] +
TRANSACTION[neutral] +
SEE[neutral] +
I[neutral] +
NOT[negation][neutral] +
MAKE[negation][neutral] +
THIS[neutral] +
PAYMENT[neutral] +
I[neutral] +
BECOME[neutral] +
WORRIED[concern] +
SO[neutral] +
I[neutral] +
CUSTOMER_CARE[neutral] +
CALL[neutral] +
OFFICER[neutral] +
ASK[neutral] +
WHAT[neutral] +
HAPPEN[?][neutral] +
I[neutral] +
EXPLAIN[neutral] +
THAT[neutral] +
UNKNOWN[neutral] +
TRANSACTION[neutral] +
ACCOUNT[neutral] +
SHOW[neutral] +
THEN[neutral] +
OFFICER[neutral] +
ASK[neutral] +
WHETHER[neutral] +
I[neutral] +
RECENTLY[neutral] +
SHARE[neutral] +
OTP[neutral] +
ANYONE[neutral] +
WITH[neutral] +
I[neutral] +
SAY[neutral] +
NO[negation][neutral] +
I[neutral] +
SHARE[negation][neutral] +
OTP[negation][neutral] +
WITH[neutral] +
ANYONE[neutral] +
OFFICER[neutral] +
SAY[neutral] +
DO-NOT[negation][neutral] +
WORRY[negation][neutral] +
BUT[neutral] +
THEY[neutral] +
MUST[neutral] +
BLOCK[neutral] +
CARD[neutral] +
FIRST[neutral] +
FOR[neutral] +
SAFETY[neutral] +
I[neutral] +
ASK[neutral] +
WHETHER[neutral] +
I[neutral] +
CAN[neutral] +
USE[neutral] +
ONLINE_BANKING[neutral] +
TODAY[neutral] +
OFFICER[neutral] +
SAY[neutral] +
NOT-NOW[negation][neutral] +
BECAUSE[neutral] +
ACCOUNT[neutral] +
UNDER[neutral] +
SECURITY[neutral] +
CHECK[neutral] +
I[neutral] +
ASK[neutral] +
HOW_LONG[neutral] +
THIS[neutral] +
TAKE[?][neutral] +
OFFICER[neutral] +
SAY[neutral] +
MAYBE[neutral] +
TWENTY_FOUR_HOUR[neutral] +
BUT[neutral] +
FINAL[neutral] +
TIME[neutral] +
DEPEND[neutral] +
ON[neutral] +
VERIFICATION[neutral] +
I[neutral] +
ASK[neutral] +
WHETHER[neutral] +
UNKNOWN[neutral] +
PAYMENT[neutral] +
MONEY[neutral] +
CAN[neutral] +
RETURN[neutral] +
OFFICER[neutral] +
SAY[neutral] +
IF[neutral] +
TRANSACTION[neutral] +
CONFIRM[neutral] +
FRAUD[neutral] +
BANK[neutral] +
WILL[neutral] +
REFUND[neutral] +
MONEY[neutral] +
OTHERWISE[neutral] +
THEY[neutral] +
MAY[neutral] +
ASK[neutral] +
MERCHANT[neutral] +
FOR[neutral] +
MORE[neutral] +
INFORMATION[neutral] +
I[neutral] +
FEEL[neutral] +
RELIEF[happy] +
BUT[neutral] +
STILL[neutral] +
UNCERTAIN[concern] +
BECAUSE[neutral] +
REFUND[neutral] +
NOT[negation][neutral] +
GUARANTEED[negation][neutral] +
YET[neutral] +
THEN[neutral] +
OFFICER[neutral] +
GIVE[neutral] +
ME[neutral] +
A[neutral] +
FORM[neutral] +
AND[neutral] +
SAY[neutral] +
I[neutral] +
MUST[neutral] +
FILL[neutral] +
IT[neutral] +
BEFORE[neutral] +
BANK[neutral] +
CAN[neutral] +
START[neutral] +
INVESTIGATION[neutral] +
I[neutral] +
FILL[neutral] +
FORM[neutral] +
BUT[neutral] +
ONE[neutral] +
DOCUMENT[neutral] +
NOT[negation][neutral] +
HAVE[negation][neutral] +
WITH[neutral] +
ME[neutral] +
SO[neutral] +
I[neutral] +
CANNOT[negation][neutral] +
SUBMIT[negation][neutral] +
COMPLETE[neutral] +
APPLICATION[neutral] +
TODAY[neutral] +
OFFICER[neutral] +
SAY[neutral] +
IF[neutral] +
I[neutral] +
BRING[neutral] +
DOCUMENT[neutral] +
TOMORROW[neutral] +
BANK[neutral] +
CAN[neutral] +
COMPLETE[neutral] +
VERIFICATION[neutral] +
THEN[neutral] +
I[neutral] +
ASK[neutral] +
WHETHER[neutral] +
MY[neutral] +
CARD[neutral] +
CAN[neutral] +
BE[neutral] +
UNBLOCK[neutral] +
TODAY[?][neutral] +
OFFICER[neutral] +
SAY[neutral] +
NO[negation][neutral] +
IT[neutral] +
CAN[neutral] +
ONLY[neutral] +
BE[neutral] +
UNBLOCK[neutral] +
AFTER[neutral] +
SECURITY[neutral] +
CHECK[neutral] +
COMPLETE[neutral] +
I[neutral] +
THANK[neutral] +
THEM[neutral] +
AND[neutral] +
LEAVE[neutral] +
BANK[neutral] +
THEN[neutral] +
ON[neutral] +
WAY[neutral] +
I[neutral] +
CALL[neutral] +
MY[neutral] +
BROTHER[neutral] +
AND[neutral] +
TELL[neutral] +
HIM[neutral] +
EVERYTHING[neutral] +
HE[neutral] +
SAY[neutral] +
IF[neutral] +
BANK[neutral] +
NEED[neutral] +
EXTRA[neutral] +
DOCUMENT[neutral] +
HE[neutral] +
CAN[neutral] +
BRING[neutral] +
IT[neutral] +
FOR[neutral] +
ME[neutral] +
BUT[neutral] +
I[neutral] +
SAY[neutral] +
FIRST[neutral] +
I[neutral] +
MUST[neutral] +
CHECK[neutral] +
WHETHER[neutral] +
THE[neutral] +
TRANSACTION[neutral] +
REALLY[neutral] +
FRAUD[neutral] +
OR[neutral] +
NOT[negation][neutral] +
BEFORE[neutral] +
MAKING[neutral] +
ANY[neutral] +
DECISION[neutral] +
THAT[neutral] +
EVENING[neutral] +
BANK[neutral] +
SEND[neutral] +
ME[neutral] +
MESSAGE[neutral] +
SAY[neutral] +
THE[neutral] +
TRANSACTION[neutral] +
IS[neutral] +
UNDER[neutral] +
REVIEW[neutral] +
I[neutral] +
DO-NOT[negation][neutral] +
NEED[negation][neutral] +
TO[neutral] +
VISIT[neutral] +
BANK[neutral] +
AGAIN[neutral] +
UNTIL[neutral] +
THEY[neutral] +
CALL[neutral] +
ME[neutral] +
I[concern] +
STILL[neutral] +
FEEL[neutral] +
UNCERTAIN[concern] +
BECAUSE[neutral] +
I[neutral] +
DO-NOT[negation][neutral] +
KNOW[negation][neutral] +
WHETHER[neutral] +
MY[neutral] +
MONEY[neutral] +
WILL[neutral] +
RETURN[neutral] +
BUT[happy] +
I[happy] +
HOPE[happy] +
THEY[happy] +
WILL[happy]
```

### Latest Observed Performance

```text
Prompt processing: ~37.84 tok/s
Generation:        ~5.76 tok/s
Total time:        ~131.98 sec
Generated tokens:  ~450
```

### Latest Observed Output Quality

```text
Bengali fluency:        Good
Question handling:      Good / imperfect
Negation handling:      Moderate
Speaker tracking:       Moderate
IF/THEN preservation:   Moderate
WHETHER scope:          Moderate
Long-range semantics:   Moderate
No hallucination:       Fairly good
Overall:                Good, but semantic scope still needs improvement
```

### Main Remaining Weakness

```text
Semantic scope tracking
        ↓
Negation scope
Speaker binding
WHETHER scope
IF / THEN scope
Event segmentation
Tense consistency
```
The current priority for further improvement is **semantic scope accuracy**, not basic Bengali fluency or generation speed.
