// ============================================
// PenRx Calculator Page — Live dosing calculator
// ============================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Card } from '../../components/Components';
import { SyringeType } from '../../data/types';
import { calculate, formatNumber, formatUnits } from '../../utils/calculations';
import './CalculatorPage.css';

const SYRINGE_OPTIONS = [
  { value: SyringeType.U100, label: 'U-100 (1 mL)' },
  { value: SyringeType.U50, label: 'U-50 (0.5 mL)' },
  { value: SyringeType.U30, label: 'U-30 (0.3 mL)' },
];

const DOSE_UNIT_OPTIONS = [
  { value: 'mcg', label: 'mcg (micrograms)' },
  { value: 'mg', label: 'mg (milligrams)' },
  { value: 'IU', label: 'IU (international units)' },
];

const CalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [vialSizeMg, setVialSizeMg] = useState<string>('');
  const [bacWaterMl, setBacWaterMl] = useState<string>('');
  const [desiredDose, setDesiredDose] = useState<string>('');
  const [doseUnit, setDoseUnit] = useState<string>('mcg');
  const [syringeType, setSyringeType] = useState<SyringeType>(SyringeType.U100);

  // Convert dose to mcg for calculations
  const desiredDoseMcg = useMemo(() => {
    const raw = desiredDose ? parseFloat(desiredDose) : null;
    if (raw === null || isNaN(raw)) return null;
    switch (doseUnit) {
      case 'mg': return raw * 1000;
      case 'IU': return raw; // IU is peptide-specific; pass through as mcg equivalent
      default: return raw;
    }
  }, [desiredDose, doseUnit]);

  const results = useMemo(() => {
    return calculate({
      vialSizeMg: vialSizeMg ? parseFloat(vialSizeMg) : null,
      bacWaterMl: bacWaterMl ? parseFloat(bacWaterMl) : null,
      desiredDoseMcg,
      syringeType,
    });
  }, [vialSizeMg, bacWaterMl, desiredDoseMcg, syringeType]);

  const hasInputs = vialSizeMg && bacWaterMl;
  const hasFullInputs = hasInputs && desiredDose;

  return (
    <div className="page page-enter">
      <div className="page-header">
        <h1 className="page-title">Calculator</h1>
        <p className="page-subtitle">Real-time reconstitution & dosing math</p>
      </div>

      {/* Guided Walkthrough CTA */}
      <Card glass className="calc-walkthrough-cta animate-fade-in-up" onClick={() => navigate('/calculator/walkthrough')}>
        <div className="calc-cta-inner">
          <span className="calc-cta-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v3a6 6 0 0 1-6 6H9V3z" /><path d="M15 6a6 6 0 0 1 0 6h0" /><line x1="12" y1="15" x2="12" y2="21" /><line x1="9" y1="21" x2="15" y2="21" /></svg></span>
          <div className="calc-cta-text">
            <span className="calc-cta-title">Need step-by-step help?</span>
            <span className="calc-cta-desc">Start the guided reconstitution walkthrough →</span>
          </div>
        </div>
      </Card>

      {/* Inputs */}
      <div className="calc-inputs animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <Input
          label="Vial Size"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 5"
          suffix="mg"
          value={vialSizeMg}
          onChange={(e) => setVialSizeMg(e.target.value)}
          min="0"
          step="any"
        />
        <Input
          label="Bacteriostatic Water"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 2"
          suffix="mL"
          value={bacWaterMl}
          onChange={(e) => setBacWaterMl(e.target.value)}
          helper="Not sure? Check your pharmacy instructions. 2 mL is common."
          min="0"
          step="any"
        />
        <div className="calc-dose-row">
          <div className="calc-dose-input">
            <Input
              label="Desired Dose"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 250"
              suffix={doseUnit}
              value={desiredDose}
              onChange={(e) => setDesiredDose(e.target.value)}
              min="0"
              step="any"
            />
          </div>
          <div className="calc-dose-unit">
            <Select
              label="Unit"
              options={DOSE_UNIT_OPTIONS}
              value={doseUnit}
              onChange={(v) => setDoseUnit(v)}
            />
          </div>
        </div>
        {doseUnit === 'IU' && (
          <p className="calc-iu-note">
            IU conversion varies by peptide. For HGH: 1 IU ≈ 333 mcg. For HCG: 1 IU ≈ 0.092 mcg. Check your provider's guidance.
          </p>
        )}
        <Select
          label="Syringe Type"
          options={SYRINGE_OPTIONS}
          value={syringeType}
          onChange={(v) => setSyringeType(v as SyringeType)}
        />
      </div>

      {/* Results */}
      {hasInputs && (
        <div className="calc-results animate-fade-in-up">
          <h2 className="calc-results-title">Results</h2>

          <div className="calc-result-grid">
            <Card glass padding="md" className="calc-result-card">
              <span className="calc-result-label">Concentration</span>
              <span className="calc-result-value">
                {formatNumber(results.concentrationMcgPerUnit)} <small>mcg/unit</small>
              </span>
              <span className="calc-result-sub">
                {formatNumber(results.concentrationMcgPer01ml)} mcg per 0.1 mL
              </span>
            </Card>

            {hasFullInputs && (
              <>
                <Card glass padding="md" className={`calc-result-card ${!results.isValid ? 'calc-result-error' : 'calc-result-highlight'}`}>
                  <span className="calc-result-label">Draw to</span>
                  <span className="calc-result-value calc-result-accent">
                    {formatUnits(results.unitsToFill)} <small>units</small>
                  </span>
                  {!results.isValid && results.errors.length > 0 && (
                    <span className="calc-result-error-text">{results.errors[0]}</span>
                  )}
                </Card>

                <Card glass padding="md" className="calc-result-card">
                  <span className="calc-result-label">Doses per Vial</span>
                  <span className="calc-result-value">
                    {results.dosesPerVial} <small>doses</small>
                  </span>
                </Card>
              </>
            )}
          </div>
        </div>
      )}

      <p className="disclaimer" style={{ marginTop: 'var(--space-6)' }}>
        Educational information only — verify all calculations with your healthcare provider.
      </p>
    </div>
  );
};

export default CalculatorPage;

