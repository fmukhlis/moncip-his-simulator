"use server"

import z from "zod"

import { prisma } from "@/lib/prisma"
import { requireAuthUser } from "@/lib/require-auth-user"
import { GetOrderableServiceByIdActionSchema } from "../schemas/query"
import { getActiveOrderableServices, getOrderableServiceById, getOrderableServices } from "../dals/query"
import { formatISO } from "date-fns"

export async function getOrderableServicesAction() {
  await requireAuthUser()

  const queryResponse = await getOrderableServices(prisma)

  return {
    data: queryResponse.map((item) => ({
      ...item,
      price: item?.price?.toString(),
      createdAt: formatISO(item.createdAt),
      deletedAt: item.deletedAt ? formatISO(item.deletedAt) : null,
    })),
  }
}

export async function getActiveOrderableServicesAction() {
  await requireAuthUser()

  const queryResponse = await getActiveOrderableServices(prisma)

  return {
    data: queryResponse.map((item) => ({
      ...item,
      price: item?.price?.toString(),
    })),
  }
}

export async function getOrderableServiceByIdAction(params: z.infer<typeof GetOrderableServiceByIdActionSchema>) {
  await requireAuthUser()

  const parsedData = GetOrderableServiceByIdActionSchema.parse(params)

  const queryResponse = await getOrderableServiceById(prisma, parsedData)

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
