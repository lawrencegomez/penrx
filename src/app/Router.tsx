// ============================================
// PenRx Router
// ============================================

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';

// Lazy load feature pages for code splitting
const HomePage = lazy(() => import('../features/home/HomePage'));
const ProtocolsPage = lazy(() => import('../features/protocols/ProtocolsPage'));
const CalculatorPage = lazy(() => import('../features/calculator/CalculatorPage'));
const LibraryPage = lazy(() => import('../features/library/LibraryPage'));
const PeptideDetail = lazy(() => import('../features/library/PeptideDetail'));
const ProfilePage = lazy(() => import('../features/profile/ProfilePage'));
const InventoryPage = lazy(() => import('../features/profile/InventoryPage'));
const InjectionSiteMap = lazy(() => import('../features/profile/InjectionSiteMap'));
const OnboardingFlow = lazy(() => import('../features/onboarding/OnboardingFlow'));
const GuidedWalkthrough = lazy(() => import('../features/calculator/GuidedWalkthrough'));

const PageLoader: React.FC = () => (
  <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="animate-pulse" style={{ color: 'var(--color-text-tertiary)' }}>
      Loading...
    </div>
  </div>
);

export const Router: React.FC = () => (
  <BrowserRouter>
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/protocols" element={<ProtocolsPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/calculator/walkthrough" element={<GuidedWalkthrough />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/library/:slug" element={<PeptideDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/inventory" element={<InventoryPage />} />
          <Route path="/profile/injection-sites" element={<InjectionSiteMap />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
        </Routes>
      </Suspense>
    </Layout>
  </BrowserRouter>
);
