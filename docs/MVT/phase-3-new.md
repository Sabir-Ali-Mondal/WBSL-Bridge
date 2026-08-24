# WBSL Bridge — Bengali NLG Model Testing

## 1. Models & Final Selection

| Model                              | Result                       | Main Issue                          |
| ---------------------------------- | ---------------------------- | ----------------------------------- |
| `gemma-4-12b-it-Q4_0.gguf`         | **Best Quality / Reference** | Higher RAM                          |
| `gemma-4-E4B-it-Q4_K_M.gguf`       | **Selected for Deployment**  | Slightly lower semantic consistency |
| `gpt-oss-20b-Q4_K_M.gguf`          | Failed                       | Poor Bengali                        |
| `Qwen3.6-35B-A3B-UD-IQ2_M.gguf`    | Failed                       | Poor Bengali                        |
| `Qwen3.5-9B-UD-IQ3_XXS.gguf`       | Failed                       | Poor Bengali                        |
| `gemma-4-26B-A4B-it-UD-IQ2_M.gguf` | Failed                       | Memory limit exceeded               |

### Reference Model

`gemma-4-12b-it-Q4_0.gguf`

* ~97% observed manual accuracy
* Best overall Bengali quality
* Good WBSL gloss interpretation
* Good question and negation handling
* Good NMM and emotion handling
* ~13 GB RAM with Brave + KoboldCpp

### Deployment Model

`gemma-4-E4B-it-Q4_K_M.gguf`

* Very good Bengali generation
* Natural West Bengal Bengali
* Good question and negation handling
* Good NMM and emotion handling
* Good long-gloss handling after prompt optimization
* Faster CPU inference
* ~10 GB RAM with Brave + KoboldCpp
* Better memory efficiency

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
```

The LLM is used only for the **Bengali NLG stage**.

---

## 3. Input Format

Each gloss word is encoded as:

```text
WORD[emotion]
WORD[negation][emotion]
WORD[?][emotion]
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

### Important Question Rule

Do not put `[?]` on every question word.

Wrong:

```text
WHY[?] TODAY[?] COLLEGE[?] COME[?]
```

Correct:

```text
WHY[neutral] TODAY[neutral] COLLEGE[neutral] COME[?][neutral]
```

This represents one question.

### Indirect / Embedded Question Rule

`WHETHER`, `IF`, `ASK`, `WONDER`, etc. may introduce an **embedded question**, but they do not automatically make the whole surrounding sentence a direct question.

Example:

```text
I[neutral] + ASK[neutral] + WHETHER[neutral] +
MY[neutral] + CARD[neutral] + CAN[neutral] +
UNBLOCK[neutral] + TODAY[?][neutral]
```

Natural Bengali:

```text
আমি জিজ্ঞাসা করলাম, আমার কার্ডটি আজ আনব্লক হতে পারবে কি না।
```

Do not incorrectly turn an earlier conditional clause into a question merely because `WHETHER` appears later.

Wrong:

```text
অফিসার বললেন, আমি কাল নথি নিয়ে এলে যাচাইকরণ সম্পূর্ণ করা যাবে কিনা?
```

Better:

```text
অফিসার বললেন, আমি কাল নথি নিয়ে এলে ব্যাংক যাচাইকরণ সম্পূর্ণ করতে পারবে।
তারপর আমি জিজ্ঞাসা করলাম, আমার কার্ডটি আজ আনব্লক হতে পারবে কি না।
```

### Negation Scope

Only the explicitly marked semantic unit is negated.

Do not spread `[negation]` to unrelated following words.

Examples:

```text
SHARE[negation] + OTP
```

means:

```text
আমি OTP শেয়ার করিনি।
```

It does not mean that every following action is negative.

For:

```text
DO-NOT[negation] + WORRY[negation]
```

produce the natural Bengali equivalent:

```text
চিন্তা করবেন না।
```

Do not double-negate the sentence.

### Standalone `NO` / `NOT`

A standalone `NO` or `NOT` may represent a reply such as:

```text
না।
```

It should not automatically be merged with the previous or next clause.

Example:

```text
THEY + ASK + CHEST_PAIN + SHE + SAY + NO
```

