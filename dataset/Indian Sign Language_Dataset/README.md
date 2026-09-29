# Indian Sign Language Dataset

This directory contains the source datasets used by **WBSL Bridge** for Indian Sign Language recognition.

The dataset is divided into two types:

- **Static signs** — alphabets and digits using images
- **Dynamic signs** — words and sentences using videos

## Dataset Structure

```text
dataset/
        Indian Sign Language_Dataset/
        ├── ISL_STATIC1/
        ├── ISL_STATIC2/
        ├── ISL_VIDEO/
        └── README.md
````

---

# 1. ISL_STATIC1

Older static Indian Sign Language image dataset containing alphabets and digits.

**Source:** Blank

## Classes

### Numbers

```text
1, 2, 3, 4, 5, 6, 7, 8, 9
```

### Alphabets

```text
A, B, C, D, E, F, G, H, I, J,
K, L, M, N, O, P, Q, R, S, T,
U, V, W, X, Y, Z
```

## Dataset Details

* **26 alphabets**
* **9 numbers**
* **35 total classes**
* **1,200 images per class**
* **42,000 total images**
* **Format:** `.jpg`
* **Image index:** `0–1199`

## File Pattern

Each class is stored in its own folder.

```text
ISL_STATIC1/
├── 1/
│   ├── 0.jpg
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── ...
│   └── 1199.jpg
├── 2/
│   ├── 0.jpg
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── ...
│   └── 1199.jpg
├── ...
└── Z/
    ├── 0.jpg
    ├── 1.jpg
    ├── 2.jpg
    ├── ...
    └── 1199.jpg
```

### Example

```text
ISL_STATIC1\2\13.jpg
```

```text
2   → class / gloss
13  → image index
```

---

# 2. ISL_STATIC2

Newer and higher-quality static Indian Sign Language image dataset containing complete digits and alphabets.

**Source:**
[https://www.kaggle.com/datasets/ananyaarya22/isl-data/data](https://www.kaggle.com/datasets/ananyaarya22/isl-data/data)

## Classes

### Numbers

```text
0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

### Alphabets

```text
A, B, C, D, E, F, G, H, I, J,
K, L, M, N, O, P, Q, R, S, T,
U, V, W, X, Y, Z
```

## Dataset Details

* **26 alphabets**
* **10 numbers**
* **36 total classes**
* **1,000 images per class**
* **36,000 total images**
* **Format:** `.jpg`
* **Image index:** `0–999`

## File Pattern

Each class is stored in its own folder.

```text
ISL_STATIC2/
├── 0/
│   ├── 0_0.jpg
│   ├── 0_1.jpg
│   ├── 0_2.jpg
│   ├── ...
│   └── 0_999.jpg
├── 1/
│   ├── 1_0.jpg
│   ├── 1_1.jpg
│   ├── 1_2.jpg
│   ├── ...
│   └── 1_999.jpg
├── ...
└── Z/
    ├── Z_0.jpg
    ├── Z_1.jpg
    ├── Z_2.jpg
    ├── ...
    └── Z_999.jpg
```

### Example

```text
ISL_STATIC2\2\2_25.jpg
```

```text
2     → class / gloss
2_25  → class 2, image index 25
25    → image index
```

---

# 3. ISL_VIDEO

Dynamic Indian Sign Language word and sentence video dataset.

