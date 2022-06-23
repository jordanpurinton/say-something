import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { appSession } = req.cookies;
  const { nextUrl } = req;
  const isAuthPage = nextUrl.pathname.includes("auth");

  if (isAuthPage) {
    return NextResponse.next();
  }

  if (!appSession) {
    return NextResponse.rewrite(`${nextUrl.origin}/api/auth/login`);
  }

  return NextResponse.rewrite(req.url);
}
