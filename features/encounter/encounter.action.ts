"use server"

import z from "zod"
import {
  CancelEncounterSchema,
  CompleteEncounterActionSchema,
  CompleteEncounterSchema,
  CreateEncounterActionSchema,
  CreateEncounterSchema,
  GetEncounterDetailActionSchema,
  GetEncounterDetailSchema,
  GetEncountersActionSchema,
  GetEncountersSchema,
  UpdateEncounterActionSchema,
  UpdateEncounterSchema,
} from "./encounter.validation"
import { requireAuthUser } from "@/lib/require-auth-user"
import {
  cancelEncounter,
  completeEncounter,
  createEncounter,
  getEncounterDetail,
  getEncounters,
  reserveEncounterNumber,
  updateEncounter,
} from "./encounter.service"
import { prisma } from "@/lib/prisma"
import { formatISO } from "date-fns"
import { buildEncounterPeriod } from "@/lib/generate-item-no"
import { getPatientDetail } from "../patient/patient.service"
import { GetPatientDetailSchema } from "../patient/patient.validation"
import { GetUnitsSchema } from "../unit/unit.validation"
import { GetProvidersSchema } from "../provider/provider.validation"
import { getUnits } from "../unit/unit.service"
import { getProviders } from "../provider/provider.service"
import { Prisma } from "@/generated/prisma/client"
import { cache } from "react"

