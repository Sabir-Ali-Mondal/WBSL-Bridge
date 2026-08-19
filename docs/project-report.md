# SignSetu: Real-Time Bidirectional Sign Language Communication System for the Deaf Community of West Bengal Using Deep Learning, Constrained Large Language Models, and Computer Vision

---

## Abstract

*Sign language is the primary communication medium for over 70 million Deaf and hard-of-hearing individuals worldwide, yet real-time sign language translation technology remains largely unavailable for the Deaf community in West Bengal, India. In August 2026, Google DeepMind deployed SL2T, a consumer-grade ASL-to-English translation system trained on over 100,000 hours of data, proving that continuous sign language recognition is architecturally feasible at consumer scale. However, the Deaf community in West Bengal — whether using Indian Sign Language (ISL), West Bengal Sign Language (WBSL), or regional signing variations — has no real-time translation system with Bengali-language output. Linguistic research by Johnson and Johnson (2016) identifies WBSL as distinct from Delhi ISL, while only 170 static signs exist as computational resources for WBSL, and most Bengali Sign Language technology projects target Bangladesh BdSL rather than the signing community in West Bengal. This project, SignSetu, proposes a community-centered research framework that adapts modern sign-language AI techniques to serve the Deaf population of West Bengal, targeting whichever sign language variety is most needed by the community. The system aims for real-time continuous sign recognition, Bengali-language sentence reconstruction using constrained large language models, signer-independent evaluation, and multimodal recognition integrating hand, face, and body landmarks extracted via MediaPipe Holistic. The forward pipeline translates sign sequences into grammatically correct Bengali text and speech, while an exploratory reverse pipeline investigates Bengali text-to-sign visual generation. The project addresses critical gaps in regional sign language datasets, Bengali linguistic fidelity including SOV structure and honorific systems, and low-resource transfer learning, ultimately aiming to bridge the communication divide for the Bengali-speaking Deaf community of West Bengal.*

---

## 1. Literature Survey and Existing Work

The field of sign language recognition and translation has evolved significantly over the past decade, progressing from sensor-based isolated sign detection to vision-based continuous sign language translation. This section surveys the most relevant existing work, organised chronologically, and identifies the specific gaps that motivate the SignSetu project, with a focus on serving the Deaf community of the West Bengal region.

### 1.1 Early Sensor-Based and Isolated Sign Systems

Sarker and Hoque (2018) from Chittagong University of Engineering and Technology (CUET) developed one of the earliest Bangla Sign Language (BdSL) conversion systems using smart gloves equipped with flex sensors and microcontrollers to translate Bangla sign language into Bangla speech [9]. While pioneering, this approach was hardware-dependent and could not capture the full visual grammar of sign language, including facial expressions and body movements. In the same year, Islam, Mousumi, and colleagues introduced Ishara-Lipi, described as the first complete multipurpose open access dataset of isolated characters for Bangla Sign Language [4]. The dataset contains 50 sets of 36 Bangla basic sign characters collected from different deaf and general volunteers near Dhaka, Bangladesh. Ishara-Lipi has been cited over 88 times and remains a foundational resource, but it is limited to static isolated characters and does not support continuous sign language recognition.

### 1.2 Vision-Based Bengali Sign Recognition Systems

The Bengali Sign Language Dataset by Muntakim Rafi, hosted on Kaggle, contains 12,581 static alphabet images (197 MB) and has been widely used for CNN-based isolated character classification, with multiple implementations achieving 95–99% accuracy on static sign classification [10]. Talukder and Jahara (2021) proposed a real-time Bangla Sign Language detection system with sentence and speech generation, interpreting BdSL from video streams to generate both textual and speech output [11]. However, their system was limited to a predefined vocabulary and used template-based sentence concatenation rather than contextual language reconstruction. Akash, Hoque, and Sarker (2023) from CUET presented an action recognition-based real-time Bangla Sign Language detection and sentence formation system, published at IEEE ICREST 2023 [3]. This work represents the most significant prior effort in Bengali sign sentence formation but remains constrained by fixed vocabulary, absence of LLM integration, lack of signer-independence validation, and no reverse translation path. Importantly, all of these systems originate from Bangladesh and target the signing variety used there.