must preserve:

```text
তাঁরা জিজ্ঞাসা করলেন, তাঁর বুকে ব্যথা আছে কি না।
তিনি বললেন, না।
```

### Natural Event Segmentation

A gloss may contain several events even without explicit punctuation.

Do not merge separate events only to make the Bengali sentence shorter.

Example:

```text
I + COLLEGE + GO + FRIEND + MEET
```

means:

```text
আমি কলেজে গিয়েছিলাম। সেখানে বন্ধুর সঙ্গে দেখা হয়েছিল।
```

Do not change it to:

```text
আমি বন্ধুর সঙ্গে কলেজে গিয়েছিলাম।
```

The second version changes event structure and may imply that the friend went to college with the speaker.

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
- Do not merge two distinct events only to make the output shorter.
- Preserve CAN, CANNOT, MAY, MUST, SHOULD and NOT-NOW.
- Preserve IF / THEN / OTHERWISE.
- Preserve questions as questions.
- Preserve indirect and embedded questions.
- Preserve reported speech and speaker changes.
- Preserve WHETHER, NOT-SURE and HOPE.
- Reflect NMM and emotion naturally without adding facts.
- Use natural West Bengal Bengali.
- Prefer complete meaning over short output.
- Output ONLY Bengali text.

QUESTION SCOPE:

[?] is ONE question boundary, not one question per word.

Only the clause ending at [?] is explicitly marked as a question.

Do NOT create additional direct questions from words such as:
WHAT, WHY, HOW, WHETHER, IF, ASK.

When an embedded question is introduced by WHETHER or a similar marker,
render it naturally as Bengali indirect-question grammar such as:
"কি না", "হয় কি না", "পারব কি না", "আছে কি না".

Do not convert an earlier statement or conditional clause into a question
just because a later embedded question exists.

Example:

I + ASK + WHETHER + MY + CARD + CAN + UNBLOCK + TODAY[?]

Correct:
আমি জিজ্ঞাসা করলাম, আমার কার্ডটি আজ আনব্লক হতে পারবে কি না।

Do not incorrectly generate:
আমি জিজ্ঞাসা করলাম, আমার কার্ডটি আজ আনব্লক হবে?

NEGATION:

Only use negation when the gloss provides it.

Do not make an unmarked word negative.

Treat [negation] as a local semantic marker.
Do not automatically negate every later word.

Standalone NO / NOT may be a separate response:
"না।"

Example:

THEY + ASK + CHEST_PAIN + SHE + SAY + NO

must preserve both events:
তাঁরা জিজ্ঞাসা করলেন, তাঁর বুকে ব্যথা আছে কি না।
তিনি বললেন, না।

If the gloss explicitly marks the predicate as negative:

SHARE[negation] + OTP

produce a natural negative form:
OTP শেয়ার করিনি।

Do not create double negation.

EVENT SEGMENTATION:

Preserve separate events even when the gloss is continuous.

Example:

I + COLLEGE + GO + FRIEND + MEET

means:

আমি কলেজে গিয়েছিলাম। সেখানে বন্ধুর সঙ্গে দেখা হয়েছিল।

Do not change it to:

আমি বন্ধুর সঙ্গে কলেজে গিয়েছিলাম।

CONDITION RULE:

Preserve the full IF/THEN/OTHERWISE relationship.

Do not turn a conditional statement into a question unless its question
scope actually ends at [?].

Example:

IF + I + BRING + DOCUMENT + TOMORROW +
BANK + CAN + COMPLETE + VERIFICATION

means a condition:

আমি যদি কাল নথি নিয়ে আসি, তাহলে ব্যাংক যাচাইকরণ সম্পূর্ণ করতে পারবে।

It is NOT automatically:

আমি যদি কাল নথি নিয়ে আসি, তাহলে ব্যাংক যাচাইকরণ সম্পূর্ণ করতে পারবে কি?

unless the gloss explicitly marks that clause as a question.

REPORTED SPEECH:

Preserve speaker changes and reported speech.

Example:

OFFICER + SAY + IF + TRANSACTION + CONFIRM + FRAUD +
BANK + WILL + REFUND + MONEY

