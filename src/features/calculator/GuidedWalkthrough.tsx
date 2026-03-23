// ============================================
// Guided Reconstitution Walkthrough — Premium Educational Experience
// 8-phase step-by-step journey for first-time users
// ============================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { v4 as uuid } from 'uuid';
import { Button, Card, Input, Select, ProgressBar, Modal } from '../../components/Components';
import { SyringeType, FrequencyPattern, CATEGORY_LABELS, REGULATORY_LABELS, SYRINGE_MAX_UNITS } from '../../data/types';
import type { Peptide } from '../../data/types';
import { calculateConcentration, calculateUnitsToFill, calculateDosesPerVial, formatNumber, formatUnits } from '../../utils/calculations';
import './GuidedWalkthrough.css';
import { SUPPLY_ITEMS, SyringeHeroVisual } from './SupplyEducation';

// ---- Types ----
type Phase = 'select' | 'intro' | 'supplies' | 'details' | 'mix' | 'draw' | 'injection' | 'complete';

const PHASES: Phase[] = ['select', 'intro', 'supplies', 'details', 'mix', 'draw', 'injection', 'complete'];

const DOSE_UNIT_OPTIONS = [
  { value: 'mcg', label: 'mcg' },
  { value: 'mg', label: 'mg' },
  { value: 'IU', label: 'IU' },
];

// Syringe size options for selection
const SYRINGE_OPTIONS = [
  { type: SyringeType.U30, label: '0.3 mL', units: 30, desc: '30 unit', img: '/images/syringe-03ml.png' },
  { type: SyringeType.U50, label: '0.5 mL', units: 50, desc: '50 unit', img: '/images/syringe-05ml.png' },
  { type: SyringeType.U100, label: '1.0 mL', units: 100, desc: '100 unit', img: '/images/syringe-10ml.png' },
];

// ---- SVG Icons ----
const IconVial = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6v3a6 6 0 0 1-6 6H9V3z" /><path d="M15 6a6 6 0 0 1 0 6h0" />
    <line x1="12" y1="15" x2="12" y2="21" /><line x1="9" y1="21" x2="15" y2="21" />
  </svg>
);

const IconCheck = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconBody = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2" /><path d="M12 6v6" /><path d="M12 12l-4 6" /><path d="M12 12l4 6" />
    <path d="M8 10l-4 2" /><path d="M16 10l4 2" />
  </svg>
);

const IconShield = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 12 15 16 10" />
  </svg>
);

