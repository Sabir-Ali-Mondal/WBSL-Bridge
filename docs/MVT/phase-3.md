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
WORD
WORD[emotion]
WORD[negation]
WORD[negation][emotion]
WORD[?]
WORD[emotion][?]
WORD[negation][?]
WORD[negation][emotion][?]

If no emotion marker is present, treat the word as neutral.

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

SYMBOL GUIDE:
Use standard Bengali punctuation naturally.
"-" = hyphen.
"?" = direct question end.
"," = short pause or clause separation.
";" = strong separation between closely related clauses when useful.
"!" = strong emotion only when clearly supported by the gloss.
Preserve numbers exactly when they carry meaning.
Bengali digits may be used naturally.
Example: 1 → ১, 56 → ৫৬.

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
YOU +
TOMORROW +
SCHOOL +
GO[negation][?]
```

### Expected Output

```text
তুমি কি আগামীকাল স্কুলে যাবে না?
```

### Tests

```text
Question scope
+
Negation
+
Subject preservation
+
Natural Bengali grammar
```

---

# 5. Long Semantic Stress Test

This is the main benchmark for future model and prompt testing.

## Test Configuration

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

## Input

```text
TWO-DAY-AGO +
MORNING +
EIGHT_THIRTY-AM +
I +
COLLEGE +
GO +
BECAUSE +
SCHOLARSHIP +
APPLICATION +
SUBMIT +
MUST +
BEFORE +
FIVE +
PM +
THEN +
ADMINISTRATION +
OFFICE +
GO +
WAIT +
OUTSIDE +
MY +
FRIEND +
RITA +
ALREADY +
WAIT +
THERE +
SHE[happy] +
SAY +
IF +
YOU +
BRING +
ALL +
DOCUMENT +
TODAY +
STAFF +
MAY +
ACCEPT +
APPLICATION +
WITHOUT +
DELAY +
I +
SAY +
I +
HAVE +
ALL +
DOCUMENT +
EXCEPT +
INCOME +
CERTIFICATE +
I[concern] +
BECOME +
WORRIED[concern] +
BECAUSE +
TOMORROW +
SUBMISSION +
DEADLINE +
END +
I +
ASK +
STAFF +
WHETHER +
I +
CAN +
SUBMIT +
APPLICATION +
WITHOUT +
INCOME +
CERTIFICATE +
TODAY[?] +
STAFF +
SAY +
NO[negation] +
APPLICATION +
CANNOT[negation] +
SUBMIT[negation] +
WITHOUT +
CERTIFICATE +
FIRST +
I +
ASK +
WHETHER +
ONLINE +
PORTAL +
MAY +
ACCEPT +
MISSING +
DOCUMENT +
LATER +
STAFF +
SAY +
YES +
BUT +
PHYSICAL +
APPLICATION +
MUST +
BE +
SUBMIT +
FIRST +
I +
ASK +
WHAT +
HAPPEN[?] +
STAFF +
EXPLAIN +
THAT +
MY +
ATTENDANCE +
RECORD +
SHOW +
SIXTY +
PERCENT +
BUT +
I[surprise] +
KNOW +
MY +
ATTENDANCE +
WAS +
EIGHTY_FIVE +
PERCENT +
SO +
I[angry] +
SAY[angry] +
THIS +
RECORD +
SEEM +
WRONG +
AND +
I[angry] +
DO-NOT[negation] +
AGREE[negation] +
WITH +
IT +
STAFF +
SAY +
I +
SHOULD +
SPEAK +
TO +
DEPARTMENT +
CLERK +
FIRST +
I +
GO +
TO +
CLERK +
AND +
ASK +
WHETHER +
THE +
ATTENDANCE +
RECORD +
CAN +
BE +
CORRECTED +
TODAY[?] +
CLERK +
SAY +
IF +
YOU +
SHOW +
CLASS +
ATTENDANCE +
PROOF +
WE +
CAN +
CHECK +
THE +
RECORD +
OTHERWISE +
YOU +
MAY +
NEED +
TO +
WAIT +
UNTIL +
TOMORROW +
I +
ASK +
WHETHER +
I +
CAN +
TAKE +
PHOTO +
OF +
THE +
SCREEN +
AS +
PROOF +
TODAY[?] +
CLERK +
SAY +
YES +
BUT +
DO-NOT[negation] +
SHARE[negation] +
THE +
PHOTO +
PUBLICLY +
I +
SAY +
I +
MUST +
KEEP +
IT +
PRIVATE +
THEN +
MY +
PHONE +
RING +
AT +
TEN_THIRTY-FIVE +
AM +
I +
SEE +
A +
MESSAGE +
FROM +
MY +
DEPARTMENT +
THEY +
SAY +
THE +
DEADLINE +
EXTEND +
TO +
NEXT-WEEK +
I[happy] +
FEEL +
RELIEF[happy] +
BUT +
RITA[sad] +
BECAUSE +
HER +
APPLICATION +
ALREADY +
REJECT +
I +
ASK +
WHY +
HER +
APPLICATION +
REJECT +
HAPPEN[?] +
SHE +
SAY +
THEY +
FIND +
ONE +
MISSING +
SIGNATURE +
AND +
SHE[disgust] +
SAY +
THEY +
SPEAK +
RUDELY +
SHE +
DO-NOT[negation] +
WANT[negation] +
TO +
ARGUE +
I +
TELL +
HER +
SHE +
SHOULD +
KEEP +
A +
COPY +
OF +
EVERY +
DOCUMENT +
BECAUSE +
IF +
SOMETHING +
GO +
WRONG +
LATER +
IT +
MAY +
HELP +
I +
ASK +
HER +
WHETHER +
SHE +
CAN +
REOPEN +
THE +
APPLICATION +
TODAY[?] +
SHE +
SAY +
NO[negation] +
THEY +
WILL +
ONLY +
REVIEW +
IT +
AFTER +
NEW +
DOCUMENT +
ARRIVE +
THEN +
I +
CALL +
MY +
MOTHER +
AND +
TELL +
HER +
EVERYTHING +
SHE[happy] +
SAY +
IF +
I +
NEED +
HELP +
SHE +
CAN +
BRING +
THE +
MISSING +
CERTIFICATE +
TOMORROW +
I +
SAY +
THANK +
YOU +
BUT +
FIRST +
I +
MUST +
CHECK +
WHETHER +
THE +
COLLEGE +
HAS +
ALREADY +
UPDATED +
MY +
RECORD +
OR +
NOT[negation] +
BEFORE +
I +
MAKE +
ANY +
FINAL +
DECISION +
THAT +
EVENING +
COLLEGE +
SEND +
ME +
AN +
EMAIL +
SAY +
THE +
RECORD +
UPDATE +
IS +
COMPLETE +
MY[happy] +
SCHOLARSHIP +
APPLICATION +
CAN +
NOW +
CONTINUE +
I[happy] +
FEEL +
HOPEFUL[happy] +
ONE-HUNDRED +
PERCENT +
CONFIDENT[happy]
```

## Criteria Covered

```text
1. Semantic meaning
2. Event order
3. Subject/object preservation
4. Past, present and future tense
5. Time and temporal order
6. 8:30 AM
7. 10:35 AM
8. 5 PM
9. Two-day-ago
10. Tomorrow
11. Next-week
12. Later
13. Numbers
14. 60 percent
15. 85 percent
16. 100 percent
17. Direct question boundaries
18. Multiple direct questions
19. Embedded WHETHER questions
20. WHETHER ... OR NOT
21. Local negation
22. Standalone NO
23. Specific negated action
24. CAN
25. CANNOT
26. MAY
27. MUST
28. SHOULD
29. Permission
30. Obligation
31. IF / THEN
32. OTHERWISE
33. BEFORE
34. AFTER
35. UNTIL
36. THEN
37. Cause/effect
38. Reported speech
39. Multiple speakers
40. Speaker binding
41. Event segmentation
42. Pronoun consistency
43. Honorific/register
44. Emotion:
    neutral / concern / surprise / angry / happy / sad / disgust