### 1.3 Recent Word-Level Datasets for Bengali Signing

Recent years have seen the creation of larger datasets for Bengali signing. BdSLW60 (2024) provides 9,307 video trials for 60 Bangla sign words recorded by 18 signers under expert supervision [6]. BdSLW401 (2025) is a large-scale multi-view dataset with 102,176 video samples for 401 daily-use Bangla words related to health, education, and daily communication [7]. The IsharaKotha corpus provides 3,823 signs with HamNoSys notation for avatar-based sign language generation. While these datasets represent significant progress, they remain word-level collections without continuous sentence-level video data, Bengali-language transcripts, or non-manual marker annotations, and they are all collected in Bangladesh.

### 1.4 Indian Sign Language Benchmarks and Continuous Translation

For general Indian Sign Language (ISL), which is widely taught and used in formal Deaf education across India including West Bengal, the ISLTranslate dataset provides 30,000 pairs of continuous ISL videos with corresponding English translations [8]. The iSign benchmark, published at ACL 2024, provides a large-scale ISL-English dataset and explicitly acknowledges that eastern regions like West Bengal and southern regions like Tamil Nadu and Kerala have a higher degree of variation when compared with the Delhi variety [5]. This acknowledgment is important for SignSetu, as it confirms that the signing used in West Bengal may differ from standard Delhi ISL and therefore requires dedicated study.

### 1.5 Google DeepMind SL2T: The State of the Art

In August 2026, Google DeepMind deployed SL2T (Sign-Language-to-Text), a massively multilingual sign language translation model integrated into Gboard and Live Transcribe on Pixel 11 [2]. SL2T is trained on over 100,000 hours of data across more than 50 sign languages, with roughly a quarter in ASL. The system uses MediaPipe Holistic for on-device pose landmark extraction and translates coordinate sequences directly into text, bypassing intermediate gloss annotations. SL2T achieves a zero-shot score of 70 BLEURT on the FLEURS-ASL benchmark. Google explicitly states that glosses fail to capture rich, non-linear aspects of sign languages such as non-manual markers and spatial constructions. The system addresses practical issues including streaming latency, hallucination prevention on non-signing inputs, fairness for left-handed signers, and one-handed signing. However, SL2T currently targets ASL to English only, and sign language generation (the reverse path) is listed under future work. No Indian regional sign language is supported.

### 1.6 The Linguistic Context of West Bengal

Johnson and Johnson (2016) published a definitive linguistic study in Sign Language Studies demonstrating the distinction between West Bengal Sign Language (WBSL) and the Delhi variety of Indian Sign Language based on statistical assessment [1]. Multiple subsequent sources confirm that WBSL and Bangladesh BdSL represent separate regional signing varieties. At the same time, formal Deaf education in West Bengal often uses Indian Sign Language (ISL) as taught by the Indian Sign Language Research and Training Centre (ISLRTC). In practice, the signing used by Deaf individuals in West Bengal may reflect a combination of formal ISL, regional WBSL features, and home-sign or community-specific variations. The University of Hamburg Sign Language Dataset Compendium lists Wikisigns West Bengal Sign Language with only 170 signs as the sole dedicated WBSL resource [12]. An exhaustive search confirms that no AI, machine learning, or deep learning system has been developed specifically for the Deaf community of West Bengal, whether for ISL as used in the region, WBSL, or the signing variety that emerges in practice.

### 1.7 Summary of Literature Gap

