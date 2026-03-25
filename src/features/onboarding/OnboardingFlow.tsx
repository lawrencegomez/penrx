// ============================================
// PenRx Onboarding Flow
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../data/db';
import { Button, Card } from '../../components/Components';
import type { UserProfile } from '../../data/types';
import './OnboardingFlow.css';

type Step = 'welcome' | 'user-type' | 'disclaimer' | 'complete';

// ---- SVG Icons ----

const VialIcon = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L12 8" />
    <path d="M9 5h6" />
    <rect x="8" y="8" width="8" height="14" rx="2" />
    <path d="M10 12h4" />
    <path d="M10 15h4" />
  </svg>
);

const ReconIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6v3a6 6 0 0 1-6 6H9V3z" />
    <path d="M15 6a6 6 0 0 1 0 6h0" />
    <line x1="12" y1="15" x2="12" y2="21" />
    <line x1="9" y1="21" x2="15" y2="21" />
  </svg>
);

const TrackingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const LibraryIconOB = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ---- Component ----

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('welcome');
  const [userType, setUserType] = useState<UserProfile['userType']>(undefined);

  const handleComplete = async () => {
    await db.userProfile.update('default', {
      hasCompletedOnboarding: true,
      hasAcceptedDisclaimer: true,
      userType,
      updatedAt: new Date().toISOString(),
    });
    navigate('/');
  };

  const handleStartProtocol = async () => {
    await db.userProfile.update('default', {
      hasCompletedOnboarding: true,
      hasAcceptedDisclaimer: true,
      userType,
      updatedAt: new Date().toISOString(),
    });
    navigate('/calculator/walkthrough');
  };

  const goToNext = () => setStep('user-type');

  return (
    <div className="onboarding">
      {/* ============================================
          Welcome — Landing Page
          ============================================ */}
      {step === 'welcome' && (
        <div className="ob-landing">
          {/* Hero */}
          <section className="ob-landing-hero">
            <div className="ob-hero-logo animate-breathe">
              <VialIcon size={40} />
            </div>
            <h1 className="ob-hero-headline">
              Take the guesswork out of peptides
            </h1>
            <p className="ob-hero-subtitle">
              Precision reconstitution, smart tracking, and a research library — all in one app.
            </p>
            <div className="ob-hero-cta">
              <Button variant="primary" size="lg" fullWidth onClick={goToNext}>
                Get Started
              </Button>
            </div>
            <div className="ob-trust-badges">
              <span className="ob-trust-badge">
                <CheckIcon /> No account needed
              </span>
              <span className="ob-trust-badge">
                <CheckIcon /> Works offline
              </span>
              <span className="ob-trust-badge">
                <CheckIcon /> 100% private
              </span>
            </div>
          </section>

          {/* Features */}
          <section className="ob-section ob-section-alt">
            <span className="ob-section-label">Features</span>
            <h2 className="ob-section-heading">Everything you need</h2>
            <div className="ob-feature-cards stagger-children">
              <div className="ob-feature-card">
                <span className="ob-feature-card-icon"><ReconIcon /></span>
                <div className="ob-feature-card-content">
                  <span className="ob-feature-card-title">Guided Reconstitution</span>
                  <span className="ob-feature-card-desc">
                    Step-by-step walkthrough for mixing peptides. Auto-calculates BAC water ratios and syringe units.
                  </span>
                </div>
              </div>
              <div className="ob-feature-card">
                <span className="ob-feature-card-icon"><TrackingIcon /></span>
                <div className="ob-feature-card-content">
                  <span className="ob-feature-card-title">Smart Dose Tracking</span>
                  <span className="ob-feature-card-desc">
                    Log doses in under 5 seconds. Track injection sites, manage multiple protocols, and monitor your streak.
                  </span>
                </div>
              </div>
              <div className="ob-feature-card">
                <span className="ob-feature-card-icon"><LibraryIconOB /></span>
                <div className="ob-feature-card-content">
                  <span className="ob-feature-card-title">Research Library</span>
                  <span className="ob-feature-card-desc">
                    Plain-English guides on popular peptides. Dosing references, storage tips, and safety information.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="ob-section">
            <span className="ob-section-label">How It Works</span>
            <h2 className="ob-section-heading">Simple as 1-2-3</h2>
            <div className="ob-steps">
              <div className="ob-step">
                <div className="ob-step-indicator">
                  <div className="ob-step-number">1</div>
                  <div className="ob-step-line" />
                </div>
                <div className="ob-step-content">
                  <div className="ob-step-title">Enter your peptide details</div>
                  <div className="ob-step-desc">
                    Tell us what peptide you have, its concentration, and your target dose.
                  </div>
                </div>
              </div>
              <div className="ob-step">
                <div className="ob-step-indicator">
                  <div className="ob-step-number">2</div>
                  <div className="ob-step-line" />
                </div>
                <div className="ob-step-content">
                  <div className="ob-step-title">Follow the guided walkthrough</div>
                  <div className="ob-step-desc">
                    We'll walk you through reconstitution, drawing, and injection — step by step.
                  </div>
                </div>
              </div>
              <div className="ob-step">
                <div className="ob-step-indicator">
                  <div className="ob-step-number">3</div>
                </div>
                <div className="ob-step-content">
                  <div className="ob-step-title">Track and manage your protocols</div>
                  <div className="ob-step-desc">
                    Log every dose, rotate injection sites, and keep your streak going.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="ob-section ob-section-alt ob-bottom-cta">
            <h2 className="ob-section-heading">Ready to get started?</h2>
            <p className="ob-bottom-cta-subtitle">Your peptide companion is waiting.</p>
            <div className="ob-bottom-cta-btn">
              <Button variant="primary" size="lg" fullWidth onClick={goToNext}>
                Get Started
              </Button>
            </div>
            <p className="ob-bottom-disclaimer">
              Educational information only — always consult your healthcare provider.
            </p>
          </section>
        </div>
      )}

      {/* ============================================
          User Type
          ============================================ */}
      {step === 'user-type' && (
        <div className="ob-screen animate-fade-in-up">
          <h1 className="ob-title">What brings you here?</h1>
          <p className="ob-subtitle">This helps us personalize your experience.</p>

          <div className="ob-type-options stagger-children">
            <Card
              className={`ob-type-card ${userType === 'first_timer' ? 'ob-type-selected' : ''}`}
              padding="lg"
              onClick={() => setUserType('first_timer')}
            >
              <div className="ob-type-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <span className="ob-type-label">I'm starting my first peptide</span>
              <span className="ob-type-desc">I need guidance through every step</span>
            </Card>

            <Card
              className={`ob-type-card ${userType === 'experienced' ? 'ob-type-selected' : ''}`}
              padding="lg"
              onClick={() => setUserType('experienced')}
            >
              <div className="ob-type-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="ob-type-label">I'm already taking peptides</span>
              <span className="ob-type-desc">I want a better way to track my protocols</span>
            </Card>

            <Card
              className={`ob-type-card ${userType === 'exploring' ? 'ob-type-selected' : ''}`}
              padding="lg"
              onClick={() => setUserType('exploring')}
            >
              <div className="ob-type-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <span className="ob-type-label">I'm exploring and want to learn</span>
              <span className="ob-type-desc">Just curious — show me the library</span>
            </Card>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!userType}
            onClick={() => setStep('disclaimer')}
          >
            Continue
          </Button>
        </div>
      )}

      {/* ============================================
          Disclaimer
          ============================================ */}
      {step === 'disclaimer' && (
        <div className="ob-screen animate-fade-in-up">
          <h1 className="ob-title">Important Disclaimer</h1>

          <Card padding="lg" className="ob-disclaimer-card">
            <p className="ob-disclaimer-text">
              PenRx provides <strong>educational information</strong> about peptides and injectable compounds for research and informational purposes only.
            </p>
            <p className="ob-disclaimer-text">
              PenRx <strong>does not provide</strong> medical advice, diagnosis, treatment recommendations, or dosing instructions.
            </p>
            <p className="ob-disclaimer-text">
              All information is sourced from published research and publicly available medical literature.
            </p>
            <p className="ob-disclaimer-text">
              <strong>Always consult a qualified healthcare professional</strong> before starting, changing, or stopping any protocol.
            </p>
            <p className="ob-disclaimer-text ob-disclaimer-small">
              By continuing, you acknowledge that you have read and understood this disclaimer.
            </p>
          </Card>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setStep('complete')}
          >
            I Acknowledge
          </Button>
        </div>
      )}

      {/* ============================================
          Complete
          ============================================ */}
      {step === 'complete' && (
        <div className="ob-screen ob-complete animate-scale-in">
          <div className="ob-complete-check">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="ob-title">You're all set</h1>
          <p className="ob-subtitle">What would you like to do first?</p>

          <div className="ob-complete-actions">
            <Button variant="primary" size="lg" fullWidth onClick={handleStartProtocol}>
              Set Up My First Protocol
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={() => {
              handleComplete();
            }}>
              Explore the Library
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={handleComplete}>
              Skip to dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;
