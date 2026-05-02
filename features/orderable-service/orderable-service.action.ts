"use server"

import z from "zod"
import { prisma } from "@/lib/prisma"
import { requireAuthUser } from "@/lib/require-auth-user"
import { formatISO } from "date-fns"
import {
  GetOrderableServiceDetailActionSchema,
  GetOrderableServiceDetailSchema,
  GetOrderableServicesActionSchema,
  GetOrderableServicesSchema,
} from "./orderable-service.validation"
import { getOrderableServiceDetail, getOrderableServices } from "./orderable-service.service"

export async function getOrderableServicesAction(params: z.infer<typeof GetOrderableServicesActionSchema>) {
  await requireAuthUser()

  const parsedGetOrderableServicesData = GetOrderableServicesSchema.parse(params)

  const [queryResponse, total] = await getOrderableServices(prisma, parsedGetOrderableServicesData)

  const data = {
    items: queryResponse.map((item) => ({
      ...item,
      price: item?.price?.toString(),
      deletedAt: item.deletedAt ? formatISO(item.deletedAt) : null,
    })),
    totalCount: queryResponse.length,
    paginationMeta: null as {
      page: number
      total: number
      pageSize: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    } | null,
  }

  if (parsedGetOrderableServicesData.serverPagination) {
    const { page, pageSize } = parsedGetOrderableServicesData.serverPagination

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

export async function getOrderableServiceDetailAction(params: z.infer<typeof GetOrderableServiceDetailActionSchema>) {
  await requireAuthUser()

  const { id, trashed } = GetOrderableServiceDetailSchema.parse(params)

  const queryResponse = await getOrderableServiceDetail(prisma, { id, trashed })

  return {
    data: queryResponse
      ? {
          ...queryResponse,
          price: queryResponse.price?.toString(),
          createdAt: formatISO(queryResponse.createdAt),
          deletedAt: queryResponse.deletedAt ? formatISO(queryResponse.deletedAt) : null,
        }
      : null,
  }
}
