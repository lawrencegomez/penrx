// ============================================
// PenRx Peptide Library Page
// ============================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { Card, Badge } from '../../components/Components';
import { PeptideCategory, CATEGORY_LABELS, REGULATORY_LABELS, RegulatoryStatus } from '../../data/types';
import './LibraryPage.css';

const CATEGORY_COLORS: Partial<Record<PeptideCategory, string>> = {
  [PeptideCategory.GLP1]: 'var(--color-cat-glp1)',
  [PeptideCategory.GH_SECRETAGOGUE]: 'var(--color-cat-gh)',
  [PeptideCategory.HEALING_RECOVERY]: 'var(--color-cat-healing)',
  [PeptideCategory.ANTI_AGING]: 'var(--color-cat-antiaging)',
  [PeptideCategory.SEXUAL_HEALTH]: 'var(--color-cat-sexual)',
  [PeptideCategory.COGNITIVE]: 'var(--color-cat-cognitive)',
  [PeptideCategory.IMMUNE]: 'var(--color-cat-immune)',
  [PeptideCategory.HRT]: 'var(--color-cat-hrt)',
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: PeptideCategory.GLP1, label: 'GLP-1 & Weight Loss' },
  { value: PeptideCategory.HEALING_RECOVERY, label: 'Healing & Recovery' },
  { value: PeptideCategory.GH_SECRETAGOGUE, label: 'Growth Hormone' },
  { value: PeptideCategory.ANTI_AGING, label: 'Anti-Aging' },
  { value: PeptideCategory.SEXUAL_HEALTH, label: 'Sexual Health' },
];

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const peptides = useLiveQuery(() => db.peptides.toArray()) || [];

  const filtered = useMemo(() => {
    let result = peptides;
    if (activeFilter !== 'all') {
      result = result.filter((p) => p.category === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.alternateNames.some((a) => a.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }
    return result;
  }, [peptides, activeFilter, search]);

  const getRegulatoryBadge = (status: RegulatoryStatus) => {
    const variants: Record<RegulatoryStatus, 'success' | 'info' | 'warning' | 'default'> = {
      [RegulatoryStatus.FDA_APPROVED]: 'success',
      [RegulatoryStatus.CATEGORY_1]: 'info',
      [RegulatoryStatus.CATEGORY_2]: 'info',
      [RegulatoryStatus.INVESTIGATIONAL]: 'warning',
      [RegulatoryStatus.RESEARCH]: 'default',
    };
    return variants[status] || 'default';
  };

  return (
    <div className="page page-enter">
      <div className="page-header">
        <h1 className="page-title">Peptide Library</h1>
        <p className="page-subtitle">Research-backed profiles for every compound</p>
      </div>

      {/* Search */}
      <div className="library-search">
        <div className="library-search-wrapper">
          <svg className="library-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="library-search-input"
            placeholder="Search peptides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search peptides"
          />
          {search && (
            <button className="library-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="library-filters">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`library-filter-chip ${activeFilter === opt.value ? 'library-filter-active' : ''}`}
            onClick={() => setActiveFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="library-grid stagger-children">
        {filtered.map((peptide) => (
          <Card
            key={peptide.id}
            className="library-card"
            onClick={() => navigate(`/library/${peptide.slug}`)}
            padding="md"
          >
            <div className="library-card-header">
              <div
                className="library-card-dot"
                style={{ background: CATEGORY_COLORS[peptide.category] || 'var(--color-text-tertiary)' }}
              />
              <Badge variant={getRegulatoryBadge(peptide.regulatoryStatus)} size="sm">
                {REGULATORY_LABELS[peptide.regulatoryStatus]}
              </Badge>
            </div>
            <h3 className="library-card-name">{peptide.name}</h3>
            <span className="library-card-category" style={{ color: CATEGORY_COLORS[peptide.category] }}>
              {CATEGORY_LABELS[peptide.category]}
            </span>
            <p className="library-card-desc">{peptide.shortDescription}</p>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <h3 className="empty-state-title">No peptides found</h3>
          <p className="empty-state-desc">Try adjusting your search or filter.</p>
        </div>
      )}

      <p className="disclaimer" style={{ marginTop: 'var(--space-6)' }}>
        Educational information only — sourced from published research. Consult your healthcare provider.
      </p>
    </div>
  );
};

export default LibraryPage;