| Work | Language / Region | Focus | Limitation |
|:---|:---|:---|:---|
| Johnson & Johnson (2016) | WBSL | Linguistic distinction from ISL | No technology built |
| Ishara-Lipi (2018) | BdSL (Bangladesh) | Isolated characters | Not continuous; Bangladesh |
| Muntakim Rafi Kaggle (~2019) | BdSL (Bangladesh) | Static alphabets | No temporal data |
| Talukder & Jahara (2021) | BdSL (Bangladesh) | Sentence + speech | Limited vocabulary |
| CUET Akash et al. (2023) | BdSL (Bangladesh) | Action recognition + sentences | Template-based; fixed vocab |
| BdSLW60 (2024) | BdSL (Bangladesh) | Word-level video | Words only; no sentences |
| ISLTranslate (2024) | ISL (pan-India) | Continuous translation | English output; not Bengali |
| iSign ACL (2024) | ISL (pan-India) | Benchmark; acknowledges WB variation | Not WB-specific |
| BdSLW401 (2025) | BdSL (Bangladesh) | Word-level video | Words only; no sentences |
| Google SL2T (2026) | ASL | Deployed product | ASL→English; 100K hrs data |
| **SignSetu (Proposed)** | **West Bengal signing community** | **Bidirectional, Bengali output** | **Research stage** |

The key observation is that **all technology rows from Ishara-Lipi to BdSLW401 originate from Bangladesh**, while the only pan-India resources (ISLTranslate, iSign) produce English output. **No system is built for the signing community of West Bengal with Bengali output.**

---

## 2. Proposed Work

SignSetu proposes a community-centered research framework to adapt modern sign-language AI techniques, demonstrated at consumer scale by Google SL2T for ASL, to serve the Deaf population of West Bengal. The project does not pre-commit to a single sign language variety. Instead, it investigates the signing used by the West Bengal Deaf community — which may include Indian Sign Language (ISL) as taught formally, West Bengal Sign Language (WBSL) as identified linguistically, or regional variations that emerge in practice — and builds a translation system that serves their actual communication needs with Bengali-language output.

### 2.1 Research Problem and Justification

The core research problem is defined as follows: continuous real-time sign language translation has been demonstrated at consumer scale for ASL to English by Google SL2T, but comparable capabilities remain unavailable for the Deaf community of West Bengal, regardless of whether the signing variety used is ISL, WBSL, or a regional variant. The justification for this work rests on three verified facts. First, linguistic research indicates that West Bengal signing may differ from Delhi ISL, as acknowledged by Johnson and Johnson (2016) [1] and by the iSign benchmark (2024) [5]. Second, the only dedicated WBSL computational resource is a static dictionary of 170 signs [12], while most Bengali signing technology targets Bangladesh BdSL. Third, the Deaf community of West Bengal — whether using formal ISL, regional WBSL, or a mixed variety — has no real-time translation system producing Bengali-language output. The scale gap is stark: Google SL2T was trained on over 100,000 hours of data, while the available dedicated West Bengal signing data is approximately 170 static signs — a gap of approximately five orders of magnitude.

### 2.2 Community-Centered Approach

Rather than pre-defining the target sign language, SignSetu adopts a community-centered approach. The project will begin with a needs assessment involving the Deaf community of West Bengal to determine which signing variety is most commonly used and most needed for communication. Depending on the findings, the system will be trained on ISL data as used in the region, WBSL data as it can be collected, or a combination. This pragmatic approach ensures the project serves actual users rather than an abstract linguistic category. The linguistic distinction between ISL and WBSL will be studied as a research finding rather than a constraint.

### 2.3 Forward Path: Sign to Bengali Text and Speech

The forward pipeline follows the architectural principles validated by Google SL2T while adapting them for low-resource constraints. The pipeline begins with camera input, from which MediaPipe Holistic extracts hand, face, and body pose landmarks on-device. This landmark-based approach provides invariance to lighting, background, and camera angle while preserving user privacy since raw video is discarded. The landmark coordinate sequences are fed into a temporal model, with LSTM and Transformer architectures to be compared during baseline experiments. The temporal model produces a sign sequence or compact representation, which is then processed by a constrained large language model for Bengali sentence reconstruction. The LLM must handle Bengali-specific linguistic features including SOV word order, agglutinative morphology, the three-level honorific system, and conjunct character rendering. The final output is grammatically correct Bengali text, optionally converted to speech via a Bengali TTS engine.

### 2.4 Reverse Path: Bengali Text to Sign (Exploratory)

The reverse pipeline is designated as an exploratory direction. It accepts Bengali text or speech input, processes it through Bengali NLP to identify sign-relevant semantic units, maps them to a sign sequence, and renders the output using either pre-recorded sign clips or a basic avatar display. Google SL2T explicitly lists sign language generation as future work, and no existing system provides text-to-sign generation for the West Bengal signing context. This component will be explored only after the forward path achieves stable baseline performance.

