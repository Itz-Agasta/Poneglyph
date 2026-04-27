"use client";

import { useState } from "react";
import { IconAlertCircle, IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label className="label">
        <span>{label}</span>
        {hint}
      </label>
      {children}
      <div className="field-error" data-show={!!error}>
        {error && (
          <>
            <IconAlertCircle width={12} height={12} /> {error}
          </>
        )}
      </div>
    </div>
  );
}

export function PasswordInput({
  value,
  onChange,
  placeholder,
  invalid,
  autoComplete,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  invalid?: boolean;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="input-wrap">
      <IconLock className="input-icon" />
      <input
        className="input"
        type={show ? "text" : "password"}
        data-has-icon="true"
        data-has-trailing="true"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
      />
      <button
        type="button"
        className="input-trail"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <IconEyeOff width={16} height={16} /> : <IconEye width={16} height={16} />}
      </button>
    </div>
  );
}

export function scoreStrength(p: string) {
  if (!p) return { level: 0, label: "" };
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p) && p.length >= 10) s++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { level: s, label: labels[s] };
}

export function VisualPane({ _isSignup = false }: { _isSignup?: boolean }) {
  return (
    <div className="pane-visual">
      <div className="glyph">
        <svg viewBox="0 0 600 600" fill="none">
          <circle
            cx="300"
            cy="300"
            r="240"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          <circle
            cx="300"
            cy="300"
            r="180"
            stroke="rgba(0,0,0,0.16)"
            strokeWidth="1"
          />
          <circle
            cx="300"
            cy="300"
            r="120"
            stroke="rgba(0,0,0,0.20)"
            strokeWidth="1"
          />
          <g
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M240 240 L260 220 L280 240 L260 260 Z" />
            <path d="M340 240 L360 230 L380 250" />
            <path d="M250 320 L290 320 M260 340 L280 340" />
            <path d="M340 320 L360 310 L380 320 L370 340 L350 340 Z" />
            <circle cx="300" cy="380" r="8" />
            <path d="M280 400 L320 400" />
          </g>
        </svg>
      </div>
      <div className="visual-card">
        <p className="quote">
          &quot;The history is etched in stone. The choice — <em>that&apos;s yours</em>.&quot;
        </p>
        <div className="cite">
          <span className="cite-avatar"></span>
          <span>Nico Robin &middot; Archaeologist, Ohara</span>
        </div>
      </div>
    </div>
  );
}