should remain a statement such as:

অফিসার বললেন, লেনদেনটি জালিয়াতি বলে নিশ্চিত হলে ব্যাংক টাকা ফেরত দেবে।

Do not transform reported statements into direct questions.

NO HALLUCINATION:

Do not add names, places, objects, causes, time, relationships,
symptoms or actions not present in the gloss.

SEMANTIC CONSISTENCY:

Before answering, internally check:

1. Every event is preserved.
2. Every subject and object is preserved.
3. Every negation has correct scope.
4. Every [ ? ] question boundary is preserved.
5. Embedded questions remain embedded questions.
6. IF/THEN/OTHERWISE structure is preserved.
7. Speaker changes are preserved.
8. No new information has been added.
9. Emotion is reflected naturally.
10. Separate events have not been incorrectly merged.

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

Tests:

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

Tests:

* question scope
* negation
* subject binding
* separate events
* reported speech

---

## 6. Test 9 — Long Banking Incident Stress Test

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

### Purpose

This test combines:

* long sequential events
* cause/effect
* conditional clauses
* multiple question types
* embedded `WHETHER` questions
* negative ability
* `NOT-NOW`
* reported speech
* uncertainty
* emotion
* multiple speakers
* long-range semantic consistency

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
STAND[neutral] +
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
RELIEF[neutral] +
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

### Actual Observed Output

```text
তিন দিন আগে সকালে আমি ব্যাংকে গিয়েছিলাম, কারণ আমাকে নতুন অ্যাকাউন্ট খুলতে হয়েছিল। তাই আমাকে নথি নিয়ে কাউন্টারের সামনে গিয়ে অপেক্ষা করতে হয়েছিল। যখন আমি আমার ফোন দিয়ে ব্যাংক অ্যাপ খুললাম, হঠাৎ আমি একটি লেনদেন দেখলাম যে আমি করিনি, এই পেমেন্টটি। আমি চিন্তিত হয়ে পড়লাম, তাই আমি কাস্টমার কেয়ারে কল করলাম। অফিসার আমাকে জিজ্ঞাসা করলেন, কী হয়েছে? আমি ব্যাখ্যা করলাম যে একটি অজানা লেনদেন আমার অ্যাকাউন্টে দেখাচ্ছে। তখন অফিসার জানতে চাইলেন যে আমি সম্প্রতি কোনো OTP কারো সাথে শেয়ার করেছি কিনা। আমি বললাম না, আমি OTP কারো সাথে শেয়ার করিনি। অফিসার বললেন, চিন্তা করো না, কিন্তু তারা কার্ড ব্লক করবে নিরাপত্তার জন্য। আমি জিজ্ঞাসা করলাম যে আজ আমি অনলাইন ব্যাংকিং ব্যবহার করতে পারব কি না। অফিসার বললেন, এখন পারবে না, কারণ অ্যাকাউন্টটি নিরাপত্তা যাচাইয়ের অধীনে আছে। আমি জিজ্ঞাসা করলাম এটা কতক্ষণ লাগবে? অফিসার বললেন, হয়তো চব্বিশ ঘণ্টা, কিন্তু শেষ সময়টা নির্ভর করে যাচাইকরণের ওপর। আমি জিজ্ঞাসা করলাম কোনো অজানা পেমেন্ট টাকা ফেরত আসবে কি না? অফিসার বললেন, যদি লেনদেনটি জালিয়াতি হয়, তবে ব্যাংক টাকা ফেরত দেবে, অন্যথায় তারা মার্চেন্টের কাছে আরও তথ্যের জন্য চাইতে পারে। আমি স্বস্তি বোধ করলাম, কিন্তু এখনও নিশ্চিত নই কারণ ফেরত দেওয়া নিশ্চিত নয়। তারপর অফিসার আমাকে একটি ফর্ম দিলেন এবং বললেন আমি ব্যাংকের তদন্ত শুরু করার আগে এটি পূরণ করতে হবে। আমি ফর্মটি পূরণ করলাম, কিন্তু আমার কাছে একটি নথি ছিল না, তাই আমি আবেদনটি জমা দিতে পারলাম না। আজ অফিসার বললেন, যদি আমি কাল নথি নিয়ে আসি, তাহলে যাচাইকরণ সম্পূর্ণ করা যাবে কিনা? আমি জিজ্ঞাসা করলাম আমার কার্ডটি আজ আনব্লক হতে পারবে কি না? অফিসার বললেন, না, শুধু নিরাপত্তা যাচাই সম্পূর্ণ হওয়ার পরই এটি আনব্লক করা যাবে। আমি তাদের ধন্যবাদ জানালাম এবং ব্যাংক থেকে বেরিয়ে এলাম। পথে আমি আমার ভাইকে ফোন করে সব কিছু বললাম। সে বলল, যদি ব্যাংকের অতিরিক্ত নথিপত্র লাগে তবে সে আমার জন্য আনতে পারে। কিন্তু আমি বললাম প্রথমে আমাকে দেখতে হবে যে লেনদেনটি সত্যিই জালিয়াতি কিনা বা সিদ্ধান্ত নেওয়ার আগে নয়। সেই সন্ধ্যায় ব্যাংক আমাকে একটি মেসেজ পাঠালো যে লেনদেনটি পর্যালোচনার অধীনে আছে। আমার বারবার ব্যাংকে আবার যাওয়ার প্রয়োজন নেই যতক্ষণ না তারা আমাকে কল করে। আমি এখনও উদ্বিগ্ন আছি কারণ আমি জানি না আমার টাকা ফেরত আসবে কি না, কিন্তু আমি আশা করছি তারা ফেরত দেবে।
```

