import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Usuário não encontrado");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          throw new Error("Senha incorreta");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: {
              accounts: true,
            },
          });

          if (existingUser && existingUser.accounts.length === 0) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
            return true;
          }

          if (!existingUser) {
            return true;
          }

          if (existingUser.accounts.some(acc => acc.provider === "google")) {
            return true;
          }

          return false;
        } catch (error) {
          console.error("Erro ao processar login com Google:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        // Busca informações completas do usuário
        const user = await prisma.user.findUnique({
          where: { 
            id: token.sub!,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        });

        if (user) {
          session.user.id = user.id;
          session.user.name = user.name;
          session.user.email = user.email;
          session.user.image = user.image;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };