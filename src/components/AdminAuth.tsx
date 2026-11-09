'use client';

import { useEffect, useState } from 'react';

interface AdminAuthProps {
  children: React.ReactNode;
}

const SESSION_EXPIRED_EVENT = 'admin-session-expired';

/**
 * fetch() for admin API calls. The httpOnly session cookie goes along
 * automatically (same-origin). A 401 sends the admin back to the login screen;
 * the caller still gets the response so it can stop what it was doing.
 */
export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, { ...init, credentials: 'same-origin' });
  if (res.status === 401) {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
  return res;
}

type AuthStatus = 'checking' | 'authenticated' | 'anonymous';

export default function AdminAuth({ children }: AdminAuthProps) {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // The cookie is httpOnly, so ask the server whether the session is valid.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/auth', { credentials: 'same-origin', cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((body: { authenticated?: boolean }) => {
        if (!cancelled) setStatus(body.authenticated ? 'authenticated' : 'anonymous');
      })
      .catch(() => {
        if (!cancelled) setStatus('anonymous');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onExpired = () => {
      setStatus('anonymous');
      setError('Your session has expired. Log in again, then save your changes.');
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setStatus('authenticated');
      } else if (res.status === 401) {
        setError('Invalid password. Access denied.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch {
      setError('Authentication failed. Please try again.');
    }
    setPassword('');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE', credentials: 'same-origin' });
    } catch {
      // The cookie expires on its own; show the login screen either way.
    }
    setStatus('anonymous');
    setError('');
    setPassword('');
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Checking session...</div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Admin Access</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter the admin password to access the content management system
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Admin password"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Access Admin Panel
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 This area is protected and requires authentication
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Logout button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}