### 2.5 Key Research Contributions

The proposed work targets the following specific contributions. First, the first continuous sign recognition system built for the Deaf community of West Bengal, using pose landmark-based temporal modelling. Second, LLM-based Bengali sentence reconstruction with constrained generation to prevent hallucination. Third, signer-independent evaluation using hold-out subject testing from the West Bengal community. Fourth, multimodal recognition integrating hand, face, and body landmarks for West Bengal signing. Fifth, documentation of the signing varieties used in West Bengal and their relationship to formal ISL and WBSL. Sixth, if feasible, collection of a small dataset from West Bengal Deaf signers.

### 2.6 Dataset Strategy

Given the limited availability of West Bengal-specific signing data, the project adopts a multi-source strategy. Existing ISL datasets including ISLTranslate and iSign will be used as primary training resources since ISL is formally taught in West Bengal. Existing BdSL datasets including Ishara-Lipi and BdSLW60 will be used for baseline experiments and to explore transfer learning where sign varieties overlap. If feasible, a small dataset of 50 to 100 sentences will be collected from West Bengal Deaf signers to capture regional signing features. If collection is not feasible within the project timeline, the adaptation limitations will be documented as a research finding.

### 2.7 Evaluation Framework

The system will be evaluated using classification metrics including accuracy, precision, recall, and F1-score for sign recognition. Translation quality will be measured using BLEU, BERTScore, or BLEURT where applicable. Signer independence will be evaluated by testing on subjects not included in training data. Real-time performance will be measured in frames per second and end-to-end latency in milliseconds. Hardware utilisation including CPU, RAM, and GPU usage will be recorded to assess deployment feasibility on budget devices common in West Bengal. Community acceptance will be assessed through user feedback from Deaf participants.

---

## 3. Plan of Work Implementation

The project is organised into four phases. The current phase focuses on research foundation. The subsequent phases address community engagement, core recognition, integration, and exploratory reverse communication.

### 3.1 Phase 1: Research Foundation and Community Engagement (Current)

This phase includes completion of the literature survey, identification and documentation of research gaps, study and download of available datasets including ISLTranslate, iSign, Ishara-Lipi, and BdSLW60, setup of the development environment with Python, PyTorch, and MediaPipe, and initial engagement with the Deaf community of West Bengal to understand signing practices and communication needs. Baseline CNN and LSTM experiments will be executed on available datasets. The deliverable is a documented baseline performance report and a community needs assessment.

### 3.2 Phase 2: Core Recognition Pipeline

This phase includes implementation of the MediaPipe Holistic landmark extraction pipeline, training and comparison of LSTM versus Transformer architectures on available ISL and BdSL data, attempt at continuous sign-sequence recognition, integration of a constrained LLM for Bengali sentence reconstruction, and initial signer-independence testing with hold-out subjects from the West Bengal community. The deliverable is a working sign-to-Bengali-text prototype.

### 3.3 Phase 3: Integration and Evaluation

This phase includes real-time webcam-based recognition integration, comprehensive signer-independence evaluation, latency and FPS benchmarking on available hardware, performance comparison against baseline results, documentation of results and analysis, and collection of user feedback from Deaf participants. The deliverable is a complete evaluation report with quantified metrics.

### 3.4 Phase 4: Exploratory Reverse Path (Optional)

This phase, to be pursued only if Phases 1 through 3 are successfully completed, includes Bengali text to sign sequence mapping, pre-recorded sign library or basic avatar display, and preliminary evaluation of reverse path intelligibility. This phase is explicitly designated as exploratory and is not a core deliverable.

### 3.5 Timeline Summary

| Phase | Activities | Expected Deliverable |
|:---|:---|:---|
| Phase 1 | Literature, datasets, community engagement, baseline | Baseline report + needs assessment |
| Phase 2 | Recognition, LLM integration, Bengali output | Sign-to-text prototype |
| Phase 3 | Real-time integration, evaluation, user feedback | Evaluation report |
| Phase 4 | Reverse path (optional) | Exploratory prototype |

