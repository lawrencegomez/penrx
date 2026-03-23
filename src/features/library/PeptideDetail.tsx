// ============================================
// PenRx Peptide Detail Page
// ============================================

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { Card, Badge, Button } from '../../components/Components';
import { CATEGORY_LABELS, REGULATORY_LABELS, RegulatoryStatus, SideEffectFrequency } from '../../data/types';
import './PeptideDetail.css';

const PeptideDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const peptide = useLiveQuery(
    () => db.peptides.where('slug').equals(slug || '').first(),
    [slug]
  );

  if (!peptide) {
    return (
      <div className="page">
        <div className="empty-state">
          <h3 className="empty-state-title">Peptide not found</h3>
          <Button variant="ghost" onClick={() => navigate('/library')}>Back to Library</Button>
        </div>
      </div>
    );
  }

  const getRegulatoryColor = (status: RegulatoryStatus) => {
    const map: Record<RegulatoryStatus, string> = {
      [RegulatoryStatus.FDA_APPROVED]: 'success',
      [RegulatoryStatus.CATEGORY_1]: 'info',
      [RegulatoryStatus.CATEGORY_2]: 'info',
      [RegulatoryStatus.INVESTIGATIONAL]: 'warning',
      [RegulatoryStatus.RESEARCH]: 'default',
    };
    return map[status] as 'success' | 'info' | 'warning' | 'default';
  };

  return (
    <div className="page page-enter">
      {/* Back Button */}
      <button className="detail-back" onClick={() => navigate('/library')} aria-label="Back to library">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Library
      </button>

      {/* Header */}
      <div className="detail-header animate-fade-in-up">
        <h1 className="detail-name">{peptide.name}</h1>
        {peptide.alternateNames.length > 0 && (
          <p className="detail-aliases">Also known as: {peptide.alternateNames.join(', ')}</p>
        )}
        <div className="detail-badges">
          <Badge variant="accent" size="md">{CATEGORY_LABELS[peptide.category]}</Badge>
          <Badge variant={getRegulatoryColor(peptide.regulatoryStatus)} size="md">
            {REGULATORY_LABELS[peptide.regulatoryStatus]}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <section className="detail-section animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <h2 className="detail-section-title">Overview</h2>
        <p className="detail-text">{peptide.fullDescription}</p>
      </section>

      {/* Protocols */}
      <section className="detail-section animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        <h2 className="detail-section-title">Commonly Reported Protocols</h2>
        {peptide.commonProtocols.map((proto, i) => (
          <Card key={i} className="detail-protocol-card" padding="md">
            <div className="detail-proto-row">
              <span className="detail-proto-label">Dosing Range</span>
              <span className="detail-proto-value">{proto.dosingRange}</span>
            </div>
            <div className="detail-proto-row">
              <span className="detail-proto-label">Frequency</span>
              <span className="detail-proto-value">{proto.frequency}</span>
            </div>
            <div className="detail-proto-row">
              <span className="detail-proto-label">Route</span>
              <span className="detail-proto-value">{proto.route}</span>
            </div>
            <div className="detail-proto-row">
              <span className="detail-proto-label">Duration</span>
              <span className="detail-proto-value">{proto.duration}</span>
            </div>
            {proto.notes && (
              <p className="detail-proto-notes">{proto.notes}</p>
            )}
            {proto.source && (
              <span className="detail-proto-source">Source: {proto.source}</span>
            )}
          </Card>
        ))}
      </section>

      {/* Reconstitution */}
      <section className="detail-section animate-fade-in-up" style={{ animationDelay: '180ms' }}>
        <h2 className="detail-section-title">Reconstitution</h2>
        <p className="detail-text">{peptide.reconstitutionGuide}</p>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => navigate('/calculator/walkthrough')}
          style={{ marginTop: 'var(--space-4)' }}
        >
          🧪 Start Guided Reconstitution
        </Button>
      </section>

      {/* Storage */}
      <section className="detail-section animate-fade-in-up" style={{ animationDelay: '240ms' }}>
        <h2 className="detail-section-title">Storage</h2>
        <Card padding="md">
          <div className="detail-proto-row">
            <span className="detail-proto-label">Temperature</span>
            <span className="detail-proto-value">{peptide.storage.temperature}</span>
          </div>
          <div className="detail-proto-row">
            <span className="detail-proto-label">Light Sensitive</span>
            <span className="detail-proto-value">{peptide.storage.lightSensitivity ? 'Yes — protect from light' : 'No'}</span>
          </div>
          <div className="detail-proto-row">
            <span className="detail-proto-label">Shelf Life</span>
            <span className="detail-proto-value">{peptide.storage.shelfLife}</span>
          </div>
        </Card>
      </section>

      {/* Half-life */}
      <section className="detail-section animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h2 className="detail-section-title">Half-Life</h2>
        <Card padding="md" glass>
          <div className="detail-halflife">
            <span className="detail-halflife-value">{peptide.halfLife.value}</span>
            <span className="detail-halflife-unit">{peptide.halfLife.unit}</span>
          </div>
          {peptide.halfLife.source && (
            <span className="detail-proto-source">{peptide.halfLife.source}</span>
          )}
        </Card>
      </section>

      {/* Side Effects */}
      {peptide.sideEffects.length > 0 && (
        <section className="detail-section animate-fade-in-up" style={{ animationDelay: '360ms' }}>
          <h2 className="detail-section-title">Commonly Reported Side Effects</h2>
          <div className="detail-effects">
            {peptide.sideEffects.map((effect, i) => (
              <div key={i} className="detail-effect-row">
                <span className="detail-effect-name">{effect.name}</span>
                <Badge
                  variant={
                    effect.frequency === SideEffectFrequency.COMMON ? 'warning' :
                    effect.frequency === SideEffectFrequency.OCCASIONAL ? 'info' : 'default'
                  }
                  size="sm"
                >
                  {effect.frequency}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stacking Partners */}
      {peptide.stackingPartners.length > 0 && (
        <section className="detail-section animate-fade-in-up" style={{ animationDelay: '420ms' }}>
          <h2 className="detail-section-title">Common Stacking Partners</h2>
          {peptide.stackingPartners.map((partner, i) => (
            <Card
              key={i}
              padding="md"
              onClick={() => navigate(`/library/${partner.peptideId}`)}
              className="detail-partner-card"
            >
              <span className="detail-partner-name">{partner.peptideName}</span>
              <p className="detail-partner-notes">{partner.notes}</p>
            </Card>
          ))}
        </section>
      )}

      {/* Sources */}
      {peptide.sources.length > 0 && (
        <section className="detail-section animate-fade-in-up" style={{ animationDelay: '480ms' }}>
          <h2 className="detail-section-title">Sources</h2>
          <div className="detail-sources">
            {peptide.sources.map((source, i) => (
              <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="detail-source-link">
                <Badge variant="accent" size="sm">{source.type.toUpperCase()}</Badge>
                <span>{source.title}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ))}
          </div>
        </section>
      )}

      <p className="disclaimer" style={{ marginTop: 'var(--space-6)' }}>
        Educational information only — sourced from published research. Consult your healthcare provider before starting any protocol.
      </p>
    </div>
  );
};

export default PeptideDetail;
