// ============================================
// PenRx Database (Dexie / IndexedDB)
// ============================================

import Dexie, { type Table } from 'dexie';
import type {
  Peptide,
  Protocol,
  DoseLog,
  InventoryItem,
  Reminder,
  UserProfile,
} from './types';
import { seedPeptides } from './seed/peptides';

export class PenRxDatabase extends Dexie {
  peptides!: Table<Peptide, string>;
  protocols!: Table<Protocol, string>;
  doseLogs!: Table<DoseLog, string>;
  inventory!: Table<InventoryItem, string>;
  reminders!: Table<Reminder, string>;
  userProfile!: Table<UserProfile, string>;

  constructor() {
    super('PenRxDB');

    this.version(1).stores({
      peptides: 'id, slug, category, name, *tags',
      protocols: 'id, peptideId, isActive, createdAt',
      doseLogs: 'id, protocolId, peptideId, loggedTime, createdAt',
      inventory: 'id, peptideId, isActive, expirationDate',
      reminders: 'id, protocolId, isEnabled',
      userProfile: 'id',
    });
  }
}

export const db = new PenRxDatabase();

// Seed peptide library on first open
db.on('populate', async () => {
  await db.peptides.bulkAdd(seedPeptides);
  await db.userProfile.add({
    id: 'default',
    hasCompletedOnboarding: false,
    hasAcceptedDisclaimer: false,
    notificationsEnabled: false,
    measurementUnit: 'imperial',
    darkMode: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
});

// Data export utility
export async function exportAllData(): Promise<string> {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    peptides: await db.peptides.toArray(),
    protocols: await db.protocols.toArray(),
    doseLogs: await db.doseLogs.toArray(),
    inventory: await db.inventory.toArray(),
    reminders: await db.reminders.toArray(),
    userProfile: await db.userProfile.toArray(),
  };
  return JSON.stringify(data, null, 2);
}
