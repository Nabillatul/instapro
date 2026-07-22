import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const emailClean = (credentials.email as string).toLowerCase().trim();
          const passClean = (credentials.password as string).trim();

          const user = await prisma.user.findFirst({
            where: {
              email: { equals: emailClean, mode: "insensitive" },
            },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              role: true,
              phone: true,
              image: true,
            },
          });

          if (!user || !user.password) {
            console.log(`❌ User not found or no password set for: ${emailClean}`);
            return null;
          }

          const isValid = await bcrypt.compare(passClean, user.password);

          if (!isValid) {
            console.log(`❌ Invalid password for user: ${emailClean}`);
            return null;
          }

          console.log(`✅ Customer login successful for: ${emailClean}`);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth Authorize Error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "instapro-fallback-secret-2024",
});
