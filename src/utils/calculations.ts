// ============================================
// PenRx Calculation Utilities
// Safety-critical — all dosing math lives here
// ============================================

import type { CalculatorInputs, CalculatorResults } from '../data/types';
import { SyringeType, SYRINGE_MAX_UNITS } from '../data/types';

/**
 * Calculate the concentration of a reconstituted peptide.
 * @param vialSizeMg - Amount of peptide in the vial (mg)
 * @param bacWaterMl - Amount of bacteriostatic water added (mL)
 * @returns Concentration in mcg per unit (on a U-100 syringe, 1 unit = 0.01 mL)
 */
export function calculateConcentration(vialSizeMg: number, bacWaterMl: number): number {
  if (vialSizeMg <= 0 || bacWaterMl <= 0) return 0;
  const totalMcg = vialSizeMg * 1000;
  // 1 mL = 100 units on a U-100 syringe
  const totalUnits = bacWaterMl * 100;
  return totalMcg / totalUnits;
}

/**
 * Calculate concentration in mcg per 0.1 mL (10 units on insulin syringe).
 */
export function calculateConcentrationPer01ml(vialSizeMg: number, bacWaterMl: number): number {
  return calculateConcentration(vialSizeMg, bacWaterMl) * 10;
}

/**
 * Calculate how many units to draw on the syringe for a desired dose.
 * @param desiredDoseMcg - Target dose in micrograms
 * @param vialSizeMg - Peptide vial size in mg
 * @param bacWaterMl - BAC water added in mL
 * @param syringeType - Type of syringe (U-100, U-50, U-30)
 * @returns Number of units to draw
 */
export function calculateUnitsToFill(
  desiredDoseMcg: number,
  vialSizeMg: number,
  bacWaterMl: number,
  syringeType: SyringeType = SyringeType.U100,
): number {
  if (desiredDoseMcg <= 0 || vialSizeMg <= 0 || bacWaterMl <= 0) return 0;

  const mcgPerUnit = calculateConcentration(vialSizeMg, bacWaterMl);
  if (mcgPerUnit <= 0) return 0;

  // For U-100 syringe: units = dose / concentration
  // For U-50 and U-30, the physical markings are different but each unit
  // represents the same volume (0.01 mL), so the math is the same.
  // The syringe type affects max capacity, not unit calculation.
  const units = desiredDoseMcg / mcgPerUnit;

  return Math.round(units * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate total doses available in a vial.
 */
export function calculateDosesPerVial(
  vialSizeMg: number,
  desiredDoseMcg: number,
): number {
  if (vialSizeMg <= 0 || desiredDoseMcg <= 0) return 0;
  const totalMcg = vialSizeMg * 1000;
  return Math.floor(totalMcg / desiredDoseMcg);
}

/**
 * Calculate days supply based on dosing frequency.
 * @param dosesPerVial - Number of doses in the vial
 * @param dosesPerDay - Number of doses per day (e.g., 1 for daily, 0.5 for EOD, etc.)
 * @returns Number of days the vial will last
 */
export function calculateDaysSupply(
  dosesPerVial: number,
  dosesPerDay: number,
): number {
  if (dosesPerVial <= 0 || dosesPerDay <= 0) return 0;
  return Math.floor(dosesPerVial / dosesPerDay);
}

/**
 * Full calculator: takes all inputs and returns all outputs with validation.
 */
export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const errors: string[] = [];

  const { vialSizeMg, bacWaterMl, desiredDoseMcg, syringeType } = inputs;

  // Validation
  if (vialSizeMg === null || vialSizeMg <= 0) {
    errors.push('Vial size must be greater than 0');
  }
  if (bacWaterMl === null || bacWaterMl <= 0) {
    errors.push('BAC water amount must be greater than 0');
  }
  if (desiredDoseMcg === null || desiredDoseMcg <= 0) {
    errors.push('Desired dose must be greater than 0');
  }

  if (errors.length > 0 || !vialSizeMg || !bacWaterMl || !desiredDoseMcg) {
    return {
      concentrationMcgPerUnit: 0,
      concentrationMcgPer01ml: 0,
      unitsToFill: 0,
      dosesPerVial: 0,
      isValid: false,
      errors,
    };
  }

  const concentrationMcgPerUnit = calculateConcentration(vialSizeMg, bacWaterMl);
  const concentrationMcgPer01ml = calculateConcentrationPer01ml(vialSizeMg, bacWaterMl);
  const unitsToFill = calculateUnitsToFill(desiredDoseMcg, vialSizeMg, bacWaterMl, syringeType);
  const dosesPerVial = calculateDosesPerVial(vialSizeMg, desiredDoseMcg);

  // Check if units exceed syringe capacity
  const maxUnits = SYRINGE_MAX_UNITS[syringeType];
  if (unitsToFill > maxUnits) {
    errors.push(`Dose requires ${unitsToFill} units but your ${syringeType} syringe only holds ${maxUnits} units. Consider adding less BAC water or using a larger syringe.`);
  }

  return {
    concentrationMcgPerUnit,
    concentrationMcgPer01ml,
    unitsToFill,
    dosesPerVial,
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format a number to a clean display string.
 * Removes unnecessary trailing zeros but keeps precision where needed.
 */
export function formatNumber(value: number, maxDecimals: number = 2): string {
  if (Number.isInteger(value)) return value.toString();
  return parseFloat(value.toFixed(maxDecimals)).toString();
}

/**
 * Format units for syringe display.
 */
export function formatUnits(units: number): string {
  if (units <= 0) return '0';
  if (Number.isInteger(units)) return units.toString();
  return units.toFixed(1);
}
