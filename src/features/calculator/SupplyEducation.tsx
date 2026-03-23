// ============================================
// Supply Education Data + Procedural SVG Illustrations
// ============================================

import React from 'react';
import { formatUnits } from '../../utils/calculations';

// ---- Enhanced Supplies Data ----
export interface SupplyItem {
  name: string;
  desc: string;
  why: string;
  skipWarning: string;
  essential: boolean;
}

export const SUPPLY_ITEMS: SupplyItem[] = [
  {
    name: 'Peptide vial (lyophilized powder)',
    desc: 'Your prescribed peptide in powdered form',
    why: 'This is the freeze-dried powder that contains your actual peptide. It must be mixed with sterile water before use — you cannot inject the powder directly.',
    skipWarning: 'This is required. You cannot proceed with reconstitution without your peptide vial.',
    essential: true,
  },
  {
    name: 'Bacteriostatic water',
    desc: 'Sterile water with 0.9% benzyl alcohol',
    why: 'BAC water contains a small amount of benzyl alcohol that prevents bacteria from growing. This keeps your reconstituted peptide safe to use for up to 28 days.',
    skipWarning: 'Without BAC water, you cannot reconstitute your peptide. Sterile water is an alternative but lacks a preservative, so it must be used within 24 hours.',
    essential: true,
  },
  {
    name: 'Mixing syringe + needle',
    desc: '3 mL syringe with 18–21G needle for reconstitution',
    why: 'A larger gauge needle (18–21G) is used specifically for drawing BAC water and injecting it into the peptide vial. The wider bore makes it easier to draw liquid and avoids air bubbles. This is NOT the same syringe you inject with.',
    skipWarning: 'You\'ll need a mixing syringe to transfer BAC water into your peptide vial. These are inexpensive (~$5 for 10) and available at most pharmacies or online.',
    essential: false,
  },
  {
    name: 'Insulin syringes',
    desc: 'U-100 (most common) for injecting your dose',
    why: 'Insulin syringes have ultra-fine needles (29–31G) that make injections nearly painless. The precise unit markings let you measure your exact dose. U-100 is the standard — each "unit" mark = 0.01 mL.',
    skipWarning: 'You\'ll need insulin syringes to inject. Available at most pharmacies without a prescription in many states, or order online.',
    essential: false,
  },
  {
    name: 'Alcohol swabs',
    desc: 'For cleaning vial tops and injection sites',
    why: 'Wiping vial stoppers and your skin with alcohol removes bacteria that could cause infection. A simple but critical safety step that takes seconds.',
    skipWarning: 'Strongly recommended for safety. Available at any pharmacy for ~$3. You can also use 70% isopropyl alcohol on a cotton pad.',
    essential: false,
  },
  {
    name: 'Sharps container',
    desc: 'For safe needle disposal',
    why: 'Used needles must be disposed of safely to prevent accidental needle sticks. Most areas require proper sharps disposal by law.',
    skipWarning: 'Any rigid, puncture-proof plastic container (like an empty detergent bottle) works as a temporary substitute.',
    essential: false,
  },
];

// ---- Procedural SVG Illustrations ----