**Source:**
[https://www.kaggle.com/datasets/prasadshet/indian-sign-language-video-dataset](https://www.kaggle.com/datasets/prasadshet/indian-sign-language-video-dataset)

## Dataset Details

* **61 word/sentence classes**
* **60 videos per class**
* **3,660 total videos**
* **Format:** `.mp4`

## Classes and Glosses

| Word / Sentence   | Gloss               |
| ----------------- | ------------------- |
| Bear              | `BEAR`              |
| Break             | `BREAK`             |
| Brinjal           | `BRINJAL`           |
| Budget            | `BUDGET`            |
| Busy              | `BUSY`              |
| Cabbage           | `CABBAGE`           |
| Carrot            | `CARROT`            |
| Cauliflower       | `CAULIFLOWER`       |
| Chilli            | `CHILLI`            |
| Clean             | `CLEAN`             |
| Close             | `CLOSE`             |
| Come              | `COME`              |
| Cook              | `COOK`              |
| Crocodile         | `CROCODILE`         |
| Cry               | `CRY`               |
| Cucumber          | `CUCUMBER`          |
| Deer              | `DEER`              |
| Drink             | `DRINK`             |
| Elephant          | `ELEPHANT`          |
| Exam              | `EXAM`              |
| Fedup             | `FED_UP`            |
| Fever             | `FEVER`             |
| Giraffe           | `GIRAFFE`           |
| Give              | `GIVE`              |
| Good afternoon    | `GOOD_AFTERNOON`    |
| Good Morning      | `GOOD_MORNING`      |
| Hello             | `HELLO`             |
| Hug               | `HUG`               |
| Injury            | `INJURY`            |
| Interview         | `INTERVIEW`         |
| Jump              | `JUMP`              |
| Karnataka         | `KARNATAKA`         |
| Key               | `KEY`               |
| Knife             | `KNIFE`             |
| Lemon             | `LEMON`             |
| Lion              | `LION`              |
| Man               | `MAN`               |
| Maths             | `MATHS`             |
| Maybe             | `MAYBE`             |
| Monkey            | `MONKEY`            |
| Onion             | `ONION`             |
| Peacock           | `PEACOCK`           |
| Pigeon            | `PIGEON`            |
| Pour              | `POUR`              |
| Radish            | `RADISH`            |
| Sparrow           | `SPARROW`           |
| Still             | `STILL`             |
| Switch            | `SWITCH`            |
| Tea               | `TEA`               |
| Temple            | `TEMPLE`            |
| Thank you         | `THANK_YOU`         |
| Tiger             | `TIGER`             |
| Turtle            | `TURTLE`            |
| Umbrella          | `UMBRELLA`          |
| Uncle             | `UNCLE`             |
| Vegetables        | `VEGETABLES`        |
| Volcano           | `VOLCANO`           |
| What is your Name | `WHAT_IS_YOUR_NAME` |
| Wife              | `WIFE`              |
| Writer            | `WRITER`            |
| Wrong             | `WRONG`             |

## Folder Pattern

Each word/sentence has its own folder.

```text
ISL_VIDEO/
├── Bear/
├── Break/
├── Brinjal/
├── Budget/
├── Busy/
├── ...
├── What is your Name/
├── Wife/
├── Writer/
└── Wrong/
```

Each class contains **60 videos**.

## File Naming Pattern

The original video filenames are preserved. They do **not** follow a simple `video_01.mp4` naming pattern.

```text
ISL_VIDEO/
└── Cabbage/
    ├── <original_filename>.mp4
    ├── <original_filename>.mp4
    ├── ...
    └── 60 videos
```

### Example

```text
ISL_VIDEO\Cabbage\WIN_20231102_11_05_42_Pro_right_tilt.mp4
```

```text
Cabbage
    → class / gloss

WIN_20231102_11_05_42_Pro_right_tilt.mp4
    → original video filename
```

---

# Dataset Summary

| Dataset       | Classes |       Samples | Format |
| ------------- | ------: | ------------: | ------ |
| `ISL_STATIC1` |      35 | 42,000 images | `.jpg` |
| `ISL_STATIC2` |      36 | 36,000 images | `.jpg` |
| `ISL_VIDEO`   |      61 |  3,660 videos | `.mp4` |



# WBSL Bridge Dataset Usage

```text
ISL_STATIC1
       \
        \
         → Combined Static Dataset → Static Sign Model
        /
ISL_STATIC2

ISL_VIDEO → Dynamic Sign Model
```

### Dataset Visual Coverage Note

```text
ISL_STATIC1 / ISL_STATIC2
→ Mainly hand-focused images
→ Wrist to palm and fingers are visible
→ Includes both front and back hand views

ISL_VIDEO
→ Full-body / upper-body signing videos
→ Full hand and arm movements
→ Facial expressions
→ Mouth and lip movements
→ Eye and head movements
→ Useful for dynamic signs, NMM, and emotion-related features
```

This gives WBSL Bridge both **detailed hand-shape information from static images** and **full signing context from videos**.

