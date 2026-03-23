// ============================================
// Dose Log Modal — Quick-log bottom sheet
// ============================================

import React, { useState } from 'react';
import { db } from '../../data/db';
import { v4 as uuid } from 'uuid';
import { Modal, Button } from '../../components/Components';
import { InjectionSite, INJECTION_SITE_LABELS } from '../../data/types';
import type { Protocol } from '../../data/types';
import './DoseLogModal.css';

interface DoseLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocol: Protocol | null;
}

export const DoseLogModal: React.FC<DoseLogModalProps> = ({ isOpen, onClose, protocol }) => {
  const [selectedSite, setSelectedSite] = useState<InjectionSite>(InjectionSite.ABDOMEN_LEFT);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!protocol) return null;

  const handleLog = async () => {
    setSaving(true);
    try {
      const now = new Date().toISOString();
      await db.doseLogs.add({
        id: uuid(),
        protocolId: protocol.id,
        peptideId: protocol.peptideId,
        peptideName: protocol.peptideName,
        doseMcg: protocol.doseMcg,
        units: protocol.unitsToFill,
        injectionSite: selectedSite,
        loggedTime: now,
        notes: notes || undefined,
        createdAt: now,
      });

      // Update inventory doses used if applicable
      const activeInventory = await db.inventory
        .where('peptideId').equals(protocol.peptideId)
        .and((item) => item.isActive)
        .first();
      if (activeInventory) {
        await db.inventory.update(activeInventory.id, {
          dosesUsed: activeInventory.dosesUsed + 1,
          dosesRemaining: activeInventory.dosesRemaining - 1,
        });
      }

      setNotes('');
      onClose();
    } catch (err) {
      console.error('Failed to log dose:', err);
    } finally {
      setSaving(false);
    }
  };

  const sites = Object.values(InjectionSite);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Dose">
      <div className="log-summary">
        <span className="log-peptide">{protocol.peptideName}</span>
        <span className="log-dose">{protocol.doseMcg} mcg · {protocol.unitsToFill} units</span>
      </div>

      <div className="log-sites">
        <label className="input-label">Injection Site</label>
        <div className="log-sites-grid">
          {sites.map((site) => (
            <button
              key={site}
              className={`log-site-btn ${selectedSite === site ? 'log-site-active' : ''}`}
              onClick={() => setSelectedSite(site)}
            >
              {INJECTION_SITE_LABELS[site]}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label className="input-label" htmlFor="log-notes">Notes (optional)</label>
        <div className="input-wrapper">
          <input
            id="log-notes"
            className="input-field"
            placeholder="Any observations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={saving}
        onClick={handleLog}
      >
        Log Dose ✓
      </Button>
    </Modal>
  );
};
