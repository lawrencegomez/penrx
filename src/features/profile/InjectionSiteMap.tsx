// ============================================
// PenRx Injection Site Rotation Map
// ============================================

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { Card, Badge } from '../../components/Components';
import { InjectionSite, INJECTION_SITE_LABELS } from '../../data/types';
import './InjectionSiteMap.css';

const InjectionSiteMap: React.FC = () => {
  const navigate = useNavigate();
  const doseLogs = useLiveQuery(() => db.doseLogs.orderBy('loggedTime').reverse().toArray()) || [];

  const siteData = useMemo(() => {
    const now = Date.now();
    const sites = Object.values(InjectionSite).map((site) => {
      const lastLog = doseLogs.find((l) => l.injectionSite === site);
      const hoursSinceLast = lastLog
        ? (now - new Date(lastLog.loggedTime).getTime()) / (1000 * 60 * 60)
        : Infinity;

      let status: 'ready' | 'recent' | 'used';
      if (hoursSinceLast > 48) status = 'ready';
      else if (hoursSinceLast > 24) status = 'recent';
      else status = 'used';

      return {
        site,
        label: INJECTION_SITE_LABELS[site],
        lastUsed: lastLog ? new Date(lastLog.loggedTime) : null,
        hoursSinceLast,
        status,
      };
    });

    return sites;
  }, [doseLogs]);

  // Find suggested next site
  const suggestedSite = useMemo(() => {
    const sorted = [...siteData].sort((a, b) => b.hoursSinceLast - a.hoursSinceLast);
    return sorted[0]?.site;
  }, [siteData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'var(--color-site-ready)';
      case 'recent': return 'var(--color-site-recent)';
      case 'used': return 'var(--color-site-used)';
      default: return 'var(--color-text-tertiary)';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready': return 'success';
      case 'recent': return 'warning';
      case 'used': return 'error';
      default: return 'default';
    }
  };

  // Group sites by body region for the body map
  const bodySections = [
    { label: 'Abdomen', sites: siteData.filter((s) => s.site.startsWith('abdomen')) },
    { label: 'Thighs', sites: siteData.filter((s) => s.site.startsWith('thigh')) },
    { label: 'Arms', sites: siteData.filter((s) => s.site.startsWith('arm')) },
    { label: 'Glutes', sites: siteData.filter((s) => s.site.startsWith('glute')) },
  ];

  return (
    <div className="page page-enter">
      <button className="detail-back" onClick={() => navigate('/profile')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Profile
      </button>

      <div className="page-header">
        <h1 className="page-title">Injection Sites</h1>
        <p className="page-subtitle">Track rotation and site history</p>
      </div>

      {/* Legend */}
      <div className="site-legend animate-fade-in">
        <div className="site-legend-item">
          <span className="site-legend-dot" style={{ background: 'var(--color-site-ready)' }} />
          <span>Ready ({'>'}48h)</span>
        </div>
        <div className="site-legend-item">
          <span className="site-legend-dot" style={{ background: 'var(--color-site-recent)' }} />
          <span>Recent (24–48h)</span>
        </div>
        <div className="site-legend-item">
          <span className="site-legend-dot" style={{ background: 'var(--color-site-used)' }} />
          <span>Just used ({'<'}24h)</span>
        </div>
      </div>

      {/* Body Map — Anatomical View */}
      <div className="body-map-container animate-fade-in-up">
        <svg viewBox="0 0 300 400" className="body-map-svg">
          {/* Body outline */}
          {/* Head */}
          <circle cx="150" cy="40" r="28" fill="none" stroke="var(--color-border-hover)" strokeWidth="1.5" />
          {/* Neck */}
          <line x1="150" y1="68" x2="150" y2="82" stroke="var(--color-border-hover)" strokeWidth="1.5" />
          {/* Torso */}
          <path d="M 110 82 Q 100 82 96 100 L 92 190 Q 90 210 110 220 L 125 225 Q 140 228 150 230 Q 160 228 175 225 L 190 220 Q 210 210 208 190 L 204 100 Q 200 82 190 82 Z"
            fill="none" stroke="var(--color-border-hover)" strokeWidth="1.5" />
          {/* Left Arm */}
          <path d="M 96 100 Q 80 95 68 110 L 48 170 Q 42 185 44 195"
            fill="none" stroke="var(--color-border-hover)" strokeWidth="1.5" />
          {/* Right Arm */}
          <path d="M 204 100 Q 220 95 232 110 L 252 170 Q 258 185 256 195"
            fill="none" stroke="var(--color-border-hover)" strokeWidth="1.5" />
          {/* Left Leg */}
          <path d="M 125 225 Q 120 235 118 260 L 115 330 Q 114 350 116 370"
            fill="none" stroke="var(--color-border-hover)" strokeWidth="1.5" />
          {/* Right Leg */}
          <path d="M 175 225 Q 180 235 182 260 L 185 330 Q 186 350 184 370"
            fill="none" stroke="var(--color-border-hover)" strokeWidth="1.5" />

          {/* Injection Site Zones — Interactive */}
          {/* Abdomen Left */}
          <circle cx="125" cy="170" r="16"
            fill={getStatusColor(siteData.find((s) => s.site === InjectionSite.ABDOMEN_LEFT)?.status || 'ready')}
            opacity="0.3" stroke={getStatusColor(siteData.find((s) => s.site === InjectionSite.ABDOMEN_LEFT)?.status || 'ready')}
            strokeWidth="2" className="site-zone" />
          {/* Abdomen Right */}
          <circle cx="175" cy="170" r="16"
            fill={getStatusColor(siteData.find((s) => s.site === InjectionSite.ABDOMEN_RIGHT)?.status || 'ready')}
            opacity="0.3" stroke={getStatusColor(siteData.find((s) => s.site === InjectionSite.ABDOMEN_RIGHT)?.status || 'ready')}
            strokeWidth="2" className="site-zone" />
          {/* Thigh Left */}
          <circle cx="120" cy="290" r="16"
            fill={getStatusColor(siteData.find((s) => s.site === InjectionSite.THIGH_LEFT)?.status || 'ready')}
            opacity="0.3" stroke={getStatusColor(siteData.find((s) => s.site === InjectionSite.THIGH_LEFT)?.status || 'ready')}
            strokeWidth="2" className="site-zone" />
          {/* Thigh Right */}
          <circle cx="180" cy="290" r="16"
            fill={getStatusColor(siteData.find((s) => s.site === InjectionSite.THIGH_RIGHT)?.status || 'ready')}
            opacity="0.3" stroke={getStatusColor(siteData.find((s) => s.site === InjectionSite.THIGH_RIGHT)?.status || 'ready')}
            strokeWidth="2" className="site-zone" />
          {/* Arm Left */}
          <circle cx="58" cy="145" r="14"
            fill={getStatusColor(siteData.find((s) => s.site === InjectionSite.ARM_LEFT)?.status || 'ready')}
            opacity="0.3" stroke={getStatusColor(siteData.find((s) => s.site === InjectionSite.ARM_LEFT)?.status || 'ready')}
            strokeWidth="2" className="site-zone" />
          {/* Arm Right */}
          <circle cx="242" cy="145" r="14"
            fill={getStatusColor(siteData.find((s) => s.site === InjectionSite.ARM_RIGHT)?.status || 'ready')}
            opacity="0.3" stroke={getStatusColor(siteData.find((s) => s.site === InjectionSite.ARM_RIGHT)?.status || 'ready')}
            strokeWidth="2" className="site-zone" />

          {/* Suggested site indicator */}
          {suggestedSite && (() => {
            const posMap: Record<string, {cx: number, cy: number}> = {
              [InjectionSite.ABDOMEN_LEFT]: {cx: 125, cy: 170},
              [InjectionSite.ABDOMEN_RIGHT]: {cx: 175, cy: 170},
              [InjectionSite.THIGH_LEFT]: {cx: 120, cy: 290},
              [InjectionSite.THIGH_RIGHT]: {cx: 180, cy: 290},
              [InjectionSite.ARM_LEFT]: {cx: 58, cy: 145},
              [InjectionSite.ARM_RIGHT]: {cx: 242, cy: 145},
              [InjectionSite.GLUTE_LEFT]: {cx: 125, cy: 210},
              [InjectionSite.GLUTE_RIGHT]: {cx: 175, cy: 210},
            };
            const pos = posMap[suggestedSite];
            if (!pos) return null;
            return (
              <circle cx={pos.cx} cy={pos.cy} r="20"
                fill="none" stroke="var(--color-accent)" strokeWidth="2"
                strokeDasharray="4 3" className="site-suggested" />
            );
          })()}
        </svg>
      </div>

      {/* Site List */}
      <div className="site-list stagger-children">
        {bodySections.map((section) => (
          <div key={section.label} className="site-section">
            <h3 className="site-section-title">{section.label}</h3>
            {section.sites.map((site) => (
              <Card key={site.site} padding="sm" className="site-card">
                <div className="site-card-row">
                  <span className="site-dot" style={{ background: getStatusColor(site.status) }} />
                  <div className="site-card-info">
                    <span className="site-card-label">{site.label}</span>
                    <span className="site-card-time">
                      {site.lastUsed
                        ? `Last used ${site.lastUsed.toLocaleDateString()} at ${site.lastUsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : 'Never used'}
                    </span>
                  </div>
                  <Badge variant={getStatusBadge(site.status) as 'success' | 'warning' | 'error' | 'default'} size="sm">
                    {site.status === 'ready' ? 'Ready' : site.status === 'recent' ? 'Recent' : 'Just Used'}
                  </Badge>
                  {site.site === suggestedSite && (
                    <span className="site-suggested-label">★ Next</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InjectionSiteMap;
