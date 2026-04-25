import { NextRequest, NextResponse } from "next/server";

const PUBLIC = ["/login", "/api/login", "/manifest.json", "/icon.svg", "/robots.txt"];

function expectedCookie(pw: string): string {
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (h * 31 + pw.charCodeAt(i)) | 0;
  return `v1.${Math.abs(h).toString(36)}.${pw.length}`;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }
  const pw = process.env.APP_PASSWORD || "";
  const cookie = req.cookies.get("migiq_auth")?.value;
  if (!pw || cookie !== expectedCookie(pw)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
