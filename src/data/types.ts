// ============================================
// PenRx Type Definitions
// All TypeScript interfaces and enums
// ============================================

// ---- Enums ----

export enum PeptideCategory {
  GLP1 = 'GLP1',
  GH_SECRETAGOGUE = 'GH_Secretagogue',
  HEALING_RECOVERY = 'Healing_Recovery',
  ANTI_AGING = 'Anti_Aging',
  SEXUAL_HEALTH = 'Sexual_Health',
  COGNITIVE = 'Cognitive',
  IMMUNE = 'Immune',
  HRT = 'HRT',
  OTHER = 'Other',
}

export const CATEGORY_LABELS: Record<PeptideCategory, string> = {
  [PeptideCategory.GLP1]: 'GLP-1 & Weight Loss',
  [PeptideCategory.GH_SECRETAGOGUE]: 'Growth Hormone',
  [PeptideCategory.HEALING_RECOVERY]: 'Healing & Recovery',
  [PeptideCategory.ANTI_AGING]: 'Anti-Aging',
  [PeptideCategory.SEXUAL_HEALTH]: 'Sexual Health',
  [PeptideCategory.COGNITIVE]: 'Cognitive',
  [PeptideCategory.IMMUNE]: 'Immune',
  [PeptideCategory.HRT]: 'HRT',
  [PeptideCategory.OTHER]: 'Other',
};

export enum RegulatoryStatus {
  FDA_APPROVED = 'FDA_Approved',
  CATEGORY_1 = 'Category_1',
  CATEGORY_2 = 'Category_2',
  INVESTIGATIONAL = 'Investigational',
  RESEARCH = 'Research',
}

export const REGULATORY_LABELS: Record<RegulatoryStatus, string> = {
  [RegulatoryStatus.FDA_APPROVED]: 'FDA Approved',
  [RegulatoryStatus.CATEGORY_1]: 'Category 1',
  [RegulatoryStatus.CATEGORY_2]: 'Category 2',
  [RegulatoryStatus.INVESTIGATIONAL]: 'Investigational',
  [RegulatoryStatus.RESEARCH]: 'Research Only',
};

export enum FrequencyPattern {
  DAILY = 'daily',
  TWICE_DAILY = 'twice_daily',
  EOD = 'eod',
  FIVE_ON_TWO_OFF = '5on2off',
  MWF = 'mwf',
  WEEKLY = 'weekly',
  TWICE_WEEKLY = 'twice_weekly',
  AS_NEEDED = 'as_needed',
  CUSTOM = 'custom',
}

export const FREQUENCY_LABELS: Record<FrequencyPattern, string> = {
  [FrequencyPattern.DAILY]: 'Daily',
  [FrequencyPattern.TWICE_DAILY]: 'Twice Daily',
  [FrequencyPattern.EOD]: 'Every Other Day',
  [FrequencyPattern.FIVE_ON_TWO_OFF]: '5 Days On / 2 Off',
  [FrequencyPattern.MWF]: 'Mon / Wed / Fri',
  [FrequencyPattern.WEEKLY]: 'Weekly',
  [FrequencyPattern.TWICE_WEEKLY]: 'Twice Weekly',
  [FrequencyPattern.AS_NEEDED]: 'As Needed',
  [FrequencyPattern.CUSTOM]: 'Custom',
};

export enum InjectionSite {
  ABDOMEN_LEFT = 'abdomen_left',
  ABDOMEN_RIGHT = 'abdomen_right',
  THIGH_LEFT = 'thigh_left',
  THIGH_RIGHT = 'thigh_right',
  ARM_LEFT = 'arm_left',
  ARM_RIGHT = 'arm_right',
  GLUTE_LEFT = 'glute_left',
  GLUTE_RIGHT = 'glute_right',
}

export const INJECTION_SITE_LABELS: Record<InjectionSite, string> = {
  [InjectionSite.ABDOMEN_LEFT]: 'Left Abdomen',
  [InjectionSite.ABDOMEN_RIGHT]: 'Right Abdomen',
  [InjectionSite.THIGH_LEFT]: 'Left Thigh',
  [InjectionSite.THIGH_RIGHT]: 'Right Thigh',
  [InjectionSite.ARM_LEFT]: 'Left Arm',
  [InjectionSite.ARM_RIGHT]: 'Right Arm',
  [InjectionSite.GLUTE_LEFT]: 'Left Glute',
  [InjectionSite.GLUTE_RIGHT]: 'Right Glute',
};

export enum SyringeType {
  U100 = 'U100',
  U50 = 'U50',
  U30 = 'U30',
}

