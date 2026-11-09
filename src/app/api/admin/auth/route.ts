import { NextRequest, NextResponse } from 'next/server';
import {
  clearSessionCookie,
  isAdminConfigured,
  isAdminRequest,
  passwordMatches,
  setSessionCookie,
} from '@/lib/adminSession';

// GET - Report whether the caller has a valid admin session cookie
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { authenticated: isAdminRequest(request) },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

// POST - Log in: check the password and set the signed session cookie
export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!passwordMatches(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  setSessionCookie(response);
  return response;
}

// DELETE - Log out: clear the session cookie
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}
