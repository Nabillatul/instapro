import { NextResponse } from "next/server";

// This route clears all auth cookies to fix HTTP 431 caused by oversized JWT cookie
export async function GET() {
  const response = NextResponse.redirect(
    new URL("/login", process.env.NEXTAUTH_URL || "http://127.0.0.1:3005")
  );

  const baseCookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "__Secure-next-auth.pkce.code_verifier",
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "authjs.csrf-token",
    "authjs.callback-url",
  ];

  const cookieNames: string[] = [...baseCookieNames];

  for (let i = 0; i < 15; i++) {
    cookieNames.push(`next-auth.session-token.${i}`);
    cookieNames.push(`__Secure-next-auth.session-token.${i}`);
    cookieNames.push(`authjs.session-token.${i}`);
    cookieNames.push(`__Secure-authjs.session-token.${i}`);
  }

  for (const name of cookieNames) {
    response.cookies.set(name, "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return response;
}
