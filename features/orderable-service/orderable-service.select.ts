import { Prisma } from "@/generated/prisma/client"

export const orderableServiceDetailSelect = {
  id: true,
  code: true,
  name: true,
  type: true,
  price: true,
  category: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  description: true,
} satisfies Prisma.OrderableServiceSelect

export const orderableServiceListSelect = {
  id: true,
  code: true,
  name: true,
  type: true,
  price: true,
  category: true,
  deletedAt: true,
  description: true,
} satisfies Prisma.OrderableServiceSelect
