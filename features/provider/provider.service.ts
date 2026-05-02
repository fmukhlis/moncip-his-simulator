"use server"

import { prisma } from "@/lib/prisma"
import { providerListSelect } from "./provider.select"
import z from "zod"
import { GetProvidersSchema } from "./provider.validation"
import { Prisma } from "@/generated/prisma/client"

type DatabaseClient = typeof prisma

export async function getProviders(
  db: Pick<DatabaseClient, "provider">,
  { search, status, serverPagination }: z.infer<typeof GetProvidersSchema>
) {
  const where: Prisma.ProviderWhereInput = {}

  if (status) {
    where.isActive = status === "ACTIVE"
  }

  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ]
  }

  return prisma.$transaction([
    db.provider.findMany({
      where,
      ...(serverPagination
        ? {
            skip: (serverPagination.page - 1) * serverPagination.pageSize,
            take: serverPagination.pageSize,
          }
        : {}),
      select: providerListSelect,
      orderBy: { name: "asc" },
    }),
    db.provider.count({ where }),
  ])
}