export const IllustrationDrawWater: React.FC = () => (
  <svg className="wt-illustration" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* BAC Water Vial */}
    <rect x="30" y="40" width="50" height="90" rx="6" stroke="var(--color-accent)" strokeWidth="1.5" />
    <rect x="38" y="32" width="34" height="14" rx="3" fill="var(--color-accent-muted)" stroke="var(--color-accent)" strokeWidth="1.2" />
    <rect x="35" y="70" width="40" height="55" rx="2" fill="var(--color-accent)" opacity="0.15" />
    <text x="55" y="55" textAnchor="middle" fontSize="8" fill="var(--color-text-tertiary)" fontFamily="var(--font-mono)">BAC WATER</text>
    {/* Water level label */}
    <line x1="78" y1="70" x2="90" y2="70" stroke="var(--color-text-tertiary)" strokeWidth="0.8" strokeDasharray="2 2" />
    <text x="93" y="73" fontSize="7" fill="var(--color-text-tertiary)" fontFamily="var(--font-mono)">WATER LEVEL</text>
    {/* Syringe */}
    <rect x="150" y="20" width="16" height="100" rx="3" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
    <rect x="155" y="12" width="6" height="12" rx="2" fill="var(--color-text-secondary)" />
    <line x1="158" y1="12" x2="158" y2="2" stroke="var(--color-text-secondary)" strokeWidth="2" />
    {/* Needle */}
    <line x1="158" y1="120" x2="158" y2="142" stroke="var(--color-text-secondary)" strokeWidth="1.2" />
    {/* Syringe markings */}
    <line x1="164" y1="40" x2="169" y2="40" stroke="var(--color-text-tertiary)" strokeWidth="0.8" />
    <line x1="164" y1="60" x2="169" y2="60" stroke="var(--color-text-tertiary)" strokeWidth="0.8" />
    <line x1="164" y1="80" x2="169" y2="80" stroke="var(--color-text-tertiary)" strokeWidth="0.8" />
    <line x1="164" y1="100" x2="169" y2="100" stroke="var(--color-text-tertiary)" strokeWidth="0.8" />
    <text x="173" y="43" fontSize="7" fill="var(--color-text-tertiary)" fontFamily="var(--font-mono)">3 mL</text>
    <text x="173" y="63" fontSize="7" fill="var(--color-text-tertiary)" fontFamily="var(--font-mono)">2 mL</text>
    <text x="173" y="83" fontSize="7" fill="var(--color-text-tertiary)" fontFamily="var(--font-mono)">1 mL</text>
    {/* Arrow showing draw path */}
    <path d="M155 135 L85 105 L85 80" stroke="var(--color-accent)" strokeWidth="1.2" strokeDasharray="4 3" fill="none" markerEnd="url(#ah1)" />
    <defs><marker id="ah1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="var(--color-accent)" /></marker></defs>
    <text x="120" y="155" textAnchor="middle" fontSize="9" fill="var(--color-text-secondary)" fontFamily="var(--font-family)">Insert needle into BAC vial, pull plunger slowly</text>
  </svg>
);

export const IllustrationInsertNeedle: React.FC = () => (
  <svg className="wt-illustration" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Peptide vial (close-up top) */}
    <rect x="70" y="55" width="100" height="80" rx="8" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
    <rect x="85" y="43" width="70" height="18" rx="4" fill="var(--color-accent-muted)" stroke="var(--color-accent)" strokeWidth="1.5" />
    {/* Rubber stopper */}
    <rect x="95" y="46" width="50" height="10" rx="2" fill="var(--color-text-tertiary)" opacity="0.4" />
    <text x="120" y="54" textAnchor="middle" fontSize="7" fill="var(--color-text-primary)" fontFamily="var(--font-mono)">RUBBER STOPPER</text>
    {/* Needle entering at 45° */}
    <line x1="165" y1="8" x2="125" y2="48" stroke="var(--color-accent)" strokeWidth="1.8" />
    <line x1="125" y1="48" x2="123" y2="53" stroke="var(--color-accent)" strokeWidth="1" />
    {/* 45° angle indicator */}
    <path d="M135 38 A 12 12 0 0 1 147 29" stroke="var(--color-accent)" strokeWidth="1.2" fill="none" />
    <text x="152" y="28" fontSize="10" fill="var(--color-accent)" fontFamily="var(--font-mono)" fontWeight="600">45°</text>
    {/* Powder in vial */}
    <rect x="80" y="115" width="80" height="15" rx="2" fill="var(--color-accent)" opacity="0.1" />
    <text x="120" y="126" textAnchor="middle" fontSize="7" fill="var(--color-text-tertiary)" fontFamily="var(--font-mono)">PEPTIDE POWDER</text>
    <text x="120" y="152" textAnchor="middle" fontSize="9" fill="var(--color-text-secondary)" fontFamily="var(--font-family)">Enter at 45°, then straighten once through</text>
  </svg>
);

