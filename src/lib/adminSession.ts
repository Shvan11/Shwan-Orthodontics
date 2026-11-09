// Server-only admin session helpers. Import this from route handlers only:
// it reads server-only env vars and uses Node's crypto module.
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'admin_session';

const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours
const MIN_SECRET_LENGTH = 32;
// The cookie is only sent to the admin API, never to public pages.
const COOKIE_PATH = '/api/admin';

interface AdminConfig {
  secret: string;
  password: string;
}

function getAdminConfig(): AdminConfig | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || secret.length < MIN_SECRET_LENGTH || !password) return null;
  return { secret, password };
}

export function isAdminConfigured(): boolean {
  return getAdminConfig() !== null;
}

function sha256(value: string): Buffer {
  return createHash('sha256').update(value, 'utf8').digest();
}

// The password's hash is part of the signed message, so changing either
// ADMIN_SESSION_SECRET or ADMIN_PASSWORD invalidates every existing session.
function sign(expiresAt: number, config: AdminConfig): string {
  return createHmac('sha256', config.secret)
    .update(`v1.${expiresAt}.${sha256(config.password).toString('hex')}`)
    .digest('base64url');
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

export function passwordMatches(candidate: unknown): boolean {
  const config = getAdminConfig();
  if (!config || typeof candidate !== 'string') return false;
  // Compare fixed-length digests so the check takes the same time for any input.
  return safeEqual(sha256(candidate), sha256(config.password));
}

export function verifySessionToken(token: string | undefined): boolean {
  const config = getAdminConfig();
  if (!config || !token) return false;

  const [expiresAtRaw, signature, ...rest] = token.split('.');
  if (rest.length > 0 || !expiresAtRaw || !signature || !/^\d+$/.test(expiresAtRaw)) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return false;

  return safeEqual(Buffer.from(signature), Buffer.from(sign(expiresAt, config)));
}

export function isAdminRequest(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

/**
 * Call at the top of every admin route handler, before reading the body:
 *
 *   const denied = requireAdmin(request);
 *   if (denied) return denied;
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  if (isAdminRequest(request)) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

const cookieOptions = {
  httpOnly: true,
  // Browsers drop Secure cookies on plain-http dev hosts (e.g. a LAN IP), so
  // only relax this for `next dev`.
  secure: process.env.NODE_ENV !== 'development',
  sameSite: 'strict' as const,
  path: COOKIE_PATH,
};

export function setSessionCookie(response: NextResponse): void {
  const config = getAdminConfig();
  if (!config) throw new Error('Admin session is not configured');

  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  response.cookies.set(ADMIN_SESSION_COOKIE, `${expiresAt}.${sign(expiresAt, config)}`, {
    ...cookieOptions,
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_SESSION_COOKIE, '', { ...cookieOptions, maxAge: 0 });
}
