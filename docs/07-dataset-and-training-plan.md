### Final ISL + WBSL Data Plan

```text
ISL Data + WBSL Data
        ↓
Data Collection
        ↓
Clean + Remove Duplicates
        ↓
Language Label
(ISL / WBSL)
        ↓
Gloss + Bengali Text
        ↓
Hand + Face + Body Features
        ↓
Train / Validation / Test
        ↓
Sign Recognition / Translation
```

### Minimum Initial Data

* **WBSL:** 100–200 signs
* **WBSL signers:** 5+
* **WBSL samples:** 10–20 per sign
* **WBSL sentences:** 100–300
* **ISL:** 1,000+ samples/sentences

### Training Experiments

```text
Model A → WBSL only

Model B → ISL → WBSL Fine-tuning

Model C → ISL + WBSL
```

**Main target:** WBSL
**Supporting data:** ISL
**Important:** Keep ISL and WBSL separately labelled.
