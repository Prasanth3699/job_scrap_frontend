import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
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
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (response.data) {
            return {
              id: response.data.id,
              email: response.data.email,
              name: response.data.name,
              accessToken: response.data.access_token,
            };
          }
          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { accessToken: string } }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
};