export const IllustrationInjectWater: React.FC = () => (
  <svg className="wt-illustration" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="120" y="16" textAnchor="middle" fontSize="8" fill="var(--color-text-tertiary)" fontFamily="var(--font-mono)">CROSS-SECTION VIEW</text>
    {/* Vial cross-section */}
    <rect x="55" y="25" width="130" height="120" rx="8" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
    {/* Inner wall lines */}
    <line x1="65" y1="35" x2="65" y2="135" stroke="var(--color-text-tertiary)" strokeWidth="0.5" strokeDasharray="2 2" />
    <line x1="175" y1="35" x2="175" y2="135" stroke="var(--color-text-tertiary)" strokeWidth="0.5" strokeDasharray="2 2" />
    {/* Water trickling down the wall (CORRECT - left side) */}
    <path d="M75 35 Q 70 55 68 75 Q 66 95 67 115" stroke="var(--color-accent)" strokeWidth="2.5" fill="none" opacity="0.7" />
    <circle cx="68" cy="50" r="2.5" fill="var(--color-accent)" opacity="0.3" />
    <circle cx="67" cy="70" r="3" fill="var(--color-accent)" opacity="0.25" />
    <circle cx="68" cy="90" r="2.5" fill="var(--color-accent)" opacity="0.3" />
    {/* Correct label */}
    <rect x="14" y="65" width="38" height="18" rx="3" fill="var(--color-status-success)" opacity="0.15" />
    <text x="33" y="78" textAnchor="middle" fontSize="8" fill="var(--color-status-success)" fontFamily="var(--font-mono)" fontWeight="600">GOOD</text>
    {/* X mark for center spray (WRONG) */}
    <line x1="125" y1="35" x2="125" y2="95" stroke="var(--color-status-error)" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="125" cy="107" r="9" stroke="var(--color-status-error)" strokeWidth="1.5" fill="none" />
    <line x1="120" y1="102" x2="130" y2="112" stroke="var(--color-status-error)" strokeWidth="1.8" />
    <line x1="130" y1="102" x2="120" y2="112" stroke="var(--color-status-error)" strokeWidth="1.8" />
    {/* Wrong label */}
    <text x="153" y="104" fontSize="7" fill="var(--color-status-error)" fontFamily="var(--font-mono)" fontWeight="500">DON'T</text>
    <text x="153" y="114" fontSize="7" fill="var(--color-status-error)" fontFamily="var(--font-mono)" fontWeight="500">SPRAY ON</text>
    <text x="153" y="124" fontSize="7" fill="var(--color-status-error)" fontFamily="var(--font-mono)" fontWeight="500">POWDER</text>
    {/* Powder at bottom */}
    <rect x="65" y="125" width="110" height="12" rx="2" fill="var(--color-accent)" opacity="0.12" />
    <text x="120" y="134" textAnchor="middle" fontSize="6" fill="var(--color-text-tertiary)" fontFamily="var(--font-mono)">POWDER</text>
    {/* Caption */}
    <text x="120" y="165" textAnchor="middle" fontSize="9" fill="var(--color-text-secondary)" fontFamily="var(--font-family)">Aim water down the inside wall, never onto powder</text>
  </svg>
);

