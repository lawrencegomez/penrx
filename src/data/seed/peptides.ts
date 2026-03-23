// ============================================
// PenRx Peptide Library Seed Data
// 10 Tier 1 peptides with complete profiles
// ============================================

import {
  type Peptide,
  PeptideCategory,
  RegulatoryStatus,
  SideEffectFrequency,
  SideEffectSeverity,
} from '../types';

export const seedPeptides: Peptide[] = [
  {
    id: 'bpc-157',
    name: 'BPC-157',
    alternateNames: ['Body Protection Compound-157', 'Bepecin'],
    slug: 'bpc-157',
    category: PeptideCategory.HEALING_RECOVERY,
    shortDescription: 'A healing peptide researched for gut health, tissue repair, and tendon/ligament recovery.',
    fullDescription:
      'BPC-157 (Body Protection Compound-157) is a synthetic peptide consisting of 15 amino acids derived from a protective protein found in human gastric juice. It has been extensively studied in animal models for its regenerative and protective properties across multiple organ systems, including the gastrointestinal tract, musculoskeletal system, and nervous system. Research suggests it accelerates wound healing, protects against NSAID-induced gut damage, and promotes tendon and ligament repair through upregulation of growth hormone receptors and nitric oxide pathways.',
    commonProtocols: [
      {
        dosingRange: '200–500 mcg',
        frequency: '1–2 times daily',
        route: 'Subcutaneous injection',
        duration: '4–6 weeks, with breaks between cycles',
        notes: 'Injection near the site of injury is commonly reported in research protocols.',
        source: 'Published preclinical studies',
      },
    ],
    reconstitutionGuide:
      'Reconstitute with bacteriostatic water. A common approach: add 2 mL BAC water to a 5 mg vial, yielding a concentration of 250 mcg per 0.1 mL (10 units on an insulin syringe). Inject BAC water slowly along the side of the vial. Gently swirl — never shake.',
    storage: {
      temperature: 'Refrigerate at 36–46°F (2–8°C) after reconstitution',
      lightSensitivity: true,
      shelfLife: '28–30 days after reconstitution; lyophilized powder is shelf-stable at room temperature for up to 2 years',
    },
    halfLife: {
      value: '~4',
      unit: 'hours',
      source: 'Preclinical pharmacokinetic data',
    },
    sideEffects: [
      { name: 'Injection site redness', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
      { name: 'Nausea (if taken orally)', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
      { name: 'Dizziness', frequency: SideEffectFrequency.RARE, severity: SideEffectSeverity.MILD },
    ],
    stackingPartners: [
      { peptideId: 'tb-500', peptideName: 'TB-500', notes: 'Frequently combined for synergistic tissue healing — BPC-157 targets localized repair while TB-500 provides systemic anti-inflammatory support.' },
    ],
    regulatoryStatus: RegulatoryStatus.RESEARCH,
    sources: [
      { title: 'BPC-157: Pharmacological Review', url: 'https://pubmed.ncbi.nlm.nih.gov/29898966/', type: 'pubmed' },
      { title: 'Tissue healing properties of BPC 157', url: 'https://pubmed.ncbi.nlm.nih.gov/21030672/', type: 'pubmed' },
    ],
    tags: ['healing', 'recovery', 'gut health', 'tendon', 'ligament', 'tissue repair', 'anti-inflammatory'],
  },
  {
    id: 'tb-500',
    name: 'TB-500',
    alternateNames: ['Thymosin Beta-4 Fragment', 'Tβ4'],
    slug: 'tb-500',
    category: PeptideCategory.HEALING_RECOVERY,
    shortDescription: 'A systemic tissue repair peptide researched for anti-inflammatory and wound healing properties.',
    fullDescription:
      'TB-500 is a synthetic version of the naturally occurring peptide Thymosin Beta-4 (Tβ4), a 43-amino acid protein that plays a critical role in tissue repair, cell migration, and angiogenesis. Research has shown it promotes healing across multiple tissue types including muscle, tendon, ligament, skin, and cardiac tissue. It works by upregulating actin, a cell-building protein involved in cell migration and proliferation, and has significant anti-inflammatory properties.',
    commonProtocols: [
      {
        dosingRange: '2–5 mg',
        frequency: '2 times per week (loading phase), then 1 time per week (maintenance)',
        route: 'Subcutaneous injection',
        duration: 'Loading: 4–6 weeks, then maintenance as needed',
        notes: 'Due to its systemic action, injection site location is less critical than with BPC-157.',
        source: 'Published research protocols',
      },
    ],
    reconstitutionGuide:
      'Reconstitute with bacteriostatic water. Add 2 mL BAC water to a 5 mg vial. This yields 250 mcg per 0.1 mL. For typical doses of 2–5 mg, draw 0.8–2 mL per injection. Larger vials (10 mg) may be more practical.',
    storage: {
      temperature: 'Refrigerate at 36–46°F (2–8°C) after reconstitution',
      lightSensitivity: false,
      shelfLife: '28 days after reconstitution',
    },
    halfLife: {
      value: '~6',
      unit: 'hours',
      source: 'Preclinical data',
    },
    sideEffects: [
      { name: 'Injection site irritation', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
      { name: 'Head rush or lightheadedness', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
      { name: 'Lethargy', frequency: SideEffectFrequency.RARE, severity: SideEffectSeverity.MILD },
    ],
    stackingPartners: [
      { peptideId: 'bpc-157', peptideName: 'BPC-157', notes: 'The classic healing stack — TB-500 for systemic anti-inflammatory action paired with BPC-157 for localized tissue repair.' },
    ],
    regulatoryStatus: RegulatoryStatus.RESEARCH,
    sources: [
      { title: 'Thymosin Beta-4 and tissue repair', url: 'https://pubmed.ncbi.nlm.nih.gov/20398187/', type: 'pubmed' },
    ],
    tags: ['healing', 'recovery', 'anti-inflammatory', 'tissue repair', 'wound healing', 'muscle repair'],
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    alternateNames: ['Ipamorelin Acetate'],
    slug: 'ipamorelin',
    category: PeptideCategory.GH_SECRETAGOGUE,
    shortDescription: 'A selective growth hormone secretagogue researched for body composition and sleep quality.',
    fullDescription:
      'Ipamorelin is a selective growth hormone releasing peptide (GHRP) that stimulates growth hormone release from the pituitary without significantly affecting cortisol, prolactin, or aldosterone levels. This selectivity makes it one of the mildest GH peptides in terms of side effects. Research has investigated its effects on body composition, bone density, sleep quality, and general anti-aging parameters. It works by mimicking ghrelin and binding to ghrelin receptors in the pituitary.',
    commonProtocols: [
      {
        dosingRange: '100–300 mcg',
        frequency: '1–3 times daily (commonly before bed)',
        route: 'Subcutaneous injection',
        duration: '8–12 weeks, with cycling recommended',
        notes: 'Best administered on an empty stomach. Avoid food 30 min before and after injection for optimal GH pulse.',
        source: 'Published clinical studies',
      },
    ],
    reconstitutionGuide:
      'Reconstitute with bacteriostatic water. Add 2 mL BAC water to a 5 mg vial for a concentration of 250 mcg per 0.1 mL (10 units). Inject slowly along the side of the vial.',
    storage: {
      temperature: 'Refrigerate at 36–46°F (2–8°C) after reconstitution',
      lightSensitivity: true,
      shelfLife: '28 days after reconstitution',
    },
    halfLife: {
      value: '~2',
      unit: 'hours',
      source: 'Clinical pharmacokinetic data',
    },
    sideEffects: [
      { name: 'Tingling or numbness (water retention)', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
      { name: 'Increased hunger', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
      { name: 'Headache', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
    ],
    stackingPartners: [
      { peptideId: 'cjc-1295', peptideName: 'CJC-1295', notes: 'The most popular GH stack — Ipamorelin (GHRP) + CJC-1295 (GHRH) for amplified growth hormone release.' },
    ],
    regulatoryStatus: RegulatoryStatus.RESEARCH,
    sources: [
      { title: 'Ipamorelin: safety and tolerability study', url: 'https://pubmed.ncbi.nlm.nih.gov/9849822/', type: 'pubmed' },
    ],
    tags: ['growth hormone', 'GH', 'body composition', 'sleep', 'anti-aging', 'GHRP'],
  },
  {
    id: 'cjc-1295',
    name: 'CJC-1295',
    alternateNames: ['CJC-1295 with DAC', 'CJC-1295 no DAC (Mod GRF 1-29)', 'Modified GRF 1-29'],
    slug: 'cjc-1295',
    category: PeptideCategory.GH_SECRETAGOGUE,
    shortDescription: 'A growth hormone releasing hormone analog available in two forms — with and without DAC.',
    fullDescription:
      'CJC-1295 is a synthetic analog of growth hormone releasing hormone (GHRH) that stimulates growth hormone release from the pituitary. It comes in two forms: CJC-1295 with DAC (Drug Affinity Complex) has an extended half-life of ~8 days due to albumin binding, allowing weekly dosing; CJC-1295 without DAC (also known as Modified GRF 1-29) has a shorter half-life of ~30 minutes and creates more physiological GH pulses. Both are researched for their effects on body composition, recovery, and sleep quality.',
    commonProtocols: [
      {
        dosingRange: '100–300 mcg (no DAC)',
        frequency: '1–3 times daily',
        route: 'Subcutaneous injection',
        duration: '8–12 weeks',
        notes: 'No DAC version is typically dosed alongside Ipamorelin at bedtime.',
        source: 'Published research protocols',
      },
      {
        dosingRange: '1–2 mg (with DAC)',
        frequency: '1–2 times per week',
        route: 'Subcutaneous injection',
        duration: '8–12 weeks',
        notes: 'DAC version provides sustained GH elevation due to extended half-life.',
        source: 'Published research protocols',
      },
    ],
    reconstitutionGuide:
      'Add 2 mL BAC water to a 5 mg vial (no DAC) for 250 mcg per 0.1 mL. For DAC version, add 2 mL to a 2 mg vial for 100 mcg per 0.1 mL.',
    storage: {
      temperature: 'Refrigerate at 36–46°F (2–8°C) after reconstitution',
      lightSensitivity: true,
      shelfLife: '28 days after reconstitution',
    },
    halfLife: {
      value: '~30 min (no DAC) / ~8 days (with DAC)',
      unit: 'varies',
      source: 'Published pharmacokinetic studies',
    },
    sideEffects: [
      { name: 'Water retention', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
      { name: 'Flushing', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
      { name: 'Tingling in extremities', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
    ],
    stackingPartners: [
      { peptideId: 'ipamorelin', peptideName: 'Ipamorelin', notes: 'The gold-standard GH combo — CJC-1295 (GHRH) amplifies Ipamorelin (GHRP) for synergistic growth hormone release.' },
    ],
    regulatoryStatus: RegulatoryStatus.RESEARCH,
    sources: [
      { title: 'CJC-1295 pharmacokinetic profile', url: 'https://pubmed.ncbi.nlm.nih.gov/16352683/', type: 'pubmed' },
    ],
    tags: ['growth hormone', 'GH', 'GHRH', 'body composition', 'recovery', 'sleep', 'anti-aging'],
  },
  {
    id: 'semaglutide',
    name: 'Semaglutide',
    alternateNames: ['Ozempic', 'Wegovy', 'Rybelsus'],
    slug: 'semaglutide',
    category: PeptideCategory.GLP1,
    shortDescription: 'An FDA-approved GLP-1 receptor agonist for weight management and type 2 diabetes.',
    fullDescription:
      'Semaglutide is a glucagon-like peptide-1 (GLP-1) receptor agonist that mimics the incretin hormone GLP-1. It slows gastric emptying, reduces appetite, and improves insulin sensitivity. FDA-approved as Ozempic (0.5–2 mg weekly) for type 2 diabetes and as Wegovy (up to 2.4 mg weekly) for chronic weight management. Clinical trials (STEP and SUSTAIN programs) demonstrated average weight loss of 12–17% of body weight over 68 weeks. It is one of the most extensively studied compounds in the GLP-1 class.',
    commonProtocols: [
      {
        dosingRange: '0.25 mg → titrate to 2.4 mg',
        frequency: 'Once weekly',
        route: 'Subcutaneous injection',
        duration: 'Ongoing (chronic use)',
        notes: 'Standard titration: 0.25 mg weeks 1–4 → 0.5 mg weeks 5–8 → 1.0 mg weeks 9–12 → 1.7 mg weeks 13–16 → 2.4 mg maintenance.',
        source: 'FDA prescribing information (Wegovy)',
      },
    ],
    reconstitutionGuide:
      'Semaglutide is typically supplied in pre-filled pens (Ozempic/Wegovy) that do not require reconstitution. If using compounded lyophilized semaglutide, follow the compounding pharmacy\'s specific reconstitution instructions for that batch.',
    storage: {
      temperature: 'Refrigerate at 36–46°F (2–8°C). In-use pens can be stored at room temperature (59–86°F) for up to 56 days.',
      lightSensitivity: false,
      shelfLife: 'Pre-filled pens: 56 days after first use; compounded: 28 days after reconstitution',
    },
    halfLife: {
      value: '~7',
      unit: 'days',
      source: 'FDA-approved prescribing information',
    },
    sideEffects: [
      { name: 'Nausea', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MODERATE },
      { name: 'Vomiting/diarrhea', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MODERATE },
      { name: 'Constipation', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
      { name: 'Injection site reaction', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
      { name: 'Fatigue', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
    ],
    stackingPartners: [],
    regulatoryStatus: RegulatoryStatus.FDA_APPROVED,
    sources: [
      { title: 'STEP 1 Trial (Wegovy)', url: 'https://pubmed.ncbi.nlm.nih.gov/33567185/', type: 'pubmed' },
      { title: 'FDA Wegovy Approval', url: 'https://www.fda.gov/news-events/press-announcements/fda-approves-new-drug-treatment-chronic-weight-management', type: 'fda' },
    ],
    tags: ['GLP-1', 'weight loss', 'appetite', 'diabetes', 'FDA approved', 'ozempic', 'wegovy'],
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    alternateNames: ['Mounjaro', 'Zepbound'],
    slug: 'tirzepatide',
    category: PeptideCategory.GLP1,
    shortDescription: 'An FDA-approved dual GLP-1/GIP agonist for weight management and type 2 diabetes.',
    fullDescription:
      'Tirzepatide is a first-in-class dual glucose-dependent insulinotropic polypeptide (GIP) and GLP-1 receptor agonist. By targeting both incretin receptors, it achieves superior glycemic control and weight loss compared to single-agonist therapies. FDA-approved as Mounjaro for type 2 diabetes and Zepbound for chronic weight management. The SURMOUNT-1 trial demonstrated up to 22.5% body weight reduction at the highest dose (15 mg weekly) — the largest weight loss achieved by any pharmaceutical in clinical trials at the time of approval.',
    commonProtocols: [
      {
        dosingRange: '2.5 mg → titrate to 15 mg',
        frequency: 'Once weekly',
        route: 'Subcutaneous injection',
        duration: 'Ongoing',
        notes: 'Titration: 2.5 mg weeks 1–4 → 5 mg weeks 5–8 → 7.5 mg → 10 mg → 12.5 mg → 15 mg. Each step lasts ≥4 weeks.',
        source: 'FDA prescribing information (Mounjaro)',
      },
    ],
    reconstitutionGuide:
      'Available in pre-filled single-dose pens. No reconstitution required for brand-name products. For compounded versions, follow pharmacy-specific instructions.',
    storage: {
      temperature: 'Refrigerate at 36–46°F (2–8°C). Can be stored at room temperature (up to 86°F) for up to 21 days.',
      lightSensitivity: false,
      shelfLife: 'Pre-filled pens: use by expiration date; compounded: 28 days after reconstitution',
    },
    halfLife: {
      value: '~5',
      unit: 'days',
      source: 'FDA-approved prescribing information',
    },
    sideEffects: [
      { name: 'Nausea', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MODERATE },
      { name: 'Diarrhea', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MODERATE },
      { name: 'Decreased appetite', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
      { name: 'Abdominal pain', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
    ],
    stackingPartners: [],
    regulatoryStatus: RegulatoryStatus.FDA_APPROVED,
    sources: [
      { title: 'SURMOUNT-1 Trial', url: 'https://pubmed.ncbi.nlm.nih.gov/35658024/', type: 'pubmed' },
      { title: 'FDA Zepbound Approval', url: 'https://www.fda.gov/news-events/press-announcements/fda-approves-new-medication-chronic-weight-management', type: 'fda' },
    ],
    tags: ['GLP-1', 'GIP', 'weight loss', 'diabetes', 'FDA approved', 'mounjaro', 'zepbound'],
  },
  {
    id: 'retatrutide',
    name: 'Retatrutide',
    alternateNames: ['LY3437943'],
    slug: 'retatrutide',
    category: PeptideCategory.GLP1,
    shortDescription: 'An investigational triple-agonist (GLP-1/GIP/glucagon) showing strong weight loss in trials.',
    fullDescription:
      'Retatrutide is a novel triple hormone receptor agonist targeting GLP-1, GIP, and glucagon receptors simultaneously. This triple mechanism is designed to maximize metabolic effects: GLP-1 and GIP reduce appetite and improve insulin sensitivity, while glucagon receptor activation increases energy expenditure and promotes lipolysis. Phase 2 trial results demonstrated unprecedented weight loss of up to 24% of body weight over 48 weeks at the 12 mg dose. It is currently in Phase 3 clinical trials and is one of the most anticipated compounds in the metabolic drug pipeline.',
    commonProtocols: [
      {
        dosingRange: '1–12 mg (titrated)',
        frequency: 'Once weekly',
        route: 'Subcutaneous injection',
        duration: 'Ongoing (clinical trial protocols)',
        notes: 'Phase 2 trial used escalating doses from 1 mg to target doses of 4, 8, or 12 mg over multiple weeks.',
        source: 'Phase 2 clinical trial data (TRIUMPH-2)',
      },
    ],
    reconstitutionGuide:
      'Not commercially available. Research supply may require reconstitution per lab-specific instructions. If lyophilized, standard BAC water reconstitution applies.',
    storage: {
      temperature: 'Refrigerate at 36–46°F (2–8°C)',
      lightSensitivity: true,
      shelfLife: '28 days after reconstitution (estimated based on similar compounds)',
    },
    halfLife: {
      value: '~6',
      unit: 'days',
      source: 'Phase 2 clinical trial data',
    },
    sideEffects: [
      { name: 'Nausea', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MODERATE },
      { name: 'Diarrhea', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
      { name: 'Vomiting', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MODERATE },
      { name: 'Decreased appetite', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
    ],
    stackingPartners: [],
    regulatoryStatus: RegulatoryStatus.INVESTIGATIONAL,
    sources: [
      { title: 'Retatrutide Phase 2 Trial', url: 'https://pubmed.ncbi.nlm.nih.gov/37385275/', type: 'pubmed' },
      { title: 'ClinicalTrials.gov: Retatrutide', url: 'https://clinicaltrials.gov/search?term=retatrutide', type: 'clinicaltrials' },
    ],
    tags: ['GLP-1', 'GIP', 'glucagon', 'weight loss', 'triple agonist', 'investigational'],
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    alternateNames: ['Egrifta', 'Egrifta SV'],
    slug: 'tesamorelin',
    category: PeptideCategory.GH_SECRETAGOGUE,
    shortDescription: 'An FDA-approved GHRH analog researched for visceral fat reduction.',
    fullDescription:
      'Tesamorelin is a synthetic analog of growth hormone-releasing hormone (GHRH) that stimulates the pituitary to produce and release growth hormone. It is FDA-approved under the brand name Egrifta for the reduction of excess abdominal fat (lipodystrophy) in HIV-infected patients. Unlike exogenous GH administration, tesamorelin preserves the body\'s natural GH feedback axis. Research has also explored its effects on cognitive function, liver fat reduction (NAFLD), and general body composition in non-HIV populations.',
    commonProtocols: [
      {
        dosingRange: '2 mg',
        frequency: 'Once daily',
        route: 'Subcutaneous injection (abdomen)',
        duration: 'Ongoing; clinical trials ran 26–52 weeks',
        notes: 'Inject into the abdomen. Rotate injection sites. Administer at the same time each day.',
        source: 'FDA prescribing information (Egrifta)',
      },
    ],
    reconstitutionGuide:
      'Egrifta comes with sterile water for reconstitution. For compounded versions: add 2 mL BAC water to a 2 mg vial for 100 mcg per 0.1 mL.',
    storage: {
      temperature: 'Refrigerate at 36–46°F (2–8°C). After reconstitution, use immediately or refrigerate and use within 24 hours.',
      lightSensitivity: true,
      shelfLife: 'Reconstituted: use within 24 hours (brand); 28 days (compounded with BAC water)',
    },
    halfLife: {
      value: '26–38',
      unit: 'minutes',
      source: 'FDA-approved pharmacokinetic data',
    },
    sideEffects: [
      { name: 'Injection site reactions (redness, itching)', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
      { name: 'Joint pain', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
      { name: 'Peripheral edema', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
      { name: 'Muscle pain', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
    ],
    stackingPartners: [
      { peptideId: 'ipamorelin', peptideName: 'Ipamorelin', notes: 'Tesamorelin (GHRH) + Ipamorelin (GHRP) can be combined for enhanced GH release, similar to CJC-1295/Ipamorelin stacks.' },
    ],
    regulatoryStatus: RegulatoryStatus.FDA_APPROVED,
    sources: [
      { title: 'FDA Egrifta Approval', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/022505s010lbl.pdf', type: 'fda' },
      { title: 'Tesamorelin effects on visceral adiposity', url: 'https://pubmed.ncbi.nlm.nih.gov/20519383/', type: 'pubmed' },
    ],
    tags: ['growth hormone', 'GHRH', 'visceral fat', 'body composition', 'FDA approved', 'lipodystrophy'],
  },
  {
    id: 'ghk-cu',
    name: 'GHK-Cu',
    alternateNames: ['Copper Peptide GHK-Cu', 'Glycyl-L-histidyl-L-lysine copper'],
    slug: 'ghk-cu',
    category: PeptideCategory.ANTI_AGING,
    shortDescription: 'A copper peptide researched for skin regeneration, wound healing, and anti-aging.',
    fullDescription:
      'GHK-Cu is a naturally occurring copper-binding tripeptide (glycyl-L-histidyl-L-lysine) found in human plasma, saliva, and urine. Its concentration in plasma decreases significantly with age (from ~200 ng/mL at age 20 to ~80 ng/mL at age 60). Research has demonstrated its ability to stimulate collagen synthesis, accelerate wound healing, increase the production of glycosaminoglycans, promote angiogenesis, and modulate gene expression toward a healthier, more youthful pattern. It also has antioxidant and anti-inflammatory properties.',
    commonProtocols: [
      {
        dosingRange: '1–2 mg',
        frequency: 'Once daily',
        route: 'Subcutaneous injection or topical application',
        duration: '4–8 weeks',
        notes: 'Also available in topical formulations (creams, serums) for skin-specific applications.',
        source: 'Published research literature',
      },
    ],
    reconstitutionGuide:
      'Add 1 mL BAC water to a 50 mg vial for 5 mg per 0.1 mL. For lower doses, add 2 mL for 2.5 mg per 0.1 mL. The solution will have a characteristic blue tint from the copper ion.',
    storage: {
      temperature: 'Refrigerate at 36–46°F (2–8°C) after reconstitution',
      lightSensitivity: true,
      shelfLife: '28 days after reconstitution',
    },
    halfLife: {
      value: '~1',
      unit: 'hour',
      source: 'Research literature',
    },
    sideEffects: [
      { name: 'Injection site redness', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
      { name: 'Mild skin irritation (topical)', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
    ],
    stackingPartners: [
      { peptideId: 'bpc-157', peptideName: 'BPC-157', notes: 'GHK-Cu for skin and systemic anti-aging + BPC-157 for tissue repair — complementary healing mechanisms.' },
    ],
    regulatoryStatus: RegulatoryStatus.RESEARCH,
    sources: [
      { title: 'GHK-Cu and tissue remodeling', url: 'https://pubmed.ncbi.nlm.nih.gov/25916515/', type: 'pubmed' },
      { title: 'Gene expression effects of GHK', url: 'https://pubmed.ncbi.nlm.nih.gov/24508075/', type: 'pubmed' },
    ],
    tags: ['anti-aging', 'skin', 'collagen', 'copper peptide', 'wound healing', 'regeneration'],
  },
  {
    id: 'pt-141',
    name: 'PT-141',
    alternateNames: ['Bremelanotide', 'Vyleesi'],
    slug: 'pt-141',
    category: PeptideCategory.SEXUAL_HEALTH,
    shortDescription: 'An FDA-approved melanocortin receptor agonist researched for sexual dysfunction.',
    fullDescription:
      'PT-141 (Bremelanotide) is a synthetic melanocortin receptor agonist, specifically targeting MC3R and MC4R receptors in the central nervous system. Unlike PDE5 inhibitors (Viagra, Cialis) that work on blood flow, PT-141 works through central nervous system pathways involved in sexual arousal and desire. It is FDA-approved under the brand name Vyleesi for premenopausal women with acquired, generalized hypoactive sexual desire disorder (HSDD). Research has also investigated its effects on male sexual dysfunction and erectile function.',
    commonProtocols: [
      {
        dosingRange: '0.5–2 mg',
        frequency: 'As needed, at least 45 minutes before anticipated sexual activity',
        route: 'Subcutaneous injection (abdomen or thigh)',
        duration: 'As needed; not more than once every 24 hours',
        notes: 'Maximum 8 doses per month per FDA labeling. May cause nausea — start at lower dose.',
        source: 'FDA prescribing information (Vyleesi)',
      },
    ],
    reconstitutionGuide:
      'Vyleesi comes in pre-filled autoinjectors. For compounded lyophilized PT-141: add 2 mL BAC water to a 10 mg vial for 500 mcg per 0.1 mL.',
    storage: {
      temperature: 'Room temperature (68–77°F / 20–25°C) for pre-filled injectors. Refrigerate compounded versions.',
      lightSensitivity: true,
      shelfLife: 'Pre-filled: use by expiration date; compounded: 28 days after reconstitution',
    },
    halfLife: {
      value: '~2.7',
      unit: 'hours',
      source: 'FDA-approved pharmacokinetic data',
    },
    sideEffects: [
      { name: 'Nausea', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MODERATE },
      { name: 'Flushing', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
      { name: 'Headache', frequency: SideEffectFrequency.OCCASIONAL, severity: SideEffectSeverity.MILD },
      { name: 'Injection site reaction', frequency: SideEffectFrequency.COMMON, severity: SideEffectSeverity.MILD },
    ],
    stackingPartners: [],
    regulatoryStatus: RegulatoryStatus.FDA_APPROVED,
    sources: [
      { title: 'FDA Vyleesi Approval', url: 'https://www.fda.gov/news-events/press-announcements/fda-approves-new-treatment-hypoactive-sexual-desire-disorder-premenopausal-women', type: 'fda' },
      { title: 'Bremelanotide clinical efficacy', url: 'https://pubmed.ncbi.nlm.nih.gov/27088305/', type: 'pubmed' },
    ],
    tags: ['sexual health', 'libido', 'melanocortin', 'FDA approved', 'bremelanotide', 'vyleesi'],
  },
];
