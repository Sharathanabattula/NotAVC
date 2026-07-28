import { NextResponse, type NextRequest } from "next/server";

/*
  /studio is Sharath's control room — it can schedule and approve posts to
  live accounts, so it is gated. The cookie is set only by
  /api/studio/login, which checks STUDIO_PASSWORD.
*/

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/studio/login") return NextResponse.next();

  const session = request.cookies.get("notavc_studio")?.value;
  if (session && session === process.env.STUDIO_SESSION_TOKEN) {
    return NextResponse.next();
  }

  const login = request.nextUrl.clone();
  login.pathname = "/studio/login";
  login.search = "";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/studio", "/studio/:path*"],
};