### 3.6 Risks and Mitigation

| Risk | Mitigation |
|:---|:---|
| Limited West Bengal signing data | Use ISL data; collect small regional set |
| Insufficient GPU resources | Use lightweight MediaPipe landmarks; pre-trained models |
| Bengali TTS quality is poor | Focus on text output first; TTS is optional |
| Scope exceeds timeline | Reverse path is exploratory, not core |
| ISL vs WBSL boundary unclear | Treat as research finding; serve community needs |
| LLM hallucination in translation | Use constrained generation; validate against input |

---

## 4. Conclusion

SignSetu aims to investigate how modern sign-language AI, demonstrated at consumer scale by Google SL2T for ASL to English translation, can be adapted to serve the Deaf community of West Bengal. The project addresses a verified technological void: regardless of whether the community uses formal Indian Sign Language, the linguistically identified West Bengal Sign Language, or regional variations, there is no real-time translation system producing Bengali-language output, and the only dedicated WBSL computational resource is a static dictionary of 170 signs. The proposed system targets real-time continuous sign recognition using MediaPipe Holistic landmarks and temporal deep learning models, Bengali-language sentence reconstruction using constrained large language models, signer-independent evaluation, and multimodal recognition integrating hand, face, and body features. An exploratory reverse path investigates Bengali text-to-sign visual generation. The project does not compete with high-resource systems but asks a fundamentally different question: whether sign language AI can serve a specific regional Deaf community with Bengali-language needs, regardless of the exact sign language variety used. The exact model architecture, final signing variety targeted, and implementation scope will be determined after community engagement, dataset availability assessment, and baseline experiments. Bidirectional sign generation remains an extended direction contingent on the successful completion of core recognition objectives.

---

## References

[1], Johnson, R.J., Johnson, J.E., Distinction between West Bengal Sign Language and Indian Sign Language Based on Statistical Assessment, Sign Language Studies, Volume 16, Number 4, Pages 448-476, 2016.

[2], Tanzer, G., Brard, B., Clark, E., Dozat, T., Ebert, S., Garrette, D., Georg, M., Holgate, V., Kumar, S., Saboorian, M., Stanojević, M., Umekar, M., Wieting, J., Zhang, A., Dyer, C., Putting Sign Language AI into Users' Hands: SL2T Sign-Language-to-Text Translation Model, Google DeepMind Technical Report, 2026.

[3], Akash, S.K., Hoque, M.M., Sarker, S., Action Recognition Based Real-time Bangla Sign Language Detection and Sentence Formation, Proceedings of the 3rd International Conference on Robotics, Electrical and Signal Processing Techniques (ICREST), IEEE, 2023.

[4], Islam, S., Mousumi, A.S., Ishara-Lipi: The First Complete Multipurpose Open Access Dataset of Isolated Characters for Bangla Sign Language, Proceedings of the International Conference on Bangla Sign Language, 2018.

[5], Sengupta, S., et al., iSign: A Benchmark for Indian Sign Language Processing, Findings of the Association for Computational Linguistics (ACL), 2024.

[6], Islam, M.M., et al., BdSLW60: A Word-level Bangla Sign Language Dataset, Data in Brief, 2024.

[7], BdSLW401: A Large-scale Multi-view Bangla Sign Language Dataset for Health, Education, and Daily Communication, 2025.

[8], ISLTranslate: A Continuous Indian Sign Language Translation Dataset with 30,000 ISL-English Sentence Pairs, 2024.

[9], Sarker, S., Hoque, M.M., An Intelligent System for Conversion of Bangla Sign Language into Speech, Proceedings of the International Conference on Bangla Sign Language, 2018.

[10], Rafi, A.M., Bengali Sign Language Dataset, Kaggle, 2019.

[11], Talukder, S., Jahara, N., Real-Time Bangla Sign Language Detection with Sentence and Speech Generation, International Journal of Computer Applications, 2021.

[12], University of Hamburg, The Sign Language Dataset Compendium: Wikisigns West Bengal Sign Language, Institute of German Sign Language and Communication of the Deaf, IDGS, 2024.

---
