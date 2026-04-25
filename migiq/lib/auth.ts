import { cookies } from "next/headers";

const COOKIE_NAME = "migiq_auth";

export async function isAuthed(): Promise<boolean> {
  const c = await cookies();
  const v = c.get(COOKIE_NAME)?.value;
  return v === expectedCookie();
}

export function expectedCookie(): string {
  const pw = process.env.APP_PASSWORD || "";
  if (!pw) return "";
  // Simple constant derived from the password — not a security boundary on its
  // own; the password itself is the gate. Keeps the cookie value off-the-wire
  // distinct from the raw password.
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (h * 31 + pw.charCodeAt(i)) | 0;
  return `v1.${Math.abs(h).toString(36)}.${pw.length}`;
}

export const AUTH_COOKIE = COOKIE_NAME;