export const SYRINGE_MAX_UNITS: Record<SyringeType, number> = {
  [SyringeType.U100]: 100,
  [SyringeType.U50]: 50,
  [SyringeType.U30]: 30,
};

export enum SideEffectSeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  RARE = 'rare',
}

export enum SideEffectFrequency {
  COMMON = 'common',
  OCCASIONAL = 'occasional',
  RARE = 'rare',
}

// ---- Peptide Library Types ----

export interface PeptideSideEffect {
  name: string;
  frequency: SideEffectFrequency;
  severity: SideEffectSeverity;
}

export interface PeptideProtocol {
  dosingRange: string;        // e.g., "200-500mcg"
  frequency: string;          // e.g., "1-2x daily"
  route: string;              // e.g., "Subcutaneous"
  duration: string;           // e.g., "4-6 weeks"
  notes?: string;
  source?: string;
}

export interface Citation {
  title: string;
  url: string;
  type: 'pubmed' | 'clinicaltrials' | 'fda' | 'review' | 'other';
}

export interface StackingPartner {
  peptideId: string;
  peptideName: string;
  notes: string;
}

export interface Peptide {
  id: string;
  name: string;
  alternateNames: string[];
  slug: string;
  category: PeptideCategory;
  shortDescription: string;
  fullDescription: string;
  commonProtocols: PeptideProtocol[];
  reconstitutionGuide: string;
  storage: {
    temperature: string;
    lightSensitivity: boolean;
    shelfLife: string;
  };
  halfLife: {
    value: string;
    unit: string;
    source?: string;
  };
  sideEffects: PeptideSideEffect[];
  stackingPartners: StackingPartner[];
  regulatoryStatus: RegulatoryStatus;
  sources: Citation[];
  imageUrl?: string;
  tags: string[];
}

// ---- Protocol Types ----

export interface Protocol {
  id: string;
  peptideId: string;
  peptideName: string;
  vialSizeMg: number;
  bacWaterMl: number;
  doseMcg: number;
  syringeType: SyringeType;
  concentrationMcgPerUnit: number;
  unitsToFill: number;
  frequency: FrequencyPattern;
  customDays?: number[];      // 0=Sun, 1=Mon, ... 6=Sat
  timesOfDay: string[];       // e.g., ["08:00", "20:00"]
  isActive: boolean;
  startDate: string;          // ISO date
  notes?: string;
  createdAt: string;          // ISO datetime
  updatedAt: string;
}

// ---- Dose Log Types ----

export interface DoseLog {
  id: string;
  protocolId: string;
  peptideId: string;
  peptideName: string;
  doseMcg: number;
  units: number;
  injectionSite: InjectionSite;
  scheduledTime?: string;     // ISO datetime
  loggedTime: string;         // ISO datetime
  notes?: string;
  createdAt: string;
}

// ---- Inventory Types ----

export interface InventoryItem {
  id: string;
  peptideId: string;
  peptideName: string;
  vialSizeMg: number;
  bacWaterMl: number;
  concentrationMcgPerUnit: number;
  dateReconstituted: string;  // ISO date
  expirationDate: string;     // ISO date
  totalDoses: number;
  dosesUsed: number;
  dosesRemaining: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

// ---- Reminder Types ----

export interface Reminder {
  id: string;
  protocolId: string;
  peptideName: string;
  doseMcg: number;
  frequency: FrequencyPattern;
  timesOfDay: string[];
  isEnabled: boolean;
  lastNotified?: string;      // ISO datetime
  createdAt: string;
}

// ---- User Profile Types ----

export interface UserProfile {
  id: string;
  displayName?: string;
  hasCompletedOnboarding: boolean;
  userType?: 'first_timer' | 'experienced' | 'exploring';
  hasAcceptedDisclaimer: boolean;
  notificationsEnabled: boolean;
  measurementUnit: 'imperial' | 'metric';
  darkMode: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Calculator Types ----

export interface CalculatorInputs {
  vialSizeMg: number | null;
  bacWaterMl: number | null;
  desiredDoseMcg: number | null;
  syringeType: SyringeType;
}

export interface CalculatorResults {
  concentrationMcgPerUnit: number;
  concentrationMcgPer01ml: number;
  unitsToFill: number;
  dosesPerVial: number;
  isValid: boolean;
  errors: string[];
}

// ---- Schedule Types ----

export interface ScheduledDose {
  id: string;
  protocolId: string;
  peptideName: string;
  doseMcg: number;
  units: number;
  scheduledTime: string;      // ISO datetime
  isCompleted: boolean;
  doseLogId?: string;
}
