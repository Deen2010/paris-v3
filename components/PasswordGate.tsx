'use client';

import { useEffect, useState, FormEvent } from 'react';

const STORAGE_KEY = 'bcm_access_granted';
const PASSWORD = 'Streetwear';

type Phase = 'locked' | 'unlocking' | 'unlocked';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>('locked');
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [animateBrand, setAnimateBrand] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') {
        setPhase('unlocked');
      }
    } catch {}
    setChecked(true);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim() === PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {}
      setError(false);
      setAnimateBrand(true);
      // Start the curtain reveal sequence
      setTimeout(() => setPhase('unlocking'), 320);
      setTimeout(() => setPhase('unlocked'), 1250);
    } else {
      setError(true);
    }
  }

  if (!checked) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#BDB8B0' }} />;
  }

  if (phase === 'unlocked') {
    return (
      <div className="site-reveal" style={{ minHeight: '100vh' }}>
        {children}
      </div>
    );
  }

  return (
    <>
      {/* Site rendered behind the curtain so it's already there when curtain lifts */}
      {phase === 'unlocking' && (
        <div className="site-reveal" style={{ minHeight: '100vh' }}>
          {children}
        </div>
      )}

      <div
        className={phase === 'unlocking' ? 'gate-curtain-out' : ''}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          minHeight: '100vh',
          backgroundColor: '#BDB8B0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          className={phase === 'unlocking' ? 'gate-content-out' : ''}
          style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}
        >
          <div
            className={animateBrand ? 'brand-pulse' : ''}
            style={{
              fontSize: 12,
              letterSpacing: '0.2em',
              color: '#6B1818',
              marginBottom: 24,
              fontWeight: 600,
            }}
          >
            BIG CLOTHING MAINZ
          </div>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 56,
              lineHeight: 1.05,
              margin: '0 0 12px',
              color: '#0F0E0C',
              fontWeight: 600,
            }}
          >
            Members <em style={{ color: '#6B1818' }}>only.</em>
          </h1>
          <p style={{ color: '#0F0E0C', opacity: 0.75, marginBottom: 32, fontSize: 15 }}>
            Bitte gib das Passwort ein, um die Collection zu sehen.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Passwort"
              autoFocus
              autoComplete="off"
              disabled={phase !== 'locked'}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 15,
                border: error ? '1px solid #6B1818' : '1px solid rgba(15,14,12,0.2)',
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.6)',
                outline: 'none',
                color: '#0F0E0C',
                fontFamily: 'inherit',
              }}
            />
            {error && (
              <div style={{ color: '#6B1818', fontSize: 13, textAlign: 'left' }}>
                Falsches Passwort. Versuch's nochmal.
              </div>
            )}
            <button
              type="submit"
              disabled={phase !== 'locked'}
              style={{
                padding: '14px 16px',
                fontSize: 13,
                letterSpacing: '0.18em',
                fontWeight: 600,
                backgroundColor: '#0F0E0C',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: phase === 'locked' ? 'pointer' : 'default',
                textTransform: 'uppercase',
              }}
            >
              Eintreten
            </button>
          </form>

          <div style={{ marginTop: 28, fontSize: 12, color: '#0F0E0C', opacity: 0.6 }}>
            Kein Passwort? DM{' '}
            <a
              href="https://instagram.com/bigclothingmainz"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#6B1818', textDecoration: 'none', fontWeight: 600 }}
            >
              @bigclothingmainz
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
