import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { dbConnect } from "@/lib/db";
import User from "@/app/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");

        if (!user.hashedPassword) {
          throw new Error("User has no password set");
        }

        const isValid = await compare(credentials.password, user.hashedPassword);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      const typedToken = token as JWT & { role?: string; id?: string };
      if (user) {
        const typedUser = user as { id: string; role?: string };
        typedToken.id = typedUser.id;
        typedToken.role = typedUser.role;
      }
      return typedToken;
    },
    async session({ session, token }) {
      const typedToken = token as JWT & { role?: string; id?: string };
      if (session.user) {
        session.user.id = typedToken.id ?? "";
        session.user.role = typedToken.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export default handler;