export const IllustrationSwirl: React.FC = () => (
  <svg className="wt-illustration" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Vial */}
    <rect x="85" y="25" width="50" height="90" rx="6" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
    <rect x="93" y="17" width="34" height="14" rx="3" fill="var(--color-accent-muted)" stroke="var(--color-accent)" strokeWidth="1.2" />
    {/* Solution inside */}
    <rect x="90" y="65" width="40" height="45" rx="2" fill="var(--color-accent)" opacity="0.12" />
    {/* Circular motion arrows */}
    <path d="M65 70 A 55 55 0 0 1 155 70" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" markerEnd="url(#ac1)" />
    <path d="M155 70 A 55 55 0 0 1 65 70" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" markerEnd="url(#ac1)" />
    {/* Swirl = good */}
    <rect x="20" y="122" width="60" height="20" rx="4" fill="var(--color-status-success)" opacity="0.12" />
    <circle cx="35" cy="132" r="7" stroke="var(--color-status-success)" strokeWidth="1.5" fill="none" />
    <polyline points="31,132 34,135 39,129" stroke="var(--color-status-success)" strokeWidth="1.5" fill="none" />
    <text x="52" y="136" fontSize="9" fill="var(--color-status-success)" fontFamily="var(--font-mono)" fontWeight="600">SWIRL</text>
    {/* Shake = bad */}
    <rect x="148" y="122" width="80" height="20" rx="4" fill="var(--color-status-error)" opacity="0.12" />
    <circle cx="163" cy="132" r="7" stroke="var(--color-status-error)" strokeWidth="1.5" fill="none" />
    <line x1="159" y1="128" x2="167" y2="136" stroke="var(--color-status-error)" strokeWidth="1.5" />
    <line x1="167" y1="128" x2="159" y2="136" stroke="var(--color-status-error)" strokeWidth="1.5" />
    <text x="180" y="136" fontSize="9" fill="var(--color-status-error)" fontFamily="var(--font-mono)" fontWeight="600">SHAKE</text>
    <defs><marker id="ac1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="var(--color-accent)" /></marker></defs>
    <text x="120" y="155" textAnchor="middle" fontSize="9" fill="var(--color-text-secondary)" fontFamily="var(--font-family)">Gentle circular motion until fully dissolved</text>
  </svg>
);

export const IllustrationSyringeDose: React.FC<{ units: number }> = ({ units }) => {
  const fillPx = Math.min((units / 100) * 100, 100);
  return (
    <svg className="wt-illustration" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Syringe body */}
      <rect x="95" y="10" width="30" height="110" rx="4" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
      <rect x="102" y="2" width="16" height="12" rx="2" fill="var(--color-text-secondary)" />
      <line x1="110" y1="2" x2="110" y2="-5" stroke="var(--color-text-secondary)" strokeWidth="2.5" />
      {/* Fill level */}
      <rect x="100" y={120 - fillPx} width="20" height={fillPx} rx="1" fill="var(--color-accent)" opacity="0.25" />
      {/* Needle */}
      <line x1="110" y1="120" x2="110" y2="145" stroke="var(--color-text-secondary)" strokeWidth="1.2" />
      <circle cx="110" cy="146" r="1" fill="var(--color-text-secondary)" />
      {/* Unit markings */}
      {[0, 25, 50, 75, 100].map((mark) => (
        <React.Fragment key={mark}>
          <line x1="123" y1={120 - mark} x2={mark % 50 === 0 ? 133 : 128} y2={120 - mark} stroke="var(--color-text-tertiary)" strokeWidth="0.8" />
          <text x="137" y={123 - mark} fontSize="7" fill="var(--color-text-tertiary)" fontFamily="var(--font-mono)">{mark}</text>
        </React.Fragment>
      ))}
      {/* Target line */}
      <line x1="88" y1={120 - fillPx} x2="130" y2={120 - fillPx} stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="58" y={123 - fillPx} textAnchor="middle" fontSize="12" fill="var(--color-accent)" fontFamily="var(--font-mono)" fontWeight="700">{formatUnits(units)}</text>
      <text x="58" y={135 - fillPx} textAnchor="middle" fontSize="7" fill="var(--color-accent)" fontFamily="var(--font-mono)">UNITS</text>
      {/* Arrow */}
      <path d={`M73 ${120 - fillPx} L86 ${120 - fillPx}`} stroke="var(--color-accent)" strokeWidth="1.2" markerEnd="url(#ad1)" />
      <defs><marker id="ad1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="var(--color-accent)" /></marker></defs>
      <text x="120" y="155" textAnchor="middle" fontSize="9" fill="var(--color-text-secondary)" fontFamily="var(--font-family)">Draw to the marked line for your dose</text>
    </svg>
  );
};