45. Natural Bengali grammar
46. Bengali punctuation
47. Numbers and percentage preservation
48. Hyphenated temporal concepts
49. No hallucination
50. Long-range semantic consistency
```

## Latest Observed Performance

```text
Prompt processing: ~37.84 tok/s
Generation:        ~5.76 tok/s
Total time:        ~131.98 sec
Generated tokens:  ~450
```

## Latest Observed Output Quality

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

## Main Remaining Weakness

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

---

# 6. Speed Summary

Latest selected model:

```text
gemma-4-E4B-it-Q4_K_M.gguf
```

Latest long-test result:

```text
Prompt processing: ~37.84 tok/s
Generation:        ~5.76 tok/s
Total:             ~131.98 sec
```

Small-test benchmark should be used separately because long prompts dominate processing time.

---

# 7. Final Selection

## Reference Model

```text
gemma-4-12b-it-Q4_0.gguf
```

Best-quality reference model.

## Deployment Model

```text
gemma-4-E4B-it-Q4_K_M.gguf
```

**Selected for WBSL Bridge Bengali NLG.**

### Selection Reason

```text
Strong Bengali generation
+
Good semantic understanding
+
Practical question handling
+
Reasonable negation handling
+
Good long-gloss performance
+
Lower RAM usage
+
Faster CPU inference
```

The deployment model is currently the most practical local choice, while future improvement should focus mainly on **semantic scope preservation**.
