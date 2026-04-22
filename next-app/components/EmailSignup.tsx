'use client';

import { useState } from 'react';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    setStatus(res.ok ? 'success' : 'error');
  };

  return (
    <div className="rounded-2xl px-8 py-7" style={{ backgroundColor: '#7E9E8A' }}>
      <p className="mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#2D3028' }}>
        Get meeting notes delivered to your inbox the moment they're ready.
      </p>

      {status === 'success' ? (
        <p className="text-sm" style={{ color: '#2D3028' }}>You're subscribed. We'll email you when new minutes are posted.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-stretch rounded-xl" style={{ backgroundColor: '#C0CABC' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="flex-1 min-w-0 px-4 py-3 text-sm bg-transparent focus:outline-none rounded-l-xl placeholder-[#354830]"
            style={{ color: '#2D3028' }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-5 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-60 shrink-0 rounded-r-xl"
            style={{ backgroundColor: '#354830' }}
          >
            {status === 'loading' ? 'Signing up…' : 'Sign up'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-300 text-xs mt-2">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
