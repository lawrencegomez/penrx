// ============================================
// PenRx Protocols Page
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { v4 as uuid } from 'uuid';
import { Card, Button, Badge, EmptyState, Modal, Input, Select } from '../../components/Components';
import { FrequencyPattern, FREQUENCY_LABELS, SyringeType } from '../../data/types';
import type { Protocol } from '../../data/types';
import { calculateConcentration, calculateUnitsToFill, calculateDosesPerVial, formatUnits } from '../../utils/calculations';
import './ProtocolsPage.css';

const ProtocolsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

  const protocols = useLiveQuery(() => db.protocols.toArray()) || [];
  const peptides = useLiveQuery(() => db.peptides.toArray()) || [];

  // Dose logs for counts
  const doseLogs = useLiveQuery(() => db.doseLogs.toArray()) || [];

  const activeProtocols = protocols.filter((p) => p.isActive);
  const inactiveProtocols = protocols.filter((p) => !p.isActive);

  const getLogCount = (protocolId: string) => doseLogs.filter((l) => l.protocolId === protocolId).length;

  const handleDelete = async (id: string) => {
    await db.protocols.delete(id);
  };

  const handleToggleActive = async (protocol: Protocol) => {
    await db.protocols.update(protocol.id, { isActive: !protocol.isActive, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="page page-enter">
      <div className="page-header">
        <h1 className="page-title">Protocols</h1>
        <p className="page-subtitle">Your active peptide protocols</p>
      </div>

      {/* Add Protocol */}
      <div className="protocols-actions">
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          + Add Protocol
        </Button>
        <Button variant="secondary" onClick={() => navigate('/calculator/walkthrough')}>
          🧪 Guided Setup
        </Button>
      </div>

      {/* Active Protocols */}
      {activeProtocols.length > 0 ? (
        <div className="protocols-section stagger-children">
          <h2 className="protocols-section-title">Active</h2>
          {activeProtocols.map((protocol) => (
            <Card key={protocol.id} className="protocol-card" padding="md">
              <div className="protocol-header">
                <div>
                  <h3 className="protocol-name">{protocol.peptideName}</h3>
                  <span className="protocol-dose">{protocol.doseMcg} mcg · {formatUnits(protocol.unitsToFill)} units</span>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <div className="protocol-details">
                <div className="protocol-detail">
                  <span className="protocol-detail-label">Frequency</span>
                  <span className="protocol-detail-value">{FREQUENCY_LABELS[protocol.frequency]}</span>
                </div>
                <div className="protocol-detail">
                  <span className="protocol-detail-label">Vial</span>
                  <span className="protocol-detail-value">{protocol.vialSizeMg}mg + {protocol.bacWaterMl}mL BAC</span>
                </div>
                <div className="protocol-detail">
                  <span className="protocol-detail-label">Doses Logged</span>
                  <span className="protocol-detail-value">{getLogCount(protocol.id)}</span>
                </div>
              </div>
              <div className="protocol-actions">
                <Button variant="ghost" size="sm" onClick={() => handleToggleActive(protocol)}>
                  Pause
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(protocol.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<span>📋</span>}
          title="No active protocols"
          description="Add a protocol to start tracking your peptide regimen."
          action={
            <Button variant="primary" onClick={() => navigate('/calculator/walkthrough')}>
              Start Guided Setup
            </Button>
          }
        />
      )}

      {/* Inactive */}
      {inactiveProtocols.length > 0 && (
        <div className="protocols-section">
          <h2 className="protocols-section-title">Paused</h2>
          {inactiveProtocols.map((protocol) => (
            <Card key={protocol.id} className="protocol-card protocol-paused" padding="md">
              <div className="protocol-header">
                <div>
                  <h3 className="protocol-name">{protocol.peptideName}</h3>
                  <span className="protocol-dose">{protocol.doseMcg} mcg</span>
                </div>
                <Badge variant="default" size="sm">Paused</Badge>
              </div>
              <div className="protocol-actions">
                <Button variant="ghost" size="sm" onClick={() => handleToggleActive(protocol)}>
                  Resume
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(protocol.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Protocol Modal */}
      <AddProtocolModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        peptides={peptides}
      />
    </div>
  );
};

// ---- Add Protocol Modal ----
interface AddProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  peptides: { id: string; name: string }[];
}

const FREQUENCY_OPTIONS = Object.entries(FREQUENCY_LABELS)
  .filter(([key]) => key !== FrequencyPattern.CUSTOM)
  .map(([value, label]) => ({ value, label }));

const AddProtocolModal: React.FC<AddProtocolModalProps> = ({ isOpen, onClose, peptides }) => {
  const [peptideId, setPeptideId] = useState('');
  const [vialSizeMg, setVialSizeMg] = useState('');
  const [bacWaterMl, setBacWaterMl] = useState('');
  const [doseMcg, setDoseMcg] = useState('');
  const [frequency, setFrequency] = useState(FrequencyPattern.DAILY);
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
    try {
      const concentration = calculateConcentration(vial, water);
      const units = calculateUnitsToFill(dose, vial, water, SyringeType.U100);
      const now = new Date().toISOString();

      await db.protocols.add({
        id: uuid(),
        peptideId: selectedPeptide.id,
        peptideName: selectedPeptide.name,
        vialSizeMg: vial,
        bacWaterMl: water,
        doseMcg: dose,
        syringeType: SyringeType.U100,
        concentrationMcgPerUnit: concentration,
        unitsToFill: units,
        frequency,
        timesOfDay: ['08:00'],
        isActive: true,
        startDate: now.split('T')[0],
        createdAt: now,
        updatedAt: now,
      });

      // Reset form
      setPeptideId('');
      setVialSizeMg('');
      setBacWaterMl('');
      setDoseMcg('');
      setFrequency(FrequencyPattern.DAILY);
      onClose();
    } catch (err) {
      console.error('Failed to add protocol:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Protocol">
      <Select
        label="Peptide"
        options={[{ value: '', label: 'Select a peptide...' }, ...peptideOptions]}
        value={peptideId}
        onChange={setPeptideId}
      />
      <Input
        label="Vial Size"
        type="number"
        inputMode="decimal"
        placeholder="e.g. 5"
        suffix="mg"
        value={vialSizeMg}
        onChange={(e) => setVialSizeMg(e.target.value)}
      />
      <Input
        label="BAC Water Added"
        type="number"
        inputMode="decimal"
        placeholder="e.g. 2"
        suffix="mL"
        value={bacWaterMl}
        onChange={(e) => setBacWaterMl(e.target.value)}
      />
      <Input
        label="Dose"
        type="number"
        inputMode="decimal"
        placeholder="e.g. 250"
        suffix="mcg"
        value={doseMcg}
        onChange={(e) => setDoseMcg(e.target.value)}
      />
      <Select
        label="Frequency"
        options={FREQUENCY_OPTIONS}
        value={frequency}
        onChange={(v) => setFrequency(v as FrequencyPattern)}
      />
      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!canSave}
        loading={saving}
        onClick={handleSave}
      >
        Save Protocol
      </Button>
    </Modal>
  );
};

export default ProtocolsPage;
