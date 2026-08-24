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

Convert the WBSL gloss into natural West Bengal Bengali.

INPUT FORMAT:

WORD[emotion]
WORD[negation][emotion]
WORD[?][emotion]

[?] appears ONLY on the LAST word of a complete question clause.
It means the whole clause ending there is a question.

[negation] marks the semantic unit whose meaning is negated.
Do not invent negation.
Do not spread negation to unrelated words.

Emotion may be:
happy, sad, angry, neutral, surprise, fear, disgust.

MAIN GOAL:

Preserve the COMPLETE meaning of the gloss in natural West Bengal Bengali.

RULES:

- Preserve every meaningful event, person, action, object, time, place,
  reason, result, relationship, tense, negation, ability, permission,
  obligation, condition, uncertainty and emotion.
- Do not summarize.
- Do not omit events.
- Do not invent information.
- Do not translate word by word.
- You may reorder words for natural Bengali grammar.
- Preserve who does each action.
- Preserve event order and cause/effect.
- Preserve semantic relationships between events.
- Keep separate events separate when needed.
- Use multiple Bengali sentences when necessary.
- Do not merge distinct events only to make the output shorter.
- Preserve CAN, CANNOT, MAY, MUST, SHOULD and NOT-NOW.
- Preserve IF / THEN / OTHERWISE.
- Preserve questions as questions.
- Preserve indirect and embedded questions.
- Preserve reported speech and speaker changes.
- Preserve WHETHER, NOT-SURE and HOPE.
- Reflect NMM and emotion naturally without adding facts.
- Use natural West Bengal Bengali.
- Semantic fidelity is more important than fluency or brevity.
- Output ONLY Bengali text.

QUESTION SCOPE:

[?] is ONE question boundary, not one question per word.

Only the clause ending at [?] is explicitly marked as a direct question.

Do NOT create additional direct questions from words such as:
WHAT, WHY, HOW, WHETHER, IF, ASK.

When WHETHER or a similar marker introduces an embedded question,
render it naturally using Bengali indirect-question grammar such as:
"কি না", "হয় কি না", "পারবে কি না", "আছে কি না".

Do not convert an earlier statement or conditional clause into a question
because of a later embedded question.

NEGATION:

Only use negation when the gloss provides it.

Do not make an unmarked word negative.

Treat [negation] as a local semantic marker.
Do not automatically negate following words.

Standalone NO / NOT may be a separate response.

Do not create double negation.

EVENT SEGMENTATION:

Preserve separate events even when the gloss is continuous.

Keep changes in subject, speaker, action, speech event, time or condition
semantically separate when merging would change the meaning.

CONDITION RULE:

Preserve the complete IF / THEN / OTHERWISE relationship.

Do not turn a conditional statement into a question unless its own clause
actually ends at [?].

REPORTED SPEECH:

Preserve speaker changes and reported speech.

Do not invent a speaker for ASK, SAY, TELL or EXPLAIN.

The explicit subject of the speech verb controls that speech event.

SEMANTIC SCOPE CONTROL:

Treat the gloss as ordered semantic events, not as a loose bag of words.

- Preserve each event, its subject, object, tense, polarity and speaker.
- A past time marker applies to the related past events unless the gloss
  explicitly introduces a new time.
- Never convert a specific negated action into a general negative state.
- Keep the negation attached to the exact marked action or semantic unit.
- ASK, SAY, TELL and EXPLAIN keep their explicit speaker.
- Do not invent or duplicate speech events.
- A change of speaker or speech verb normally begins a new speech event.
- WHETHER introduces an embedded question only.
- WHETHER must bind only to its following question content.
- WHETHER must not change an earlier statement or condition into a question.
- WHETHER ... OR NOT must remain one uncertainty unit.
- IF / THEN remains a condition and must not become a question unless that
  conditional clause itself ends at [?].
- BEFORE, AFTER, UNTIL and THEN must keep their original temporal scope.
- Do not let later words retroactively change the meaning, tense, polarity,
  speaker or question status of an earlier event.
- Natural Bengali wording is allowed only when the complete semantic structure
  remains unchanged.

NO HALLUCINATION:

Do not add names, places, objects, causes, time, relationships,
symptoms or actions not present in the gloss.

NATURAL BENGALI:

Use natural West Bengal Bengali sentence structure.

Use appropriate tense, honorifics, pronouns, case markers and postpositions.

Do not preserve awkward English word order when natural Bengali can express
the same meaning clearly.

Do not sacrifice meaning for fluency.

FINAL INTERNAL CHECK:

Before answering, verify:

1. Every event is preserved.
2. Every subject and object is preserved.
3. Every negation has correct scope.
4. Every [?] question boundary is preserved.
5. Embedded questions remain embedded questions.
6. IF / THEN / OTHERWISE structure is preserved.
7. Speaker changes are preserved.
8. Tense and temporal relations are preserved.
9. Separate events have not been incorrectly merged.
10. No new information has been added.
11. No event has been omitted.
12. The Bengali is natural and grammatically correct.

Do not output the check.

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

---

# 6. Speed Summary

Latest selected model:

```text
Model:
gemma-4-E4B-it-Q4_K_M.gguf
```

Latest stress test:

```text
Prompt processing: ~37.84 tok/s
Generation:        ~5.76 tok/s
Total:             ~131.98 sec
RAM:               ~10 GB
```

Previous long-test result:

```text
Generation: ~4.27 tok/s
Total:      ~249.68 sec
```

Current prompt/model setup therefore shows a significant practical speed improvement.

---

# 7. Final Selection

## Reference

```text
gemma-4-12b-it-Q4_0.gguf
```

Best quality reference model.

## Deployment

```text
gemma-4-E4B-it-Q4_K_M.gguf
```

**Selected model for WBSL Bridge Bengali NLG.**

### Reason

```text
Strong Bengali quality
+
Good semantic understanding
+
Good question handling
+
Good negation handling
+
Good long-gloss performance
+
Lower RAM usage
+
Faster CPU inference
```

The current priority for further improvement is **semantic scope accuracy**, not basic Bengali fluency or generation speed.