// ---- Hero Syringe Visual for "The Draw" Step ----
// Large, detailed syringe SVG that adapts to selected syringe size (30/50/100 units)
// with glowing purple fill to the exact calculated unit line
export const SyringeHeroVisual: React.FC<{
  maxUnits: number;      // 30, 50, or 100
  fillUnits: number;     // calculated units to draw
  isOverflow: boolean;   // true if fillUnits > maxUnits
}> = ({ maxUnits, fillUnits, isOverflow }) => {
  const barrelHeight = 280;
  const barrelY = 60;
  const barrelX = 100;
  const barrelWidth = 60;
  const needleLength = 50;

  // Clamp fill to max for visual
  const clampedFill = Math.min(fillUnits, maxUnits);
  const fillRatio = maxUnits > 0 ? clampedFill / maxUnits : 0;
  const fillHeight = fillRatio * barrelHeight;
  const fillY = barrelY + barrelHeight - fillHeight;

  // Generate tick marks
  const ticks: number[] = [];
  if (maxUnits === 30) {
    for (let i = 0; i <= 30; i += 5) ticks.push(i);
  } else if (maxUnits === 50) {
    for (let i = 0; i <= 50; i += 10) ticks.push(i);
  } else {
    for (let i = 0; i <= 100; i += 10) ticks.push(i);
  }

  // Syringe label
  const syringeLabel = maxUnits === 30 ? '0.3 mL' : maxUnits === 50 ? '0.5 mL' : '1.0 mL';

  const accentColor = isOverflow ? 'var(--color-error)' : 'var(--color-accent)';

  return (
    <svg
      className="wt-hero-syringe"
      viewBox="0 0 300 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="syringeFill" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={isOverflow ? '#ff453a' : '#2EBAC6'} stopOpacity="0.9" />
          <stop offset="100%" stopColor={isOverflow ? '#ff6b63' : '#5CE0EB'} stopOpacity="0.5" />
        </linearGradient>
        <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id="heroArrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10" fill={accentColor} />
        </marker>
      </defs>

      {/* Plunger handle */}
      <rect x={barrelX + 10} y="10" width={barrelWidth - 20} height="20" rx="4" fill="var(--color-text-tertiary)" opacity="0.5" />
      <rect x={barrelX + 15} y="30" width={barrelWidth - 30} height="30" rx="3" fill="var(--color-text-tertiary)" opacity="0.3" />

      {/* Barrel body */}
      <rect
        x={barrelX}
        y={barrelY}
        width={barrelWidth}
        height={barrelHeight}
        rx="8"
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
        fill="var(--color-bg-tertiary)"
      />

      {/* Fill liquid with glow */}
      {clampedFill > 0 && (
        <rect
          x={barrelX + 4}
          y={fillY}
          width={barrelWidth - 8}
          height={fillHeight}
          rx="4"
          fill="url(#syringeFill)"
          filter="url(#glowFilter)"
        />
      )}

      {/* Tick marks */}
      {ticks.map((tick) => {
        const tickY = barrelY + barrelHeight - (tick / maxUnits) * barrelHeight;
        const isMajor = tick % (maxUnits <= 30 ? 10 : 25) === 0 || tick === 0 || tick === maxUnits;
        return (
          <React.Fragment key={tick}>
            <line
              x1={barrelX + barrelWidth}
              y1={tickY}
              x2={barrelX + barrelWidth + (isMajor ? 16 : 8)}
              y2={tickY}
              stroke="var(--color-text-tertiary)"
              strokeWidth={isMajor ? 1.2 : 0.8}
            />
            {isMajor && (
              <text
                x={barrelX + barrelWidth + 22}
                y={tickY + 4}
                fontSize="13"
                fill="var(--color-text-tertiary)"
                fontFamily="var(--font-mono)"
                fontWeight="500"
              >
                {tick}
              </text>
            )}
          </React.Fragment>
        );
      })}

      {/* Target fill line + arrow */}
      {clampedFill > 0 && (
        <>
          <line
            x1={barrelX - 40}
            y1={fillY}
            x2={barrelX + barrelWidth + 10}
            y2={fillY}
            stroke={accentColor}
            strokeWidth="2.5"
            strokeDasharray="6 3"
            opacity="0.8"
          />
          {/* Arrow pointing to fill line */}
          <line
            x1={barrelX - 55}
            y1={fillY}
            x2={barrelX - 42}
            y2={fillY}
            stroke={accentColor}
            strokeWidth="2.5"
            markerEnd="url(#heroArrow)"
          />
          {/* Units label */}
          <text
            x={barrelX - 60}
            y={fillY - 10}
            textAnchor="end"
            fontSize="28"
            fill={accentColor}
            fontFamily="var(--font-mono)"
            fontWeight="700"
          >
            {formatUnits(fillUnits)}
          </text>
          <text
            x={barrelX - 60}
            y={fillY + 12}
            textAnchor="end"
            fontSize="11"
            fill={accentColor}
            fontFamily="var(--font-mono)"
            fontWeight="600"
            letterSpacing="0.08em"
          >
            UNITS
          </text>
        </>
      )}

      {/* Needle hub */}
      <rect
        x={barrelX + 15}
        y={barrelY + barrelHeight}
        width={barrelWidth - 30}
        height="14"
        rx="3"
        fill="var(--color-text-secondary)"
        opacity="0.6"
      />
      {/* Needle */}
      <line
        x1={barrelX + barrelWidth / 2}
        y1={barrelY + barrelHeight + 14}
        x2={barrelX + barrelWidth / 2}
        y2={barrelY + barrelHeight + 14 + needleLength}
        stroke="var(--color-text-secondary)"
        strokeWidth="1.5"
      />
      <circle
        cx={barrelX + barrelWidth / 2}
        cy={barrelY + barrelHeight + 14 + needleLength + 2}
        r="1.5"
        fill="var(--color-text-secondary)"
      />

      {/* Syringe size label */}
      <text
        x={barrelX + barrelWidth / 2}
        y={barrelY + barrelHeight + 14 + needleLength + 25}
        textAnchor="middle"
        fontSize="13"
        fill="var(--color-text-tertiary)"
        fontFamily="var(--font-mono)"
        fontWeight="500"
      >
        {syringeLabel} insulin syringe
      </text>
    </svg>
  );
};
