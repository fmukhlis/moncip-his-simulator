"use server"

import { requireAuthUser } from "@/lib/require-auth-user"
import { getProviders } from "./provider.service"
import { prisma } from "@/lib/prisma"
import { GetProvidersActionSchema, GetProvidersSchema } from "./provider.validation"
import z from "zod"

export async function getProvidersAction(params: z.infer<typeof GetProvidersActionSchema>) {
  await requireAuthUser()

  const parsedGetProvidersData = GetProvidersSchema.parse(params)

  const [queryResponse, total] = await getProviders(prisma, parsedGetProvidersData)

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

  if (parsedGetProvidersData.serverPagination) {
    const { page, pageSize } = parsedGetProvidersData.serverPagination

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
