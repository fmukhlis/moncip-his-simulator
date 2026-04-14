import NextAuth from "next-auth"
import authConfig from "./auth.config"

import { prisma } from "./lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"

const adapter = PrismaAdapter(prisma)

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  ...authConfig,
})
