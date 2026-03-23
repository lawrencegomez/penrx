// ============================================
// PenRx Home Page — Dashboard
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { Card, Button, Badge, EmptyState } from '../../components/Components';
import type { DoseLog, Protocol, ScheduledDose } from '../../data/types';
import { InjectionSite, INJECTION_SITE_LABELS } from '../../data/types';
import { DoseLogModal } from './DoseLogModal';
import { formatUnits } from '../../utils/calculations';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [now, setNow] = useState(new Date());

  // Refresh "now" every minute for countdowns
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const protocols = useLiveQuery(() => db.protocols.where('isActive').equals(1).toArray()) || [];
  const userProfile = useLiveQuery(() => db.userProfile.get('default'));
  const todayLogs = useLiveQuery(async () => {
    const today = new Date().toISOString().split('T')[0];
    return db.doseLogs
      .where('loggedTime')
      .startsWith(today)
      .toArray();
  }) || [];

  // Check onboarding
  useEffect(() => {
    if (userProfile && !userProfile.hasCompletedOnboarding) {
      navigate('/onboarding');
    }
  }, [userProfile, navigate]);

  // Calculate streak
  const streak = useLiveQuery(async () => {
    if (protocols.length === 0) return 0;
    const logs = await db.doseLogs.orderBy('loggedTime').reverse().toArray();
    if (logs.length === 0) return 0;

    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasLog = logs.some((l) => l.loggedTime.startsWith(dateStr));
      if (hasLog) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [protocols.length]) ?? 0;

  // Build today's schedule
  const schedule = useMemo<ScheduledDose[]>(() => {
    return protocols.map((protocol) => {
      const todayLog = todayLogs.find((l) => l.protocolId === protocol.id);
      return {
        id: `sched-${protocol.id}`,
        protocolId: protocol.id,
        peptideName: protocol.peptideName,
        doseMcg: protocol.doseMcg,
        units: protocol.unitsToFill,
        scheduledTime: protocol.timesOfDay[0] || '08:00',
        isCompleted: !!todayLog,
        doseLogId: todayLog?.id,
      };
    });
  }, [protocols, todayLogs]);

  const completedCount = schedule.filter((s) => s.isCompleted).length;
  const pendingCount = schedule.length - completedCount;

  const handleQuickLog = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setShowLogModal(true);
  };

  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [now]);

  return (
    <div className="page page-enter">
      {/* Header */}
      <div className="home-header">
        <h1 className="home-greeting">{greeting}</h1>
        <p className="home-date">
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Streak */}
      {protocols.length > 0 && (
        <Card glass className="home-streak-card animate-fade-in-up">
          <div className="home-streak-inner">
            <div className="home-streak-number animate-glow">
              {streak}
            </div>
            <div className="home-streak-label">
              <span className="home-streak-text">day streak</span>
              <span className="home-streak-sub">{streak > 0 ? 'Keep it going!' : 'Start your first day!'}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Today's Schedule */}
      {protocols.length > 0 ? (
        <div className="home-section stagger-children">
          <div className="home-section-header">
            <h2 className="home-section-title">Today's Schedule</h2>
            <Badge variant={pendingCount > 0 ? 'warning' : 'success'} size="md">
              {completedCount}/{schedule.length} done
            </Badge>
          </div>

          {schedule.map((item) => {
            const protocol = protocols.find((p) => p.id === item.protocolId);
            return (
              <Card
                key={item.id}
                className={`schedule-card ${item.isCompleted ? 'schedule-done' : ''}`}
                padding="md"
              >
                <div className="schedule-row">
                  <div className="schedule-status">
                    {item.isCompleted ? (
                      <div className="schedule-check">✓</div>
                    ) : (
                      <div className="schedule-pending" />
                    )}
                  </div>
                  <div className="schedule-info">
                    <span className="schedule-name">{item.peptideName}</span>
                    <span className="schedule-dose">{item.doseMcg} mcg · {formatUnits(item.units)} units</span>
                  </div>
                  {!item.isCompleted && protocol && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleQuickLog(protocol)}
                    >
                      Log
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L12 8" /><path d="M9 5h6" /><rect x="8" y="8" width="8" height="14" rx="2" /><path d="M10 12h4" /><path d="M10 15h4" /></svg>}
          title="No active protocols"
          description="Set up your first peptide protocol to start tracking your doses."
          action={
            <Button variant="primary" onClick={() => navigate('/protocols')}>
              Add Protocol
            </Button>
          }
        />
      )}

      {/* Quick Actions */}
      <div className="home-actions animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <Card padding="sm" className="home-action-card" onClick={() => navigate('/calculator')}>
          <span className="home-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></svg></span>
          <span className="home-action-label">Calculator</span>
        </Card>
        <Card padding="sm" className="home-action-card" onClick={() => navigate('/library')}>
          <span className="home-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span>
          <span className="home-action-label">Library</span>
        </Card>
        <Card padding="sm" className="home-action-card" onClick={() => navigate('/profile/injection-sites')}>
          <span className="home-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/><circle cx="12" cy="13" r="1" fill="currentColor"/></svg></span>
          <span className="home-action-label">Site Map</span>
        </Card>
        <Card padding="sm" className="home-action-card" onClick={() => navigate('/profile/inventory')}>
          <span className="home-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></span>
          <span className="home-action-label">Inventory</span>
        </Card>
      </div>

      {/* Disclaimer */}
      <p className="disclaimer" style={{ marginTop: 'var(--space-6)' }}>
        Educational information only — consult your healthcare provider.
      </p>

      {/* Quick Log FAB */}
      {protocols.length > 0 && pendingCount > 0 && (
        <button
          className="fab animate-scale-in"
          onClick={() => {
            const pending = schedule.find((s) => !s.isCompleted);
            if (pending) {
              const protocol = protocols.find((p) => p.id === pending.protocolId);
              if (protocol) handleQuickLog(protocol);
            }
          }}
          aria-label="Quick log dose"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      {/* Dose Log Modal */}
      <DoseLogModal
        isOpen={showLogModal}
        onClose={() => { setShowLogModal(false); setSelectedProtocol(null); }}
        protocol={selectedProtocol}
      />
    </div>
  );
};

export default HomePage;