### Stress Test Result

```text
Prompt processing:
2624 tokens
137.53 sec
~19.08 tok/s

Generation:
478 tokens
112.05 sec
~4.27 tok/s

Total:
~249.68 sec
```

### Main Errors Found

#### 1. Conditional sentence incorrectly converted to a question

Input:

```text
OFFICER + SAY +
IF + I + BRING + DOCUMENT + TOMORROW +
BANK + CAN + COMPLETE + VERIFICATION +
THEN + I + ASK + WHETHER + ...
```

Observed:

```text
আজ অফিসার বললেন, যদি আমি কাল নথি নিয়ে আসি, তাহলে যাচাইকরণ সম্পূর্ণ করা যাবে কিনা?
```

Problem:

* `IF ... THEN` statement became a question.
* The later `WHETHER` affected the earlier condition.
* Question scope was not correctly maintained.

Prompt fix:

```text
Do not allow a later WHETHER / ASK construction to turn an earlier IF/THEN
statement into a question.

Each clause must retain its own semantic type.

IF/THEN remains a condition unless that clause itself ends with [?].
```

---

#### 2. Bad semantic coordination near `OR NOT`

Observed:

```text
কিন্তু আমি বললাম প্রথমে আমাকে দেখতে হবে যে লেনদেনটি সত্যিই জালিয়াতি কিনা বা সিদ্ধান্ত নেওয়ার আগে নয়।
```

Problem:

The phrase:

```text
WHETHER THE TRANSACTION REALLY FRAUD OR NOT
BEFORE MAKING ANY DECISION
```

must mean:

```text
লেনদেনটি সত্যিই জালিয়াতি কি না, তা আগে যাচাই করতে হবে, তারপর কোনো সিদ্ধান্ত নেওয়া হবে।
```

Prompt fix:

```text
When WHETHER ... OR NOT expresses uncertainty or verification,
render the complete semantic pair together.

Do not attach OR NOT to an unrelated later phrase.

Preserve:
"whether X or not"
as:
"X কি না" / "X সত্যিই কি না" / another natural Bengali equivalent.
```

---

#### 3. Some Bengali phrasing is grammatical but unnatural

Observed:

```text
আমি একটি লেনদেন দেখলাম যে আমি করিনি, এই পেমেন্টটি।
```

Better:

```text
হঠাৎ আমি একটি লেনদেন দেখতে পেলাম, যেটি আমি করিনি।
```

Prompt fix:

```text
Prefer natural Bengali relative-clause construction over literal English
word order.

Do not duplicate a noun after a completed relative clause merely because
the English gloss repeats the concept.
```

