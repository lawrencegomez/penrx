// ============================================
// PenRx App Layout — Bottom Tab Navigation
// ============================================

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';

interface Tab {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ProtocolIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const CalculatorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="10" y2="10"/>
    <line x1="14" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="10" y2="14"/>
    <line x1="14" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="10" y2="18"/>
    <line x1="14" y1="18" x2="16" y2="18"/>
  </svg>
);

const LibraryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <line x1="8" y1="7" x2="16" y2="7"/>
    <line x1="8" y1="11" x2="13" y2="11"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const tabs: Tab[] = [
  { path: '/', label: 'Home', icon: <HomeIcon /> },
  { path: '/protocols', label: 'Protocols', icon: <ProtocolIcon /> },
  { path: '/calculator', label: 'Calculator', icon: <CalculatorIcon /> },
  { path: '/library', label: 'Library', icon: <LibraryIcon /> },
  { path: '/profile', label: 'Profile', icon: <ProfileIcon /> },
];

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show tab bar during onboarding
  const isOnboarding = location.pathname.startsWith('/onboarding');

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return '/';
    const match = tabs.find((t) => t.path !== '/' && path.startsWith(t.path));
    return match?.path || '/';
  };

  return (
    <div className="layout">
      <main className="layout-main">
        {children}
      </main>
      {!isOnboarding && (
        <nav className="tab-bar" aria-label="Main navigation">
          {tabs.map((tab) => {
            const isActive = getActiveTab() === tab.path;
            return (
              <button
                key={tab.path}
                className={`tab-item ${isActive ? 'tab-active' : ''}`}
                onClick={() => navigate(tab.path)}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                {isActive && <span className="tab-indicator" />}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};
