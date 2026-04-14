"use server"

import z from "zod"

import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { formatISO } from "date-fns"
import { requireAuthUser } from "@/lib/require-auth-user"
import {
  getPatientDetail,
  getLastEncounter,
  getEncounterUnits,
  getActiveEncounter,
  getEncounterDetail,
  getPatientEncounters,
  getEncounterProviders,
  getPatientEncountersCount,
} from "../dals/query"
import {
  GetPatientDetailSchema,
  GetLastEncounterSchema,
  GetActiveEncounterSchema,
  GetEncounterDetailSchema,
  GetPatientEncountersSchema,
  GetLastEncounterActionSchema,
  GetPatientDetailActionSchema,
  GetEncounterDetailActionSchema,
  GetActiveEncounterActionSchema,
  GetPatientEncountersCountSchema,
  GetPatientEncountersActionSchema,
  GetPatientEncountersCountActionSchema,
} from "../schema"

export async function getPatientDetailAction(params: z.infer<typeof GetPatientDetailActionSchema>) {
  const user = await requireAuthUser()

  const { userId, patientId } = GetPatientDetailSchema.parse({ ...params, userId: user.id })

  const queryResponse = await getPatientDetail(prisma, { userId, patientId })

  return {
    data: queryResponse ? { ...queryResponse, birthDate: formatISO(queryResponse.birthDate) } : null,
  }
}

export async function getActiveEncounterAction(params: z.infer<typeof GetActiveEncounterActionSchema>) {
  const user = await requireAuthUser()

  const { userId, patientId } = GetActiveEncounterSchema.parse({ ...params, userId: user.id })

  const queryResponse = await getActiveEncounter(prisma, { userId, patientId })

  return {
    data: queryResponse ? { ...queryResponse, dateTime: formatISO(queryResponse.dateTime) } : null,
  }
}

export async function getLastEncounterAction(params: z.infer<typeof GetLastEncounterActionSchema>) {
  const user = await requireAuthUser()

  const { userId, patientId } = GetLastEncounterSchema.parse({ ...params, userId: user.id })

  const queryResponse = await getLastEncounter(prisma, { userId, patientId })

  return {
    data: queryResponse ? { ...queryResponse, dateTime: formatISO(queryResponse.dateTime) } : null,
  }
}

export async function getPatientEncountersCountAction(params: z.infer<typeof GetPatientEncountersCountActionSchema>) {
  const user = await requireAuthUser()

  const { userId, patientId } = GetPatientEncountersCountSchema.parse({ ...params, userId: user.id })

  const queryResponse = await getPatientEncountersCount(prisma, { userId, patientId })

  return { data: queryResponse ? queryResponse._count.encounters : 0 }
}

export async function getEncounterUnitsAction() {
  await requireAuthUser()

  const queryResponse = await getEncounterUnits(prisma)

  return { data: queryResponse }
}

export async function getEncounterProvidersAction() {
  await requireAuthUser()

  const queryResponse = await getEncounterProviders(prisma)

  return { data: queryResponse }
}

export async function getPatientEncountersAction(params: z.infer<typeof GetPatientEncountersActionSchema>) {
  const user = await requireAuthUser()

  const { q, page, status, type, unitId, pageSize, userId, patientId } = GetPatientEncountersSchema.parse({
    ...params,
    userId: user.id,
  })

  const queryResponse = await getPatientEncounters(prisma, {
    q,
    page,
    type,
    status,
    unitId,
    userId,
    pageSize,
    patientId,
  })

  const [items, totalCount] = queryResponse

  const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / pageSize)

  return {
    data: {
      page: page,
      items: items.map((item) => ({
        ...item,
        dateTime: formatISO(item.dateTime),
      })),
      pageSize: pageSize,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}

async function getEncounterDetailAction(params: z.infer<typeof GetEncounterDetailActionSchema>) {
  const user = await requireAuthUser()

  const { encounterId, patientId, userId } = GetEncounterDetailSchema.parse({ ...params, userId: user.id })

  const queryResponse = await getEncounterDetail(prisma, {
    userId,
    patientId,
    encounterId,
  })

  if (!queryResponse) {
    return { data: null }
  }

  const { dateTime, createdAt, deletedAt, updatedAt, ...rest } = queryResponse

  return {
    data: {
      ...rest,
      dateTime: formatISO(dateTime),
      createdAt: formatISO(createdAt),
      deletedAt: deletedAt ? formatISO(deletedAt) : null,
      updatedAt: formatISO(updatedAt),
    },
  }
}

export const cachedGetEncounterDetailAction = cache(getEncounterDetailAction)
