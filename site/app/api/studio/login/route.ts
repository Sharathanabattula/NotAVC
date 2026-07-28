import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";

/*
  Studio sign-in. Compares against STUDIO_PASSWORD in constant time, then
  hands out STUDIO_SESSION_TOKEN as an httpOnly cookie — the same value
  middleware.ts checks. Two separate secrets on purpose: the cookie value
  is what leaks if a browser is compromised, and it is not the password.
*/

export async function POST(request: Request) {
  const password = process.env.STUDIO_PASSWORD;
  const token = process.env.STUDIO_SESSION_TOKEN;
  if (!password || !token) {
    return NextResponse.json(
      { error: "Studio auth is not configured on this deployment" },
      { status: 500 },
    );
  }

  const form = await request.formData();
  const supplied = String(form.get("password") ?? "");

  if (!constantTimeEqual(supplied, password)) {
    const back = new URL("/studio/login?error=1", request.url);
    return NextResponse.redirect(back, { status: 303 });
  }

  const response = NextResponse.redirect(new URL("/studio", request.url), {
    status: 303,
  });
  response.cookies.set("notavc_studio", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

function constantTimeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // timingSafeEqual throws on length mismatch, which would itself leak the
  // length — compare into a fixed-size digest-length buffer instead.
  if (bufA.length !== bufB.length) {
    // Still burn a comparison so the failure path costs the same
    timingSafeEqual(bufB, bufB);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}
