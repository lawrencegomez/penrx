// ============================================
// PenRx Inventory Page
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { v4 as uuid } from 'uuid';
import { Card, Button, Badge, EmptyState, Modal, Input, Select } from '../../components/Components';
import { calculateConcentration, calculateDosesPerVial, formatNumber } from '../../utils/calculations';
import './InventoryPage.css';

const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const inventory = useLiveQuery(() => db.inventory.toArray()) || [];
  const peptides = useLiveQuery(() => db.peptides.toArray()) || [];

  const activeItems = inventory.filter((i) => i.isActive);
  const expiredItems = inventory.filter((i) => !i.isActive);

  const getDaysUntilExpiry = (expirationDate: string) => {
    const now = new Date();
    const exp = new Date(expirationDate);
    const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getExpiryBadge = (days: number) => {
    if (days <= 0) return { variant: 'error' as const, text: 'Expired' };
    if (days <= 5) return { variant: 'error' as const, text: `${days}d left` };
    if (days <= 14) return { variant: 'warning' as const, text: `${days}d left` };
    return { variant: 'success' as const, text: `${days}d left` };
  };

  const handleArchive = async (id: string) => {
    await db.inventory.update(id, { isActive: false });
  };

  return (
    <div className="page page-enter">
      <button className="detail-back" onClick={() => navigate('/profile')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Profile
      </button>

      <div className="page-header">
        <h1 className="page-title">Inventory</h1>
        <p className="page-subtitle">Track your vials and doses remaining</p>
      </div>

      <Button variant="primary" onClick={() => setShowAddModal(true)} style={{ marginBottom: 'var(--space-6)' }}>
        + Add Vial
      </Button>

      {activeItems.length > 0 ? (
        <div className="inv-list stagger-children">
          {activeItems.map((item) => {
            const daysLeft = getDaysUntilExpiry(item.expirationDate);
            const expiryBadge = getExpiryBadge(daysLeft);
            const isLow = item.dosesRemaining <= 3;

            return (
              <Card key={item.id} className="inv-card" padding="md">
                <div className="inv-header">
                  <h3 className="inv-name">{item.peptideName}</h3>
                  <Badge variant={expiryBadge.variant} size="sm">{expiryBadge.text}</Badge>
                </div>

                <div className="inv-details">
                  <div className="inv-detail">
                    <span className="inv-label">Vial</span>
                    <span className="inv-value">{item.vialSizeMg}mg + {item.bacWaterMl}mL BAC</span>
                  </div>
                  <div className="inv-detail">
                    <span className="inv-label">Reconstituted</span>
                    <span className="inv-value">{new Date(item.dateReconstituted).toLocaleDateString()}</span>
                  </div>
                  <div className="inv-detail">
                    <span className="inv-label">Doses Remaining</span>
                    <span className={`inv-value ${isLow ? 'inv-low' : ''}`}>
                      {item.dosesRemaining} of {item.totalDoses}
                    </span>
                  </div>
                </div>

                {isLow && (
                  <div className="inv-alert">
                    Low stock — {item.dosesRemaining} doses remaining. Consider reordering.
                  </div>
                )}

                <div className="protocol-actions">
                  <Button variant="ghost" size="sm" onClick={() => handleArchive(item.id)}>
                    Archive
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
          title="No vials tracked"
          description="Add your first vial to track doses remaining and expiration dates."
        />
      )}

      <AddVialModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        peptides={peptides}
      />
    </div>
  );
};

// ---- Add Vial Modal ----
interface AddVialModalProps {
  isOpen: boolean;
  onClose: () => void;
  peptides: { id: string; name: string }[];
}

const AddVialModal: React.FC<AddVialModalProps> = ({ isOpen, onClose, peptides }) => {
  const [peptideId, setPeptideId] = useState('');
  const [vialSizeMg, setVialSizeMg] = useState('');
  const [bacWaterMl, setBacWaterMl] = useState('');
  const [doseMcg, setDoseMcg] = useState('');
  const [saving, setSaving] = useState(false);

  const peptideOptions = peptides.map((p) => ({ value: p.id, label: p.name }));
  const selectedPeptide = peptides.find((p) => p.id === peptideId);

  const vial = parseFloat(vialSizeMg) || 0;
  const water = parseFloat(bacWaterMl) || 0;
  const dose = parseFloat(doseMcg) || 0;
  const canSave = peptideId && vial > 0 && water > 0 && dose > 0;

  const handleSave = async () => {
    if (!canSave || !selectedPeptide) return;
    setSaving(true);
    const concentration = calculateConcentration(vial, water);
    const totalDoses = calculateDosesPerVial(vial, dose);
    const now = new Date().toISOString();
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
      totalDoses,
      dosesUsed: 0,
      dosesRemaining: totalDoses,
      isActive: true,
      createdAt: now,
    });

    setPeptideId('');
    setVialSizeMg('');
    setBacWaterMl('');
    setDoseMcg('');
    setSaving(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Vial">
      <Select
        label="Peptide"
        options={[{ value: '', label: 'Select...' }, ...peptideOptions]}
        value={peptideId}
        onChange={setPeptideId}
      />
      <Input label="Vial Size" type="number" inputMode="decimal" placeholder="e.g. 5" suffix="mg" value={vialSizeMg} onChange={(e) => setVialSizeMg(e.target.value)} />
      <Input label="BAC Water" type="number" inputMode="decimal" placeholder="e.g. 2" suffix="mL" value={bacWaterMl} onChange={(e) => setBacWaterMl(e.target.value)} />
      <Input label="Dose per injection" type="number" inputMode="decimal" placeholder="e.g. 250" suffix="mcg" value={doseMcg} onChange={(e) => setDoseMcg(e.target.value)} helper="Used to calculate total doses in the vial" />
      <Button variant="primary" size="lg" fullWidth disabled={!canSave} loading={saving} onClick={handleSave}>
        Add to Inventory
      </Button>
    </Modal>
  );
};

export default InventoryPage;