---

#### 4. Pronoun / register consistency

Observed:

```text
অফিসার বললেন, চিন্তা করো না
```

Since the officer is speaking politely to the user, a more natural form is:

```text
অফিসার বললেন, চিন্তা করবেন না।
```

Prompt fix:

```text
Preserve appropriate Bengali honorific/register based on speaker relationship.
When an officer speaks politely to the customer, prefer respectful forms such
as "করবেন", "পারবেন", "বললেন".
```

---

## 7. Added Hard Rules From the Stress Test

These rules should remain in the production prompt:

```text
CLAUSE INDEPENDENCE:

Do not let a later question marker or embedded-question phrase change the
grammatical type of an earlier clause.

Every clause keeps its own:
- statement/question status
- negation scope
- condition scope
- speaker
- event boundary

QUESTION BOUNDARY:

[?] belongs only to the clause ending at that marker.

A later:
WHETHER
ASK
WHAT
WHY
HOW
OR NOT

must not retroactively convert an earlier clause into a direct question.

EMBEDDED QUESTION:

For:
ASK + WHETHER + X

use natural Bengali embedded-question constructions:
X কি না
X আছে কি না
X পারবে কি না
X হবে কি না

Do not automatically add direct-question punctuation.

CONDITIONAL + EMBEDDED QUESTION:

When:

IF + A + THEN + B + I + ASK + WHETHER + C

render A/B as a statement or condition,
then render C as the embedded question.

Do not merge A/B with C.

WHETHER ... OR NOT:

Treat WHETHER ... OR NOT as one semantic unit.

Examples:

WHETHER + FRAUD + OR + NOT
→ জালিয়াতি কি না

WHETHER + MONEY + RETURN + OR + NOT
→ টাকা ফেরত আসবে কি না

EVENT PRESERVATION:

Do not merge:
- reporting event
- conditional event
- question event
- answer event
- emotional reaction

unless natural Bengali requires a close grammatical connection.

REGISTER:

Use natural West Bengal Bengali.
Prefer respectful "আপনি" / "করবেন" / "পারবেন" when context indicates
formal interaction such as customer and bank officer.

NATURALNESS:

Do not preserve English word order when it produces awkward Bengali.
Prioritize natural Bengali syntax while preserving the original semantics.

SELF-CHECK:

Before final output verify:

- [ ? ] scope
- WHETHER scope
- IF/THEN scope
- OR NOT scope
- negation scope
- event boundaries
- speaker boundaries
- pronoun references
- honorific/register
- no hallucinated facts
```

---

## 8. Updated Final Testing Priority

The strongest tests for future models should now be:

```text
1. Long multi-event gloss
2. Question + embedded WHETHER
3. IF/THEN + later WHETHER
4. Multiple negations in one sequence
5. WHETHER ... OR NOT
6. Reported speech
7. Speaker changes
8. Separate answer events
9. Emotion + semantic preservation
10. Long-range pronoun/reference consistency
```

A model should not be considered successful only because the Bengali sounds fluent.

The model must also preserve:

```text
Meaning
+
Event structure
+
Question scope
+
Negation scope
+
Condition scope
+
Speaker structure
+
Natural West Bengal Bengali
```

---

## 9. Observed Performance

```text
Prompt processing: ~19.08 tok/s
Generation:        ~4.27 tok/s
RAM:               ~10 GB
```

Previous shorter stress test:

```text
Processed:         ~650 tokens
Generated:         ~212 tokens
Generation speed:  ~6.16 tok/s
Total request:     ~109 sec
```

The long banking test is substantially harder and should be treated as a **semantic stress benchmark**, not only a speed benchmark.

---

## 10. Final Selection

```text
Reference Model:
gemma-4-12b-it-Q4_0.gguf

Deployment Model:
gemma-4-E4B-it-Q4_K_M.gguf
```

**Final deployment model:**

`gemma-4-E4B-it-Q4_K_M.gguf`

It remains the most practical current model for the WBSL Bridge Bengali NLG stage because it provides strong Bengali generation, good long-gloss handling, good question and negation handling, better memory efficiency, and faster CPU inference.
