"use server"

import { requireAuthUser } from "@/lib/require-auth-user"
import { getUnits } from "./unit.service"
import { prisma } from "@/lib/prisma"
import { GetUnitsActionSchema, GetUnitsSchema } from "./unit.validation"
import z from "zod"

export async function getUnitsAction(params: z.infer<typeof GetUnitsActionSchema>) {
  await requireAuthUser()

  const parsedGetUnitsData = GetUnitsSchema.parse(params)

  const [queryResponse, total] = await getUnits(prisma, parsedGetUnitsData)

  const data = {
    items: queryResponse,
    totalCount: queryResponse.length,
    paginationMeta: null as {
      page: number
      total: number
      pageSize: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    } | null,
  }

  if (parsedGetUnitsData.serverPagination) {
    const { page, pageSize } = parsedGetUnitsData.serverPagination

    const totalPages = queryResponse.length === 0 ? 1 : Math.ceil(queryResponse.length / pageSize)

    data.paginationMeta = {
      page,
      total,
      pageSize,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  }

  return { data }
}
