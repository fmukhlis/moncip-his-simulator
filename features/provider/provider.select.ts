import { Prisma } from "@/generated/prisma/client"

export const providerListSelect = {
  id: true,
  code: true,
  name: true,
} satisfies Prisma.ProviderSelect
