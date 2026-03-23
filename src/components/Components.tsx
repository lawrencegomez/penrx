// ============================================
// PenRx Shared UI Components
// Premium button, card, input, badge, modal
// ============================================

import React from 'react';
import './Components.css';

/* ---- Button ---- */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => (
  <button
    className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <span className="btn-spinner" />}
    {icon && !loading && <span className="btn-icon">{icon}</span>}
    {children}
  </button>
);

/* ---- Card ---- */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glass?: boolean;
  glow?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  glass = false,
  glow = false,
  padding = 'md',
}) => (
  <div
    className={`card card-pad-${padding} ${glass ? 'card-glass' : ''} ${glow ? 'card-glow' : ''} ${onClick ? 'card-interactive' : ''} ${className}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
  >
    {children}
  </div>
);

/* ---- Input ---- */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  suffix?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helper,
  error,
  suffix,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className={`input-group ${error ? 'input-error' : ''} ${className}`}>
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input id={inputId} className="input-field" {...props} />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {helper && !error && <span className="input-helper">{helper}</span>}
    </div>
  );
};

/* ---- Badge ---- */
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => (
  <span className={`badge badge-${variant} badge-${size} ${className}`}>
    {children}
  </span>
);

/* ---- Modal (Bottom Sheet) ---- */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-sheet animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        {title && <h3 className="modal-title">{title}</h3>}
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

/* ---- Empty State ---- */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => (
  <div className="empty-state">
    {icon && <div className="empty-state-icon">{icon}</div>}
    <h3 className="empty-state-title">{title}</h3>
    {description && <p className="empty-state-desc">{description}</p>}
    {action && <div className="empty-state-action">{action}</div>}
  </div>
);

/* ---- Progress Bar ---- */
interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  label,
}) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`progress-bar progress-bar-${size}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
    </div>
  );
};

/* ---- Select ---- */
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  helper?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  helper,
}) => {
  const selectId = `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="input-group">
      {label && <label htmlFor={selectId} className="input-label">{label}</label>}
      <div className="input-wrapper">
        <select
          id={selectId}
          className="input-field select-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="select-arrow">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      {helper && <span className="input-helper">{helper}</span>}
    </div>
  );
};
