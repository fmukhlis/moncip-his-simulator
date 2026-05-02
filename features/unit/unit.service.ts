"use server"

import { prisma } from "@/lib/prisma"
import { unitListSelect } from "./unit.select"
import z from "zod"
import { GetUnitsSchema } from "./unit.validation"
import { Prisma } from "@/generated/prisma/client"

type DatabaseClient = typeof prisma

export async function getUnits(
  db: Pick<DatabaseClient, "unit">,
  { search, status, serverPagination }: z.infer<typeof GetUnitsSchema>
) {
  const where: Prisma.UnitWhereInput = {}

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
    db.unit.findMany({
      where,
      ...(serverPagination
        ? {
            skip: (serverPagination.page - 1) * serverPagination.pageSize,
            take: serverPagination.pageSize,
          }
        : {}),
      select: unitListSelect,
      orderBy: { name: "asc" },
    }),
    db.unit.count({ where }),
  ])
}
