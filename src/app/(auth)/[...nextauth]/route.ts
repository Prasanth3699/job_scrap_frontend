import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
          throw new Error("Missing email or password");
        }
        return {
          id: "1",
          name: "User",
          email: credentials.email,
          accessToken: "dummy-token",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

// Ensure proper API route exports
const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;
