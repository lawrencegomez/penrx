// ============================================
// PenRx Profile Page
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, exportAllData } from '../../data/db';
import { Card, Button } from '../../components/Components';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = useLiveQuery(() => db.userProfile.get('default'));
  const protocolCount = useLiveQuery(() => db.protocols.count()) ?? 0;
  const doseLogCount = useLiveQuery(() => db.doseLogs.count()) ?? 0;

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `penrx-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleResetOnboarding = async () => {
    await db.userProfile.update('default', {
      hasCompletedOnboarding: false,
      hasAcceptedDisclaimer: false,
      updatedAt: new Date().toISOString(),
    });
    navigate('/onboarding');
  };

  return (
    <div className="page page-enter">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Settings & data management</p>
      </div>

      {/* Stats */}
      <div className="profile-stats animate-fade-in-up">
        <Card glass padding="md" className="profile-stat">
          <span className="profile-stat-value">{protocolCount}</span>
          <span className="profile-stat-label">Protocols</span>
        </Card>
        <Card glass padding="md" className="profile-stat">
          <span className="profile-stat-value">{doseLogCount}</span>
          <span className="profile-stat-label">Doses Logged</span>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="profile-links stagger-children">
        <Card padding="md" onClick={() => navigate('/profile/inventory')} className="profile-link-card">
          <span className="profile-link-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></span>
          <div className="profile-link-text">
            <span className="profile-link-title">Inventory</span>
            <span className="profile-link-desc">Track your vials and doses remaining</span>
          </div>
          <span className="profile-link-arrow">›</span>
        </Card>

        <Card padding="md" onClick={() => navigate('/profile/injection-sites')} className="profile-link-card">
          <span className="profile-link-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/><circle cx="12" cy="13" r="1" fill="currentColor"/></svg></span>
          <div className="profile-link-text">
            <span className="profile-link-title">Injection Site Map</span>
            <span className="profile-link-desc">View rotation and site history</span>
          </div>
          <span className="profile-link-arrow">›</span>
        </Card>
      </div>

      {/* Settings */}
      <div className="profile-section">
        <h2 className="profile-section-title">Settings</h2>

        <Card padding="md" className="profile-settings-card">
          <div className="profile-setting">
            <span className="profile-setting-label">Notifications</span>
            <button
              className={`profile-toggle ${userProfile?.notificationsEnabled ? 'profile-toggle-on' : ''}`}
              onClick={async () => {
                if (!userProfile?.notificationsEnabled) {
                  if ('Notification' in window) {
                    const perm = await Notification.requestPermission();
                    if (perm === 'granted') {
                      await db.userProfile.update('default', { notificationsEnabled: true, updatedAt: new Date().toISOString() });
                    }
                  }
                } else {
                  await db.userProfile.update('default', { notificationsEnabled: false, updatedAt: new Date().toISOString() });
                }
              }}
              aria-label="Toggle notifications"
            >
              <span className="profile-toggle-thumb" />
            </button>
          </div>

          <div className="profile-setting">
            <span className="profile-setting-label">Dark Mode</span>
            <button
              className={`profile-toggle ${userProfile?.darkMode !== false ? 'profile-toggle-on' : ''}`}
              onClick={() => db.userProfile.update('default', { darkMode: !(userProfile?.darkMode !== false), updatedAt: new Date().toISOString() })}
              aria-label="Toggle dark mode"
            >
              <span className="profile-toggle-thumb" />
            </button>
          </div>
        </Card>
      </div>

      {/* Data Management */}
      <div className="profile-section">
        <h2 className="profile-section-title">Data</h2>
        <div className="profile-data-actions">
          <Button variant="secondary" fullWidth onClick={handleExport}>
            Export All Data (JSON)
          </Button>
          <Button variant="ghost" fullWidth onClick={handleResetOnboarding}>
            Reset Onboarding
          </Button>
        </div>
      </div>

      {/* About */}
      <div className="profile-section">
        <h2 className="profile-section-title">About</h2>
        <Card padding="md" className="profile-about">
          <p className="profile-about-name">PenRx</p>
          <p className="profile-about-version">Version 1.0.0 MVP</p>
          <p className="profile-about-desc">
            Your premium peptide companion. Educational information only — always consult your healthcare provider.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
