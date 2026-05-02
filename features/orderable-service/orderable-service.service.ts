"use server"

import z from "zod"
import { prisma } from "@/lib/prisma"
import { orderableServiceDetailSelect, orderableServiceListSelect } from "./orderable-service.select"
import { GetOrderableServiceDetailActionSchema, GetOrderableServicesSchema } from "./orderable-service.validation"
import { Prisma } from "@/generated/prisma/client"

type DatabaseClient = typeof prisma

export async function getOrderableServices(
  db: Pick<DatabaseClient, "orderableService">,
  { type, search, trashed, categories, serverPagination }: z.infer<typeof GetOrderableServicesSchema>
) {
  const where: Prisma.OrderableServiceWhereInput = {
    type: { in: type },
  }

  if (!trashed) {
    where.deletedAt = null
  }

  if (categories) {
    where.category = { in: categories, mode: "insensitive" }
  }

  if (search) {
    where.OR = [
      { id: search },
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
    ]
  }

  return prisma.$transaction([
    db.orderableService.findMany({
      where,
      ...(serverPagination
        ? {
            skip: (serverPagination.page - 1) * serverPagination.pageSize,
            take: serverPagination.pageSize,
          }
        : {}),
      orderBy: [{ category: "asc" }, { name: "asc" }],
      select: orderableServiceListSelect,
    }),
    db.orderableService.count({ where }),
  ])
}

export async function getOrderableServiceDetail(
  db: Pick<DatabaseClient, "orderableService">,
  { id, trashed }: z.infer<typeof GetOrderableServiceDetailActionSchema>
) {
  const where: Prisma.OrderableServiceWhereInput = { id }

  if (!trashed) {
    where.deletedAt = null
  }

  return db.orderableService.findFirst({
    where,
    select: orderableServiceDetailSelect,
  })
}
