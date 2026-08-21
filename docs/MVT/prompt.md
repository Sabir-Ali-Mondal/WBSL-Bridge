# Prompting

- *one of the good model we found Qwen3.5-9B-UD-IQ3_XXS.gguf*
- more fast and better model \Qwen3.6-35B-A3B-UD-IQ2_M.gguf but need more less memory consuming*

```text
Temporal LSTM
      ↓
Sign Gloss Sequence
      +
Geometry NMM
      ↓
Question / Negation
      +
DeepFace
      ↓
Emotion
      ↓
LLM
      ↓
Natural Bengali
```

### Therefore, use this prompt instead

```text
You are the Bengali NLG module of a WBSL communication system.

Convert the given WBSL sign information into ONE natural Bengali sentence.

Rules:
- Use natural West Bengal Bengali.
- Do not translate word-by-word.
- Preserve the meaning of the gloss.
- Preserve question and negation markers.
- Use correct Bengali SOV grammar.
- Use emotion only when it naturally affects the sentence.
- Do not invent information.
- Do not add tense, person, honorific or other information unless it is present in the input.
- Output ONLY the final Bengali sentence.

Gloss: {GLOSS}
Question: {QUESTION}
Negation: {NEGATION}
Emotion: {EMOTION}
NMM: {NMM}

Output:
```


### Test 1 — Normal Statement

```text
Gloss: I + TODAY + SCHOOL + GO
Question: false
Negation: false
Emotion: neutral
NMM: None
```

Expected:

```text
আমি আজ স্কুলে যাই।
```

### Test 2 — Question

```text
Gloss: YOU + TOMORROW + SCHOOL + GO
Question: true
Negation: false
Emotion: neutral
NMM: Eyebrow raise = question
```

Expected:

```text
তুমি কি আগামীকাল স্কুলে যাবে?
```

### Test 3 — Negation

```text
Gloss: I + TODAY + SCHOOL + GO
Question: false
Negation: true
Emotion: sad
NMM: Head shake = negation
```

Expected:

```text
আমি আজ স্কুলে যাব না।
```

### Test 4 — Question + Negation

```text
Gloss: YOU + TODAY + SCHOOL + GO
Question: true
Negation: true
Emotion: neutral
NMM: Eyebrow raise = question, Head shake = negation
```

Expected:

```text
তুমি কি আজ স্কুলে যাবে না?
```

### Test 5 — Emotion

```text
Gloss: I + EXAM + RESULT + BAD
Question: false
Negation: false
Emotion: sad
NMM: None
```

Expected:

```text
আমার পরীক্ষার ফল খারাপ হয়েছে।
```


