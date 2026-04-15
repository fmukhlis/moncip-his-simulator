"use server"

import z from "zod"

import { prisma } from "@/lib/prisma"
import { GetOrderableServiceByIdSchema } from "../schemas/query"

type DatabaseClient = typeof prisma

export async function getOrderableServices(db: Pick<DatabaseClient, "orderableService">) {
  return db.orderableService.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      type: true,
      price: true,
      category: true,
      createdAt: true,
      deletedAt: true,
      description: true,
    },
  })
}

export async function getActiveOrderableServices(db: Pick<DatabaseClient, "orderableService">) {
  return db.orderableService.findMany({
    where: { deletedAt: null },
    orderBy: [{ category: "asc" }, { name: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      type: true,
      price: true,
      category: true,
      description: true,
    },
  })
}

export async function getOrderableServiceById(
  db: Pick<DatabaseClient, "orderableService">,
  { id }: z.infer<typeof GetOrderableServiceByIdSchema>
) {
  return db.orderableService.findFirst({
    where: { id, deletedAt: null },
  })
}