// ---- Component ----
const GuidedWalkthrough: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedPeptideId, setSelectedPeptideId] = useState<string>('');
  const [vialSizeMg, setVialSizeMg] = useState('');
  const [bacWaterMl, setBacWaterMl] = useState('');
  const [dose, setDose] = useState('');
  const [doseUnit, setDoseUnit] = useState('mcg');
  const [selectedSyringeType, setSelectedSyringeType] = useState<SyringeType | null>(null);
  const [showMathModal, setShowMathModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkedSupplies, setCheckedSupplies] = useState<Set<number>>(new Set());
  const [expandedSupply, setExpandedSupply] = useState<number | null>(null);
  const [showMissingWarning, setShowMissingWarning] = useState(false);

  const peptides = useLiveQuery(() => db.peptides.toArray()) || [];
  const selectedPeptide = peptides.find((p) => p.id === selectedPeptideId);

  const vial = parseFloat(vialSizeMg) || 0;
  const water = parseFloat(bacWaterMl) || 0;
  const rawDose = parseFloat(dose) || 0;
  const doseMcg = doseUnit === 'mg' ? rawDose * 1000 : rawDose;

  // Use selected syringe type for calculations
  const syringeType = selectedSyringeType || SyringeType.U100;
  const maxUnits = selectedSyringeType ? SYRINGE_MAX_UNITS[selectedSyringeType] : 100;

  const concentration = useMemo(() => calculateConcentration(vial, water), [vial, water]);
  const unitsToFill = useMemo(() => calculateUnitsToFill(doseMcg, vial, water, syringeType), [doseMcg, vial, water, syringeType]);
  const dosesPerVial = useMemo(() => calculateDosesPerVial(vial, doseMcg), [vial, doseMcg]);

  // Dose validation: warn if > 5000mcg
  const isDoseHigh = doseMcg > 5000;
  // Syringe capacity overflow
  const isOverflow = unitsToFill > maxUnits && unitsToFill > 0;

  // Math explanation values
  const vialMcg = vial * 1000;
  const totalUnitsOfWater = water * 100;
  const mcgPerUnit = totalUnitsOfWater > 0 ? vialMcg / totalUnitsOfWater : 0;

  const phaseIndex = PHASES.indexOf(phase);
  const progress = ((phaseIndex + 1) / PHASES.length) * 100;

  const goBack = () => {
    const idx = PHASES.indexOf(phase);
    if (idx > 0) setPhase(PHASES[idx - 1]);
    else navigate('/calculator');
  };

  const goNext = () => {
    const idx = PHASES.indexOf(phase);
    if (idx < PHASES.length - 1) setPhase(PHASES[idx + 1]);
  };

  const toggleSupply = (i: number) => {
    const next = new Set(checkedSupplies);
    if (next.has(i)) next.delete(i); else next.add(i);
    setCheckedSupplies(next);
    setShowMissingWarning(false);
  };

  const toggleInfo = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSupply(expandedSupply === i ? null : i);
  };

  const handleSuppliesContinue = () => {
    if (checkedSupplies.size < SUPPLY_ITEMS.length && !showMissingWarning) {
      setShowMissingWarning(true);
      return;
    }
    setShowMissingWarning(false);
    goNext();
  };

  const missingSupplies = SUPPLY_ITEMS.filter((_, i) => !checkedSupplies.has(i));
  const allChecked = checkedSupplies.size === SUPPLY_ITEMS.length;

  const handleSaveProtocol = async () => {
    if (!selectedPeptide || !vial || !water || !doseMcg || !selectedSyringeType) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      await db.protocols.add({
        id: uuid(),
        peptideId: selectedPeptide.id,
        peptideName: selectedPeptide.name,
        vialSizeMg: vial,
        bacWaterMl: water,
        doseMcg,
        syringeType: selectedSyringeType,
        concentrationMcgPerUnit: concentration,
        unitsToFill,
        frequency: FrequencyPattern.DAILY,
        timesOfDay: ['08:00'],
        isActive: true,
        startDate: now.split('T')[0],
        createdAt: now,
        updatedAt: now,
      });
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 28);
      await db.inventory.add({
        id: uuid(),
        peptideId: selectedPeptide.id,
        peptideName: selectedPeptide.name,
        vialSizeMg: vial,
        bacWaterMl: water,
        concentrationMcgPerUnit: concentration,
        dateReconstituted: now.split('T')[0],
        expirationDate: expDate.toISOString().split('T')[0],
        totalDoses: dosesPerVial,
        dosesUsed: 0,
        dosesRemaining: dosesPerVial,
        isActive: true,
        createdAt: now,
      });
      navigate('/protocols');
    } catch (err) {
      console.error('Failed to save protocol:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="walkthrough">
      {/* Back Button */}
      <button className="wt-back" onClick={goBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      {/* Progress */}
      <div className="wt-progress">
        <ProgressBar value={phaseIndex + 1} max={PHASES.length} size="sm" />
        <span className="wt-progress-label">Step {phaseIndex + 1} of {PHASES.length}</span>
      </div>

      {/* ===== PHASE 1: Select Peptide ===== */}
      {phase === 'select' && (
        <div className="wt-phase animate-fade-in-up">
          <h1 className="wt-title">What peptide are you working with?</h1>
          <p className="wt-subtitle">Select your peptide and we'll guide you through everything step by step.</p>
          <div className="wt-peptide-list stagger-children">
            {peptides.map((p) => (
              <Card
                key={p.id}
                className={`wt-peptide-card ${selectedPeptideId === p.id ? 'wt-peptide-selected' : ''}`}
                padding="md"
                onClick={() => setSelectedPeptideId(p.id)}
              >
                <span className="wt-peptide-name">{p.name}</span>
                <span className="wt-peptide-cat">{CATEGORY_LABELS[p.category]}</span>
              </Card>
            ))}
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!selectedPeptideId}
            onClick={goNext}
            style={{ marginTop: 'var(--space-6)' }}
          >
            Continue
          </Button>
        </div>
      )}

      {/* ===== PHASE 2: Peptide Introduction ===== */}
      {phase === 'intro' && selectedPeptide && (
        <div className="wt-phase animate-fade-in-up">
          <div className="wt-intro-header">
            <div className="wt-intro-icon-circle">
              <IconVial />
            </div>
            <h1 className="wt-title">{selectedPeptide.name}</h1>
            <span className="wt-intro-category">{CATEGORY_LABELS[selectedPeptide.category]}</span>
          </div>

          <p className="wt-intro-desc">{selectedPeptide.shortDescription}</p>

          {selectedPeptide.commonProtocols.length > 0 && (
            <Card glass padding="md" className="wt-info-card">
              <span className="wt-info-label">Common Protocol</span>
              <div className="wt-info-grid">
                <div className="wt-info-item">
                  <span className="wt-info-item-label">Dose Range</span>
                  <span className="wt-info-item-value">{selectedPeptide.commonProtocols[0].dosingRange}</span>
                </div>
                <div className="wt-info-item">
                  <span className="wt-info-item-label">Frequency</span>
                  <span className="wt-info-item-value">{selectedPeptide.commonProtocols[0].frequency}</span>
                </div>
                <div className="wt-info-item">
                  <span className="wt-info-item-label">Route</span>
                  <span className="wt-info-item-value">{selectedPeptide.commonProtocols[0].route}</span>
                </div>
                <div className="wt-info-item">
                  <span className="wt-info-item-label">Duration</span>
                  <span className="wt-info-item-value">{selectedPeptide.commonProtocols[0].duration}</span>
                </div>
              </div>
            </Card>
          )}

          <div className="wt-edu-callout">
            <IconShield />
            <div>
              <strong>Regulatory Status</strong>
              <p>{REGULATORY_LABELS[selectedPeptide.regulatoryStatus]}</p>
            </div>
          </div>

          {selectedPeptide.halfLife && (
            <div className="wt-edu-callout">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <strong>Half-Life</strong>
                <p>{selectedPeptide.halfLife.value} {selectedPeptide.halfLife.unit}</p>
              </div>
            </div>
          )}

          <Button variant="primary" size="lg" fullWidth onClick={goNext} style={{ marginTop: 'auto' }}>
            I Understand — Let's Prepare
          </Button>
        </div>
      )}

      {/* ===== PHASE 3: What You'll Need ===== */}
      {phase === 'supplies' && (
        <div className="wt-phase animate-fade-in-up">
          <h1 className="wt-title">What You'll Need</h1>
          <p className="wt-subtitle">Gather these supplies before you begin. Tap each item to check it off.</p>

          <div className="wt-supply-list">
            {SUPPLY_ITEMS.map((item, i) => (
              <div key={i} className="wt-supply-item-wrapper">
                <div
                  className={`wt-supply-item ${checkedSupplies.has(i) ? 'wt-supply-checked' : ''}`}
                  onClick={() => toggleSupply(i)}
                >
                  <div className="wt-supply-check">
                    {checkedSupplies.has(i) ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="white" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" />
                      </svg>
                    ) : (
                      <div className="wt-supply-check-empty" />
                    )}
                  </div>
                  <div className="wt-supply-text">
                    <span className="wt-supply-name">{item.name}</span>
                    <span className="wt-supply-desc">{item.desc}</span>
                  </div>
                  {/* Optional info button */}
                  <button className="wt-supply-info-btn" onClick={(e) => toggleInfo(i, e)} aria-label="Learn more">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={expandedSupply === i ? 'var(--color-accent)' : 'var(--color-text-tertiary)'} strokeWidth="1.8" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </button>
                </div>

                {/* Optional educational info (only shown when info icon tapped) */}
                {expandedSupply === i && (
                  <div className="wt-supply-edu animate-fade-in-up">
                    <div className="wt-supply-why">
                      <strong>Why you need this</strong>
                      <p>{item.why}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Soft missing supplies notice */}
          {showMissingWarning && missingSupplies.length > 0 && (
            <div className="wt-missing-warning animate-fade-in-up">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <div>
                <strong>Just so you know</strong>
                <p style={{ marginBottom: 'var(--space-2)' }}>You haven't checked off a few items. That's okay — you can always come back. Here's what to keep in mind:</p>
                {missingSupplies.map((s, idx) => (
                  <p key={idx} className="wt-missing-item">
                    <strong>{s.name}</strong> — {s.skipWarning}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="wt-edu-callout" style={{ marginTop: 'var(--space-4)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <strong>Pro Tip</strong>
              <p>Work on a clean, flat surface with good lighting. A bathroom counter or kitchen table works well.</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSuppliesContinue}
            style={{ marginTop: 'auto' }}
          >
            {allChecked ? 'I Have Everything — Continue' : showMissingWarning ? 'Continue Anyway' : 'Continue'}
          </Button>
        </div>
      )}

      {/* ===== PHASE 4: Enter Details (Modified) ===== */}
      {phase === 'details' && (
        <div className="wt-phase animate-fade-in-up">
          <h1 className="wt-title">Your Reconstitution Details</h1>
          <p className="wt-subtitle">Enter the information from your vial and prescription. We'll do the math for you.</p>

          <div className="wt-setup-inputs">
            <div className="wt-input-card">
              <Input
                label="Vial Size"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 5"
                suffix="mg"
                value={vialSizeMg}
                onChange={(e) => setVialSizeMg(e.target.value)}
              />
              <p className="wt-input-edu">This is the amount of peptide in your vial. It's usually printed on the label (e.g., "5mg" or "10mg").</p>
            </div>

            <div className="wt-input-card">
              <Input
                label="Bacteriostatic Water"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 2"
                suffix="mL"
                value={bacWaterMl}
                onChange={(e) => setBacWaterMl(e.target.value)}
              />
              <p className="wt-input-edu">This is how much water you'll add to dissolve the peptide. Your provider or pharmacy will specify this. If unsure, 2 mL is the most common amount.</p>
            </div>

            <div className="wt-input-card">
              <div className="wt-dose-row">
                <div className="wt-dose-input">
                  <Input
                    label="Prescribed Dose"
                    type="number"
                    inputMode="decimal"
                    placeholder="e.g. 250"
                    suffix={doseUnit}
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                  />
                </div>
                <div className="wt-dose-unit">
                  <Select
                    label="Unit"
                    options={DOSE_UNIT_OPTIONS}
                    value={doseUnit}
                    onChange={(v) => setDoseUnit(v)}
                  />
                </div>
              </div>
              <p className="wt-input-edu">This is the amount your provider prescribed for each injection. It's usually in micrograms (mcg) or milligrams (mg).</p>

              {/* High dose warning */}
              {isDoseHigh && (
                <div className="wt-dose-warning animate-fade-in-up">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>That's a high dose. Most peptides are dosed between 100–2000 mcg. Double-check your prescription.</span>
                </div>
              )}
            </div>

            {/* Syringe Size Selection */}
            <div className="wt-input-card">
              <label className="input-label">What size is your insulin syringe?</label>
              <p className="wt-input-edu" style={{ marginBottom: 'var(--space-3)' }}>Select the syringe you'll use for injections. This is usually printed on the syringe packaging.</p>
              <div className="wt-syringe-selector">
                {SYRINGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    className={`wt-syringe-card ${selectedSyringeType === opt.type ? 'wt-syringe-card-selected' : ''}`}
                    onClick={() => setSelectedSyringeType(opt.type)}
                  >
                    <div className="wt-syringe-card-img">
                      <img src={opt.img} alt={`${opt.label} insulin syringe`} />
                    </div>
                    <span className="wt-syringe-card-size">{opt.label}</span>
                    <span className="wt-syringe-card-units">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!vial || !water || !selectedSyringeType}
            onClick={goNext}
            style={{ marginTop: 'var(--space-6)' }}
          >
            Continue
          </Button>
        </div>
      )}

      {/* ===== PHASE 5: The Mix ===== */}
      {phase === 'mix' && (
        <div className="wt-phase animate-fade-in-up">
          <div className="wt-action-step-label">Step 1</div>
          <h1 className="wt-title">The Mix</h1>

          <div className="wt-mix-hero">
            <img
              src="/images/mixing-illustration.png"
              alt="Syringe injecting bacteriostatic water into peptide vial"
              className="wt-mix-hero-img"
            />
          </div>

          <div className="wt-mix-instruction">
            <p>
              Gently push <strong>{water || '___'} mL</strong> of bacteriostatic water into your{' '}
              <strong>{vial || '___'} mg</strong> vial.
            </p>
            <p className="wt-mix-instruction-sub">
              Aim the water down the inside wall of the vial. Roll gently to dissolve — never shake.
            </p>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={goNext} style={{ marginTop: 'auto' }}>
            I've Mixed It — Continue
          </Button>
        </div>
      )}

      {/* ===== PHASE 6: The Draw ===== */}
      {phase === 'draw' && (
        <div className="wt-phase animate-fade-in-up">
          <div className="wt-action-step-label">Step 2</div>
          <h1 className="wt-title">Your Dose</h1>

          {/* Hero Syringe Visual */}
          {doseMcg > 0 && selectedSyringeType ? (
            <>
              <div className="wt-draw-hero">
                <SyringeHeroVisual
                  maxUnits={maxUnits}
                  fillUnits={unitsToFill}
                  isOverflow={isOverflow}
                />
              </div>

              <div className="wt-draw-instruction">
                {!isOverflow ? (
                  <p>
                    Pull the mixed liquid into your insulin syringe until it reaches the{' '}
                    <strong className="wt-draw-highlight">{formatUnits(unitsToFill)} unit</strong> line.
                  </p>
                ) : (
                  <div className="wt-draw-overflow-warning animate-fade-in-up">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>
                      <strong>Syringe too small</strong>
                      <p>
                        Your dose requires <strong>{formatUnits(unitsToFill)} units</strong>, but your{' '}
                        {maxUnits === 30 ? '0.3 mL' : maxUnits === 50 ? '0.5 mL' : '1.0 mL'} syringe only holds{' '}
                        <strong>{maxUnits} units</strong>. Try adding more water to your mix or selecting a larger syringe.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Math explanation link */}
              <button
                className="wt-math-link"
                onClick={() => setShowMathModal(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                How did we calculate this?
              </button>
            </>
          ) : (
            <div className="wt-draw-empty">
              <p>Enter a prescribed dose in the previous step to see your syringe fill level.</p>
            </div>
          )}

          <Button variant="primary" size="lg" fullWidth onClick={goNext} disabled={isOverflow} style={{ marginTop: 'auto' }}>
            Continue to Injection Tips
          </Button>
        </div>
      )}

      {/* ===== PHASE 7: Injection Tips ===== */}
      {phase === 'injection' && (
        <div className="wt-phase animate-fade-in-up">
          <h1 className="wt-title">Injection Guide</h1>
          <p className="wt-subtitle">Everything you need to know for a safe, comfortable injection.</p>

          <div className="wt-injection-section">
            <h3 className="wt-section-heading">Best Injection Sites</h3>
            <div className="wt-site-grid">
              {[
                { name: 'Abdomen', desc: 'Most common — 2" around the navel', best: true },
                { name: 'Thigh', desc: 'Front/outer thigh — easy to reach', best: false },
                { name: 'Upper Arm', desc: 'Back of the arm — less fatty tissue', best: false },
                { name: 'Glutes', desc: 'Upper outer area — large muscle', best: false },
              ].map((site, i) => (
                <Card key={i} glass padding="sm" className={`wt-site-card ${site.best ? 'wt-site-best' : ''}`}>
                  <span className="wt-site-name">{site.name}</span>
                  <span className="wt-site-desc">{site.desc}</span>
                  {site.best && <span className="wt-site-badge">Most Popular</span>}
                </Card>
              ))}
            </div>
          </div>

          <div className="wt-injection-section">
            <h3 className="wt-section-heading">Technique</h3>
            <div className="wt-technique-list">
              <div className="wt-technique-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" /></svg>
                <span>Clean the site with an alcohol swab and let it dry</span>
              </div>
              <div className="wt-technique-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" /></svg>
                <span>Pinch a fold of skin between your thumb and finger</span>
              </div>
              <div className="wt-technique-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" /></svg>
                <span>Insert the needle at a 45–90° angle</span>
              </div>
              <div className="wt-technique-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" /></svg>
                <span>Push the plunger slowly and steadily</span>
              </div>
              <div className="wt-technique-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" /></svg>
                <span>Wait 5 seconds, then withdraw the needle straight out</span>
              </div>
            </div>
          </div>

          <div className="wt-edu-callout">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <strong>Rotate Your Sites</strong>
              <p>Never inject in the same spot twice in a row. Alternate between at least 4 different sites to prevent tissue buildup and ensure consistent absorption.</p>
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={goNext} style={{ marginTop: 'auto' }}>
            Finish Setup
          </Button>
        </div>
      )}

      {/* ===== PHASE 8: Complete ===== */}
      {phase === 'complete' && (
        <div className="wt-phase wt-complete animate-scale-in">
          <div className="wt-complete-icon-circle">
            <IconCheck />
          </div>
          <h1 className="wt-title">You're All Set!</h1>
          <p className="wt-subtitle">
            Your {selectedPeptide?.name} is reconstituted and ready to use.
            {doseMcg > 0 && ` Draw to ${formatUnits(unitsToFill)} units for your ${dose} ${doseUnit} dose.`}
          </p>

          {selectedPeptide && vial && water && doseMcg && selectedSyringeType ? (
            <Card glass padding="lg" className="wt-save-card">
              <h3 style={{ marginBottom: 'var(--space-3)' }}>Save as a protocol?</h3>
              <p className="wt-save-desc">
                We'll track your doses, send reminders, and calculate your inventory automatically.
              </p>

              <div className="wt-save-summary">
                <div className="wt-save-row">
                  <span>Peptide</span><strong>{selectedPeptide.name}</strong>
                </div>
                <div className="wt-save-row">
                  <span>Concentration</span><strong>{formatNumber(concentration)} mcg/unit</strong>
                </div>
                <div className="wt-save-row">
                  <span>Dose</span><strong>{dose} {doseUnit} ({formatUnits(unitsToFill)} units)</strong>
                </div>
                <div className="wt-save-row">
                  <span>Syringe</span><strong>{maxUnits === 30 ? '0.3 mL' : maxUnits === 50 ? '0.5 mL' : '1.0 mL'} ({maxUnits} unit)</strong>
                </div>
                <div className="wt-save-row">
                  <span>Vial yields</span><strong>{dosesPerVial} doses</strong>
                </div>
              </div>

              <div className="wt-save-actions">
                <Button variant="primary" size="lg" fullWidth loading={saving} onClick={handleSaveProtocol}>
                  Save Protocol
                </Button>
                <Button variant="ghost" size="md" fullWidth onClick={() => navigate('/')}>
                  Skip for now
                </Button>
              </div>
            </Card>
          ) : (
            <Button variant="primary" size="lg" onClick={() => navigate('/')}>
              Go to Dashboard
            </Button>
          )}
        </div>
      )}

      {/* ===== Math Explanation Modal ===== */}
      <Modal
        isOpen={showMathModal}
        onClose={() => setShowMathModal(false)}
        title="How We Calculated Your Dose"
      >
        <div className="wt-math-modal-content">
          <div className="wt-math-modal-step">
            <span className="wt-math-modal-step-num">1</span>
            <div>
              <strong>Convert your vial to micrograms</strong>
              <p>
                {vial} mg = <span className="wt-math-modal-highlight">{formatNumber(vialMcg)} mcg</span>
              </p>
              <p className="wt-math-modal-explain">
                1 mg = 1,000 mcg, so {vial} × 1,000 = {formatNumber(vialMcg)}
              </p>
            </div>
          </div>

          <div className="wt-math-modal-step">
            <span className="wt-math-modal-step-num">2</span>
            <div>
              <strong>Find the concentration per unit</strong>
              <p>
                {formatNumber(vialMcg)} mcg ÷ {formatNumber(totalUnitsOfWater)} units of water ={' '}
                <span className="wt-math-modal-highlight">{formatNumber(mcgPerUnit)} mcg per unit</span>
              </p>
              <p className="wt-math-modal-explain">
                {water} mL × 100 units/mL = {formatNumber(totalUnitsOfWater)} total units
              </p>
            </div>
          </div>

          <div className="wt-math-modal-step">
            <span className="wt-math-modal-step-num">3</span>
            <div>
              <strong>Divide your dose</strong>
              <p>
                {formatNumber(doseMcg)} mcg ÷ {formatNumber(mcgPerUnit)} mcg ={' '}
                <span className="wt-math-modal-highlight wt-math-modal-result">{formatUnits(unitsToFill)} units to draw!</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GuidedWalkthrough;
