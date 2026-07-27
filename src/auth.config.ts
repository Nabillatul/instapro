import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        return true;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.phone = (user as any).phone;
        // Do NOT store image in JWT – large base64 causes HTTP 431
      }
      if (trigger === "update" && session) {
        if (session.name !== undefined) token.name = session.name;
        if (session.phone !== undefined) token.phone = session.phone;
        // Do NOT update image in token
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.id = (token.id as string) || "";
        session.user.phone = (token.phone as string) || "";
        // image intentionally NOT stored in session/cookie
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
