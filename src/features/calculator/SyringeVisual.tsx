// ============================================
// Syringe Visual Component — SVG syringe with animated fill
// ============================================

import React from 'react';
import { SyringeType } from '../../data/types';
import './SyringeVisual.css';

interface SyringeVisualProps {
  unitsToFill: number;
  maxUnits: number;
  syringeType: SyringeType;
}

export const SyringeVisual: React.FC<SyringeVisualProps> = ({
  unitsToFill,
  maxUnits,
  syringeType,
}) => {
  const fillPercent = Math.min(100, Math.max(0, (unitsToFill / maxUnits) * 100));
  
  // Generate tick marks
  const majorTicks = syringeType === SyringeType.U30 ? 6 : syringeType === SyringeType.U50 ? 5 : 10;
  const unitsPerMajor = maxUnits / majorTicks;
  
  const ticks = [];
  for (let i = 0; i <= majorTicks; i++) {
    const unitValue = i * unitsPerMajor;
    const yPercent = 100 - (unitValue / maxUnits) * 100;
    ticks.push({
      y: yPercent,
      label: unitValue.toString(),
      isMajor: true,
    });
    // Add minor ticks between majors (except last)
    if (i < majorTicks) {
      const minorY = 100 - ((unitValue + unitsPerMajor / 2) / maxUnits) * 100;
      ticks.push({
        y: minorY,
        label: '',
        isMajor: false,
      });
    }
  }

  return (
    <div className="syringe-container" aria-label={`Syringe showing ${unitsToFill} units to fill out of ${maxUnits}`}>
      <svg viewBox="0 0 120 320" className="syringe-svg" aria-hidden="true">
        {/* Plunger */}
        <rect x="48" y="10" width="24" height="12" rx="2" fill="var(--color-bg-elevated)" stroke="var(--color-border-hover)" strokeWidth="1"/>
        <rect x="56" y="0" width="8" height="16" rx="2" fill="var(--color-bg-elevated)" stroke="var(--color-border-hover)" strokeWidth="1"/>
        
        {/* Barrel */}
        <rect x="38" y="22" width="44" height="240" rx="4" fill="var(--color-bg-tertiary)" stroke="var(--color-border-hover)" strokeWidth="1.5"/>
        
        {/* Fill */}
        <rect
          x="40"
          y={22 + 236 * (1 - fillPercent / 100)}
          width="40"
          height={236 * (fillPercent / 100)}
          rx="2"
          className="syringe-fill"
        />
        
        {/* Fill line indicator */}
        {fillPercent > 0 && fillPercent < 100 && (
          <line
            x1="36"
            y1={22 + 236 * (1 - fillPercent / 100)}
            x2="84"
            y2={22 + 236 * (1 - fillPercent / 100)}
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="syringe-fill-line"
          />
        )}
        
        {/* Tick marks */}
        {ticks.map((tick, i) => {
          const y = 22 + (tick.y / 100) * 236;
          return (
            <g key={i}>
              <line
                x1={tick.isMajor ? 82 : 78}
                y1={y}
                x2={tick.isMajor ? 96 : 88}
                y2={y}
                stroke="var(--color-text-tertiary)"
                strokeWidth={tick.isMajor ? 1.5 : 0.75}
              />
              {tick.isMajor && (
                <text
                  x="104"
                  y={y + 4}
                  fill="var(--color-text-secondary)"
                  fontSize="10"
                  fontFamily="var(--font-family)"
                >
                  {tick.label}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Needle hub */}
        <rect x="52" y="262" width="16" height="16" rx="2" fill="var(--color-bg-elevated)" stroke="var(--color-border-hover)" strokeWidth="1"/>
        
        {/* Needle */}
        <line x1="60" y1="278" x2="60" y2="318" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="60" cy="318" r="1" fill="var(--color-text-tertiary)"/>
      </svg>
    </div>
  );
};
