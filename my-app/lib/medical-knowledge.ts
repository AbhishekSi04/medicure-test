/**
 * Medical Knowledge Base — RAG Corpus
 *
 * This is the retrieval corpus for the RAG (Retrieval-Augmented Generation)
 * healthcare assistant. Each document contains a topic, keywords for matching,
 * and detailed medical content that gets injected as context into the LLM prompt.
 *
 * Pattern: User query → semantic keyword match → top-k relevant docs retrieved
 *          → context injected into Groq LLM prompt → grounded, accurate response
 */

export interface KnowledgeDocument {
  id: string;
  topic: string;
  keywords: string[];
  content: string;
}

export const MEDICAL_KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: "symptoms-cold-flu",
    topic: "Cold & Flu Symptoms",
    keywords: ["cold", "flu", "fever", "cough", "runny nose", "sore throat", "congestion", "influenza", "sneeze", "chills", "body ache"],
    content: `Common Cold: Caused by rhinoviruses. Symptoms include runny/stuffy nose, sore throat, sneezing, mild cough, mild body aches. Usually resolves in 7-10 days. Treatment: rest, hydration, OTC decongestants/antihistamines. No antibiotic needed (viral).

Influenza (Flu): More severe than cold. Symptoms: sudden high fever (100-104°F), severe body aches, fatigue, dry cough, headache, chills. Can cause serious complications in elderly, young children, immunocompromised. Treatment: antiviral medications (oseltamivir/Tamiflu) most effective if started within 48h of onset, rest, fluids, fever reducers (acetaminophen/ibuprofen).

See a doctor if: fever above 103°F lasting more than 3 days, difficulty breathing, chest pain, persistent vomiting, confusion, or symptoms in infants under 3 months.`
  },
  {
    id: "heart-health",
    topic: "Heart Health & Cardiovascular Disease",
    keywords: ["heart", "chest pain", "cardiovascular", "blood pressure", "cholesterol", "cardiac", "heart attack", "hypertension", "palpitations", "shortness of breath", "angina"],
    content: `Heart Attack Warning Signs: Chest pain/pressure/tightness radiating to arm, jaw, or back. Shortness of breath. Cold sweat, nausea, lightheadedness. Women may experience atypical symptoms (fatigue, jaw pain). CALL EMERGENCY SERVICES (911) IMMEDIATELY if suspected.

Hypertension (High Blood Pressure): Normal <120/80 mmHg. Hypertension Stage 1: 130-139/80-89. Stage 2: ≥140/90. Risk factors: obesity, stress, salt, alcohol, smoking, genetics. Treatment: lifestyle changes (DASH diet, exercise, weight loss, reduce sodium/alcohol), medications (ACE inhibitors, ARBs, beta-blockers, diuretics).

Heart-Healthy Foods: Omega-3 fatty acids (salmon, sardines, walnuts), leafy greens (spinach, kale), whole grains, berries, avocado, olive oil, legumes. Limit: saturated fats, trans fats, sodium, added sugars, processed foods.

Cholesterol: LDL ("bad") <100 mg/dL optimal. HDL ("good") >60 mg/dL protective. Total cholesterol <200 mg/dL. Statins, diet, and exercise help manage levels.`
  },
  {
    id: "diabetes-management",
    topic: "Diabetes Management",
    keywords: ["diabetes", "blood sugar", "glucose", "insulin", "type 1", "type 2", "diabetic", "A1C", "hyperglycemia", "hypoglycemia", "sugar levels"],
    content: `Type 1 Diabetes: Autoimmune; pancreas produces little/no insulin. Requires daily insulin injections or pump. Onset usually in childhood/adolescence. Symptoms: excessive thirst, frequent urination, unexplained weight loss, fatigue, blurred vision.

Type 2 Diabetes: Most common (90-95% of cases). Insulin resistance. Risk factors: obesity, sedentary lifestyle, family history, age >45. Often manageable with lifestyle changes initially; may need oral medications (metformin) or insulin later.

Blood Sugar Targets: Fasting glucose 80-130 mg/dL, 2h post-meal <180 mg/dL, A1C <7% (for most adults with diabetes).

Hypoglycemia (<70 mg/dL): Shakiness, sweating, confusion, fast heartbeat. Treat with 15g fast-acting carbs (glucose tablets, juice, regular soda), recheck in 15 minutes.

Dietary Management: Low glycemic index foods, portion control, consistent meal timing, limit refined carbs/sugary drinks, regular physical activity (150 min/week moderate-intensity).`
  },
  {
    id: "mental-health",
    topic: "Mental Health — Anxiety & Depression",
    keywords: ["anxiety", "depression", "mental health", "stress", "panic", "mood", "sleep", "therapy", "mental illness", "sad", "worry", "overwhelmed", "burnout"],
    content: `Depression Symptoms: Persistent sadness, loss of interest in activities, changes in appetite/weight, sleep disturbances, fatigue, difficulty concentrating, feelings of worthlessness, thoughts of death/suicide. Lasts ≥2 weeks.

Anxiety Disorders: Excessive worry/fear disproportionate to actual danger. Types: Generalized Anxiety (GAD), Panic Disorder, Social Anxiety, Phobias. Symptoms: restlessness, rapid heartbeat, sweating, trembling, shortness of breath.

Treatment Options: Psychotherapy (CBT most evidence-based), medications (SSRIs/SNRIs first-line for both depression and anxiety), lifestyle changes (exercise, sleep hygiene, mindfulness, reducing caffeine/alcohol).

Immediate Coping Strategies: Box breathing (4-4-4-4), grounding (5-4-3-2-1 technique), regular exercise, social connection, limiting news/social media.

CRISIS: If experiencing thoughts of self-harm or suicide, contact: National Suicide Prevention Lifeline: 988, Crisis Text Line: Text HOME to 741741.`
  },
  {
    id: "sleep-health",
    topic: "Sleep Health & Insomnia",
    keywords: ["sleep", "insomnia", "tired", "fatigue", "rest", "sleep quality", "melatonin", "circadian", "snoring", "sleep apnea", "drowsy"],
    content: `Sleep Recommendations: Adults 7-9 hours/night. Teens 8-10 hours. School-age children 9-12 hours.

Sleep Hygiene Tips: Consistent sleep/wake schedule (even weekends), dark/cool/quiet bedroom, avoid screens 1h before bed (blue light suppresses melatonin), limit caffeine after noon, avoid alcohol close to bedtime, regular exercise (but not within 3h of sleep), relaxation routine.

Insomnia: Difficulty falling/staying asleep ≥3 nights/week for ≥3 months. CBT-I (Cognitive Behavioral Therapy for Insomnia) is the gold-standard first-line treatment. Medications: short-term sleep aids (zolpidem), melatonin (0.5-5mg 1-2h before bed) for circadian issues.

Sleep Apnea: Loud snoring, gasping/choking during sleep, excessive daytime sleepiness. Risk: obesity, large neck circumference. Diagnosis: sleep study. Treatment: CPAP therapy, weight loss, positional therapy.`
  },
  {
    id: "headache-migraine",
    topic: "Headaches & Migraines",
    keywords: ["headache", "migraine", "head pain", "tension headache", "cluster headache", "nausea with headache", "light sensitivity", "throbbing"],
    content: `Tension Headache: Most common type. Dull, pressure-like pain on both sides. Causes: stress, poor posture, dehydration, eyestrain. Treatment: OTC analgesics (acetaminophen, ibuprofen, aspirin), hydration, rest, relaxation.

Migraine: Moderate-severe pulsating pain, usually one side. Often with nausea, vomiting, light/sound sensitivity. May have aura (visual disturbances). Triggers: hormonal changes, foods (aged cheese, wine, MSG), stress, sleep changes, bright lights. Treatment: triptans (sumatriptan), NSAIDs, antiemetics; preventive: topiramate, beta-blockers, CGRP antagonists.

When to Seek Emergency Care: "Thunderclap" headache (worst ever, sudden onset), headache with fever/stiff neck/rash (possible meningitis), headache after head injury, headache with confusion/vision changes/weakness/speech problems.

Cluster Headaches: Severe pain around one eye, occurring in clusters/cycles. Rare but extremely painful. Treatment: oxygen therapy, triptans, verapamil for prevention.`
  },
  {
    id: "nutrition-diet",
    topic: "Nutrition & Diet",
    keywords: ["nutrition", "diet", "food", "eat", "healthy eating", "vitamins", "protein", "calories", "weight", "BMI", "obesity", "nutrients", "balanced diet"],
    content: `Balanced Diet Principles: Half plate fruits/vegetables, quarter lean protein (chicken, fish, legumes, tofu), quarter whole grains (brown rice, quinoa, oats). Limit processed foods, added sugars, saturated fats, sodium.

Key Nutrients: Protein (0.8g/kg body weight for sedentary adults, more for active). Fiber (25-38g/day). Omega-3 fatty acids (fatty fish 2x/week). Iron (plant sources: lentils, spinach + vitamin C for absorption). Calcium (dairy, fortified plant milks, leafy greens). Vitamin D (sunlight, fortified foods, supplements often needed).

Hydration: 8-10 cups water/day (more with exercise/heat). Urine should be light yellow.

Weight Management: BMI 18.5-24.9 normal. Weight loss: sustainable 1-2 lbs/week through modest caloric deficit (500 cal/day) + increased activity. Crash diets are counterproductive long-term.

Mediterranean Diet: Evidence-based for heart health, longevity — olive oil, fish, legumes, whole grains, fruits, vegetables, nuts, limited red meat/sugar.`
  },
  {
    id: "exercise-fitness",
    topic: "Exercise & Physical Activity",
    keywords: ["exercise", "workout", "fitness", "physical activity", "running", "gym", "strength", "cardio", "sedentary", "active", "sports"],
    content: `Physical Activity Guidelines (Adults): 150-300 minutes moderate-intensity aerobic activity/week (brisk walking, cycling, swimming) OR 75-150 minutes vigorous-intensity (running, HIIT) + muscle-strengthening ≥2 days/week.

Benefits: Reduces risk of heart disease, type 2 diabetes, several cancers, depression, anxiety; improves sleep, cognitive function, bone density, weight management.

Starting Safely: If sedentary/older/chronic conditions, consult doctor before starting. Begin gradually, increase duration/intensity over weeks. Warm up 5-10 min, cool down 5 min.

Muscle Soreness: Delayed onset muscle soreness (DOMS) normal 24-72h after new exercise. Treatment: rest, gentle movement, ice/heat, OTC pain relievers. Sharp/immediate pain may indicate injury — stop activity.

Overtraining Signs: Persistent fatigue, performance decline, mood changes, increased injury rate, sleep disturbances. Treatment: reduce intensity, rest, nutrition.`
  },
  {
    id: "medications-general",
    topic: "Medications & Drug Safety",
    keywords: ["medication", "medicine", "drug", "prescription", "overdose", "dosage", "side effects", "antibiotics", "painkillers", "ibuprofen", "acetaminophen", "aspirin"],
    content: `OTC Pain Relievers: Acetaminophen (Tylenol) — safe for liver when used as directed (max 3-4g/day adults, less with alcohol/liver disease); doesn't reduce inflammation. Ibuprofen (Advil/Motrin)/Naproxen — NSAIDs; reduce inflammation but risk GI issues, kidney/cardiovascular effects with long-term use; avoid in pregnancy.

Antibiotics: ONLY for bacterial infections. Never use for viral infections (colds, flu). Complete full course to prevent antibiotic resistance. Common side effects: GI upset, diarrhea, yeast infections.

Medication Safety: Store as directed (temperature, light). Check expiration dates. Never share prescriptions. Inform all healthcare providers of ALL medications/supplements to avoid interactions.

Drug Interactions: Always check interactions when taking multiple medications. Warfarin (blood thinner) interacts with many medications and foods (vitamin K). Grapefruit juice inhibits drug metabolism for many medications.

Supplement Safety: "Natural" doesn't mean safe — herbal supplements can interact with medications (St. John's Wort + antidepressants; ginkgo + blood thinners). Discuss with healthcare provider.`
  },
  {
    id: "first-aid",
    topic: "First Aid & Emergency Situations",
    keywords: ["first aid", "emergency", "wound", "bleeding", "burn", "choking", "CPR", "fracture", "sprain", "allergic reaction", "anaphylaxis", "seizure", "poison"],
    content: `CPR (Basic): Check scene safety, check responsiveness (tap shoulders, shout). Call 911. If not breathing normally: 30 chest compressions (2-2.4 inches deep, 100-120/min) + 2 rescue breaths. Repeat until help arrives or AED available.

Choking: Adult/child conscious: 5 back blows + 5 abdominal thrusts (Heimlich maneuver). Infant: 5 back blows + 5 chest thrusts. If unconscious: CPR.

Severe Allergic Reaction (Anaphylaxis): Signs: hives, swelling (face/throat), difficulty breathing, drop in blood pressure, dizziness. Treatment: epinephrine auto-injector (EpiPen) immediately + call 911. Second dose may be needed after 5-15 min.

Burns: Cool with running cool water 10-20 min. Do NOT use ice, butter, or toothpaste. Cover with sterile non-stick dressing. Seek care for: larger than palm, on face/hands/feet/genitals/joints, third-degree (white/charred), chemical/electrical burns.

Bleeding: Apply firm direct pressure with clean cloth. Elevate if possible. Do NOT remove embedded objects. Seek emergency care for: uncontrolled bleeding, deep wounds, wounds to face/genitals, signs of infection.

Seizure: Do NOT restrain. Protect from injury, turn on side after movements stop. Time the seizure. Call 911 if: first seizure, lasts >5 min, person doesn't regain consciousness, person is injured, diabetic/pregnant.`
  },
  {
    id: "skin-conditions",
    topic: "Skin Health & Common Conditions",
    keywords: ["skin", "rash", "acne", "eczema", "psoriasis", "dermatitis", "hives", "sunburn", "mole", "itchy", "allergic skin", "dermatology"],
    content: `Acne: Caused by clogged pores, bacteria, excess oil, hormones. Treatment: benzoyl peroxide, salicylic acid (OTC); retinoids, antibiotics, hormonal therapy (Rx). Avoid picking. Non-comedogenic moisturizers and sunscreen. See dermatologist for moderate-severe acne.

Eczema (Atopic Dermatitis): Chronic inflammatory condition. Triggers: allergens, irritants, stress, temperature changes. Management: gentle moisturizers frequently, avoid hot water/harsh soaps, topical corticosteroids for flares, antihistamines for itch, avoiding triggers.

Skin Cancer Warning Signs (ABCDE): Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolving. Annual skin checks by dermatologist recommended. Use SPF 30+ broad-spectrum sunscreen daily, reapply every 2h outdoors, avoid tanning beds.

Common Rash Causes: Contact dermatitis (allergen/irritant), hives (urticaria, often allergic), ringworm (fungal, ring-shaped), viral rashes (heat rash in children). Seek care for rash with fever, spreading rapidly, or affecting breathing.`
  },
  {
    id: "womens-health",
    topic: "Women's Health",
    keywords: ["menstrual", "period", "pregnancy", "menopause", "PCOS", "endometriosis", "breast health", "contraception", "gynecology", "pelvic", "ovarian", "cervical"],
    content: `Menstrual Health: Average cycle 21-35 days, period 2-7 days. Heavy bleeding (changing pad/tampon every hour), severe pain, or irregular periods warrant medical evaluation. Conditions: PCOS (polycystic ovary syndrome), endometriosis, fibroids.

Pregnancy: Prenatal care starts as early as possible. Folic acid (400-800mcg) crucial before/during pregnancy to prevent neural tube defects. Avoid: alcohol (no safe amount), smoking, raw meat/fish, unpasteurized products, certain medications. Regular OB appointments critical.

Menopause: Natural end of menstrual cycles, average age 51. Symptoms: hot flashes, night sweats, vaginal dryness, mood changes, sleep disturbances. Management: hormone therapy (discuss risks/benefits with doctor), non-hormonal options (SSRIs, vaginal estrogen), lifestyle modifications.

Breast Health: Monthly self-exams, annual clinical exams. Mammography: start at 40-50 (varies by guideline/risk). See doctor for: new lumps, nipple discharge, skin changes, persistent breast pain.

Cervical Cancer Screening: Pap smear every 3 years (ages 21-65) or every 5 years with HPV co-test. HPV vaccine recommended through age 26 (can discuss up to 45 with doctor).`
  },
  {
    id: "mens-health",
    topic: "Men's Health",
    keywords: ["prostate", "testosterone", "erectile dysfunction", "men's health", "testicular", "male health", "sexual health men"],
    content: `Prostate Health: Prostate-specific antigen (PSA) screening discussion with doctor starting at 50 (45 for high-risk: African American men, family history). Benign prostatic hyperplasia (BPH) common with aging — symptoms: urinary frequency/urgency, weak stream. Prostate cancer: often slow-growing; treatment options include active surveillance, surgery, radiation, hormone therapy.

Testicular Cancer: Most common cancer in young men (15-35). Monthly self-exams recommended. Signs: painless lump/swelling, feeling of heaviness. Highly treatable when caught early.

Testosterone: Levels decline naturally ~1-2%/year after 30. Low T symptoms: fatigue, decreased libido, mood changes, decreased muscle mass. Diagnosis requires blood test. Treatment: lifestyle (exercise, sleep, weight management) first; testosterone replacement therapy only for documented deficiency with symptoms.

Erectile Dysfunction: Common, especially with age. Often has underlying cause: cardiovascular disease, diabetes, hypertension, medications, psychological factors. See doctor — may be indicator of broader health issues. Treatments: PDE5 inhibitors (sildenafil/Cialis), lifestyle changes, addressing underlying conditions.`
  },
  {
    id: "digestive-health",
    topic: "Digestive Health & GI Issues",
    keywords: ["digestion", "stomach", "gut", "IBS", "bloating", "constipation", "diarrhea", "acid reflux", "GERD", "nausea", "vomiting", "gastritis", "bowel"],
    content: `Acid Reflux / GERD: Heartburn, regurgitation, chest discomfort. Triggers: fatty/spicy foods, caffeine, alcohol, chocolate, lying down after eating, large meals, obesity. Management: avoid triggers, eat smaller meals, wait 2-3h before lying down, elevate head of bed, antacids/H2 blockers/PPIs.

IBS (Irritable Bowel Syndrome): Functional GI disorder. Symptoms: abdominal pain/cramping, bloating, altered bowel habits (diarrhea, constipation, or both). Triggers: stress, certain foods, hormonal changes. Management: dietary changes (low-FODMAP diet), stress management, fiber (for constipation-predominant), antispasmodics.

Constipation: <3 bowel movements/week, straining, hard stools. Treatment: increase fiber (25-38g/day), hydration (8+ glasses water), exercise, establish routine. OTC: fiber supplements, osmotic laxatives (MiraLAX). Avoid long-term stimulant laxative use.

Diarrhea: Loose stools >3x/day. Usually self-limiting (1-3 days). Key: stay hydrated (water, electrolyte solutions). BRAT diet (bananas, rice, applesauce, toast) can help. Seek care if: blood in stool, high fever, lasts >2 days, signs of dehydration.`
  },
  {
    id: "allergy-asthma",
    topic: "Allergies & Asthma",
    keywords: ["allergy", "allergic", "asthma", "pollen", "dust", "mold", "pet dander", "wheeze", "breathe", "inhaler", "antihistamine", "anaphylaxis", "food allergy"],
    content: `Seasonal Allergies (Hay Fever): Triggered by pollen (trees/grass/weeds), mold, dust mites, pet dander. Symptoms: sneezing, runny nose, itchy/watery eyes, nasal congestion. Treatment: antihistamines (loratadine, cetirizine, fexofenadine), nasal corticosteroids (most effective), decongestants, allergy immunotherapy (shots/sublingual).

Asthma: Chronic airway inflammation causing wheezing, chest tightness, shortness of breath, cough (often worse at night/early morning). Triggers: allergens, exercise, cold air, infections, irritants. Treatment: quick-relief (short-acting beta-agonists/albuterol) for acute symptoms; controller medications (inhaled corticosteroids) for persistent asthma.

Asthma Action Plan: Green (peak flow >80%): normal activities, daily controller medication. Yellow (50-80%): caution, use reliever inhaler, contact doctor if not improving. Red (<50%): medical emergency, use reliever, seek emergency care.

Food Allergies: Most common: peanuts, tree nuts, milk, eggs, wheat, soy, fish, shellfish. Symptoms range from hives/GI upset to anaphylaxis. Management: strict avoidance, carry epinephrine auto-injector if risk of anaphylaxis. Read labels carefully.`
  },
  {
    id: "pediatric-health",
    topic: "Children's Health & Pediatrics",
    keywords: ["child", "baby", "infant", "pediatric", "fever child", "vaccination", "immunization", "growth", "development", "childhood illness"],
    content: `Childhood Fever: Fever is body's immune response. When to worry: under 3 months ANY fever (rectal temp ≥100.4°F/38°C) → immediate medical care. 3-36 months: fever ≥102°F lasting >2 days, or any fever with concerning symptoms. Older children: fever ≥104°F, lasts >3 days, or with stiff neck/rash/difficulty breathing. Treatment: acetaminophen/ibuprofen (ibuprofen only ≥6 months), cool compress, fluids. Never aspirin (Reye's syndrome risk).

Vaccinations: Follow recommended schedule (CDC, AAP). Vaccines are safe and crucial for preventing measles, whooping cough, meningitis, HPV cancers, etc. Side effects (soreness, low-grade fever) are normal immune responses.

Common Childhood Illnesses: Ear infections (otitis media) — most common reason for pediatric antibiotics; often viral. Hand-foot-mouth disease — viral, self-limiting, painful mouth sores/rash. Croup — barky cough, stridor, usually viral. Cool-mist humidifier, cool air, comfort; severe: ER.

Child Safety: Car seats (rear-facing until age 2+, forward-facing until 4+, booster until 8-12). Never leave child in hot car. Pool safety, helmet use, childproofing home. Choking hazards: avoid for under-4s.`
  }
];

