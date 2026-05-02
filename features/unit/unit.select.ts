import { Prisma } from "@/generated/prisma/client"

export const unitListSelect = {
  id: true,
  code: true,
  name: true,
} satisfies Prisma.UnitSelect