export async function getEncounterDetailAction(params: z.infer<typeof GetEncounterDetailActionSchema>) {
  const user = await requireAuthUser()

  const { id, patientId, userId, status } = GetEncounterDetailSchema.parse({ ...params, userId: user.id })

  const queryResponse = await getEncounterDetail(prisma, {
    id,
    status,
    userId,
    patientId,
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

export async function getEncountersAction(params: z.infer<typeof GetEncountersActionSchema>) {
  const user = await requireAuthUser()

  const parsedGetEncountersData = GetEncountersSchema.parse({
    ...params,
    userId: user.id,
  })

  const [queryResponse, total] = await getEncounters(prisma, parsedGetEncountersData)

  const data = {
    items: queryResponse.map(({ dateTime, ...rest }) => ({
      ...rest,
      dateTime: formatISO(dateTime),
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

  if (parsedGetEncountersData.serverPagination) {
    const { page, pageSize } = parsedGetEncountersData.serverPagination

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

export async function createEncounterAction(params: z.infer<typeof CreateEncounterActionSchema>) {
  const user = await requireAuthUser()

  const parsedGetPatientDetailData = GetPatientDetailSchema.parse({
    userId: user.id,
    patientId: params.patientId,
  })

  const parsedGetActiveUnitsData = GetUnitsSchema.parse({
    search: "",
    status: "ACTIVE",
  })

  const parsedGetActiveProvidersData = GetProvidersSchema.parse({
    search: "",
    status: "ACTIVE",
  })

  const parsedGetActiveEncountersData = GetEncountersSchema.parse({
    type: ["IPD", "OPD", "ER"],
    search: "",
    unitId: "",
    userId: user.id,
    status: ["ACTIVE"],
    trashed: false,
    patientId: params.patientId,
  })

  return await prisma.$transaction(async (tx) => {
    const { no, period, sequence } = await reserveEncounterNumber(tx, { date: new Date() })

    const [units, providers, patient] = await Promise.all([
      getUnits(tx, parsedGetActiveUnitsData),
      getProviders(tx, parsedGetActiveProvidersData),
      getPatientDetail(tx, parsedGetPatientDetailData),
    ])

    if (!patient) {
      throw new Error("Patient not found or access denied.")
    }

    if (!units.at(0)) {
      throw new Error("Unit not found.")
    }

    if (!providers.at(0)) {
      throw new Error("Provider not found.")
    }

    const [activeEncounter] = await getEncounters(tx, parsedGetActiveEncountersData)

    if (activeEncounter.length > 0) {
      throw new Error("Patient already has an active encounter.")
    }

    const parsedCreateEncounterData = CreateEncounterSchema.parse({
      ...params,
      no,
      period,
      sequence,
    })

    try {
      const queryResponse = await createEncounter(tx, parsedCreateEncounterData)

      return {
        data: {
          ...queryResponse,
          dateTime: formatISO(queryResponse.dateTime),
          createdAt: formatISO(queryResponse.createdAt),
          updatedAt: formatISO(queryResponse.updatedAt),
          deletedAt: queryResponse.deletedAt ? formatISO(queryResponse.deletedAt) : null,
        },
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new Error("Encounter number conflict.")
      }
      throw error
    }
  })
}

export async function completeEncounterAction(params: z.infer<typeof CompleteEncounterActionSchema>) {
  const user = await requireAuthUser()

  const parsedGetEncounterDetailData = GetEncounterDetailSchema.parse({
    id: params.id,
    userId: user.id,
    patientId: params.patientId,
  })

  const parsedCompleteEncounterData = CompleteEncounterSchema.parse({ ...params, userId: user.id })

  return await prisma.$transaction(async (tx) => {
    const encounter = await getEncounterDetail(tx, parsedGetEncounterDetailData)

    if (encounter?.status !== "ACTIVE") {
      throw new Error("Encounter is no longer active.")
    }

    const queryResponse = await completeEncounter(tx, parsedCompleteEncounterData)

    return {
      data: {
        ...queryResponse,
        dateTime: formatISO(queryResponse.dateTime),
        createdAt: formatISO(queryResponse.createdAt),
        updatedAt: formatISO(queryResponse.updatedAt),
        deletedAt: queryResponse.deletedAt ? formatISO(queryResponse.deletedAt) : null,
      },
    }
  })
}

export async function cancelEncounterAction(params: z.infer<typeof CompleteEncounterActionSchema>) {
  const user = await requireAuthUser()

  const parsedGetEncounterDetailData = GetEncounterDetailSchema.parse({
    id: params.id,
    userId: user.id,
    patientId: params.patientId,
  })

  const parsedCancelEncounterData = CancelEncounterSchema.parse({ ...params, userId: user.id })

  return await prisma.$transaction(async (tx) => {
    const encounter = await getEncounterDetail(tx, parsedGetEncounterDetailData)

    if (encounter?.status !== "ACTIVE") {
      throw new Error("Encounter is no longer active.")
    }

    const queryResponse = await cancelEncounter(tx, parsedCancelEncounterData)

    return {
      data: {
        ...queryResponse,
        dateTime: formatISO(queryResponse.dateTime),
        createdAt: formatISO(queryResponse.createdAt),
        updatedAt: formatISO(queryResponse.updatedAt),
        deletedAt: queryResponse.deletedAt ? formatISO(queryResponse.deletedAt) : null,
      },
    }
  })
}

export async function updateEncounterAction(params: z.infer<typeof UpdateEncounterActionSchema>) {
  const user = await requireAuthUser()

  const parsedGetPatientDetailData = GetPatientDetailSchema.parse({
    userId: user.id,
    patientId: params.patientId,
  })

  const parsedGetActiveUnitsData = GetUnitsSchema.parse({
    search: "",
    status: "ACTIVE",
  })

  const parsedGetActiveProvidersData = GetProvidersSchema.parse({
    search: "",
    status: "ACTIVE",
  })

  return await prisma.$transaction(async (tx) => {
    const [units, providers, patient] = await Promise.all([
      getUnits(tx, parsedGetActiveUnitsData),
      getProviders(tx, parsedGetActiveProvidersData),
      getPatientDetail(tx, parsedGetPatientDetailData),
    ])

    if (!patient) {
      throw new Error("Patient not found or access denied.")
    }

    if (!units.at(0)) {
      throw new Error("Unit not found.")
    }

    if (!providers.at(0)) {
      throw new Error("Provider not found.")
    }

    const parsedUpdateEncounterData = UpdateEncounterSchema.parse({
      ...params,
      userId: user.id,
    })

    const queryResponse = await updateEncounter(tx, parsedUpdateEncounterData)

    return {
      data: {
        ...queryResponse,
        dateTime: formatISO(queryResponse.dateTime),
        createdAt: formatISO(queryResponse.createdAt),
        updatedAt: formatISO(queryResponse.updatedAt),
        deletedAt: queryResponse.deletedAt ? formatISO(queryResponse.deletedAt) : null,
      },
    }
  })
}