/**
 * RAG Retrieval: Find the most relevant knowledge documents for a user query.
 * Uses TF-IDF-inspired keyword matching + topic relevance scoring.
 */
export function retrieveRelevantContext(query: string, topK: number = 3): string {
  const queryLower = query.toLowerCase();
  const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 2);

  const scored = MEDICAL_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    
    // Score based on keyword matches (weighted heavily)
    for (const keyword of doc.keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        // Exact multi-word keyword match scores higher
        score += keyword.includes(' ') ? 4 : 2;
      }
      // Partial token match
      for (const token of queryTokens) {
        if (keyword.toLowerCase().includes(token)) {
          score += 0.5;
        }
      }
    }

    // Score based on topic match
    if (queryLower.includes(doc.topic.toLowerCase())) {
      score += 5;
    }
    for (const token of queryTokens) {
      if (doc.topic.toLowerCase().includes(token)) {
        score += 1;
      }
    }

    // Score based on content word presence
    const contentLower = doc.content.toLowerCase();
    for (const token of queryTokens) {
      if (contentLower.includes(token)) {
        score += 0.3;
      }
    }

    return { doc, score };
  });

  // Sort by relevance score, get top K
  const topDocs = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(item => item.score > 0);

  if (topDocs.length === 0) {
    return "";
  }

  // Format retrieved context for LLM injection
  return topDocs
    .map(({ doc }) => `[Medical Reference: ${doc.topic}]\n${doc.content}`)
    .join("\n\n---\n\n");
}
