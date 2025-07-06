import { getServerSession } from "next-auth"
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();
const authOptions  = {

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        const { password, ...safeUser } = user;
        return safeUser;
      }
    }),
        GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
         clientId: process.env.GOOGLE_ID,
         clientSecret: process.env.GOOGLE_SECRET,
       }),
  ],
  pages:{
    signIn:"/signin"
  }
}

const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }