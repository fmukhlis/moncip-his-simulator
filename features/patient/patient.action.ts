"use server"

import z from "zod"
import {
  CreatePatientActionSchema,
  CreatePatientSchema,
  DeletePatientActionSchema,
  DeletePatientSchema,
  GetPatientDetailActionSchema,
  GetPatientDetailSchema,
  GetPatientsActionSchema,
  GetPatientsSchema,
  UpdatePatientActionSchema,
  UpdatePatientSchema,
} from "./patient.validation"
import { requireAuthUser } from "@/lib/require-auth-user"
import { createPatient, deletePatient, getPatientDetail, getPatients, updatePatient } from "./patient.service"
import { prisma } from "@/lib/prisma"
import { formatISO } from "date-fns"
import { getEncounters } from "../encounter/encounter.service"
import { GetEncountersSchema } from "../encounter/encounter.validation"
import { cache } from "react"

async function getPatientDetailAction(params: z.infer<typeof GetPatientDetailActionSchema>) {
  const user = await requireAuthUser()

  const parsedGetPatientDetailData = GetPatientDetailSchema.parse({ ...params, userId: user.id })

  const queryResponse = await getPatientDetail(prisma, parsedGetPatientDetailData)

  if (!queryResponse) {
    return { data: null }
  }

  return {
    data: { ...queryResponse, birthDate: formatISO(queryResponse.birthDate) },
  }
}

export const cachedGetPatientDetailAction = cache(getPatientDetailAction)

export async function getPatientsAction(params: z.input<typeof GetPatientsActionSchema>) {
  const user = await requireAuthUser()

  const parsedGetPatientsData = GetPatientsSchema.parse({
    ...params,
    userId: user.id,
  })

  const [data, total] = await getPatients(prisma, parsedGetPatientsData)

  const res = {
    items: data.map(({ birthDate, ...restPatient }) => ({
      ...restPatient,
      birthDate: formatISO(birthDate),
    })),
    totalCount: data.length,
    paginationMeta: null as {
      page: number
      total: number
      pageSize: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    } | null,
  }

  if (parsedGetPatientsData.serverPagination) {
    const { page, pageSize } = parsedGetPatientsData.serverPagination

    const totalPages = total === 0 ? 1 : Math.ceil(total / pageSize)

    res.paginationMeta = {
      page,
      total,
      pageSize,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  }
  return { data: res }
}

export async function createPatientAction(params: z.infer<typeof CreatePatientActionSchema>) {
  const user = await requireAuthUser()

  return prisma.$transaction(async (tx) => {
    const possibleDuplicatePatientsData = GetPatientsSchema.parse({
      userId: user.id,
      trashed: false,
      fullName: params.fullName,
      birthDate: params.birthDate,
      mrnNumber: "",
      nationalId: params.nationalId,
    })

    const possibleDuplicatePatients = await getPatients(tx, possibleDuplicatePatientsData)

    if (possibleDuplicatePatients.length) {
      throw new Error("A patient with similar information already exists.")
    }

    const lastPatientsData = GetPatientsSchema.parse({
      userId: user.id,
      trashed: true,
      fullName: "",
      birthDate: undefined,
      mrnNumber: "",
      nationalId: "",
    })

    const [lastPatients] = await getPatients(tx, lastPatientsData)

    const parsedCreatePatientData = CreatePatientSchema.parse({
      ...params,
      userId: user.id,
      mrnNumber: (lastPatients?.[0]?.mrnNumber ?? 0) + 1,
    })

    const queryResponse = await createPatient(tx, parsedCreatePatientData)

    return { data: { ...queryResponse, birthDate: formatISO(queryResponse.birthDate) } }
  })
}

export async function updatePatientAction(params: z.infer<typeof UpdatePatientActionSchema>) {
  const user = await requireAuthUser()

  return prisma.$transaction(async (tx) => {
    const possibleDuplicatePatientsData = GetPatientsSchema.parse({
      userId: user.id,
      trashed: false,
      fullName: params.fullName,
      birthDate: params.birthDate,
      mrnNumber: "",
      nationalId: params.nationalId,
    })

    const [possibleDuplicatePatients] = await getPatients(tx, possibleDuplicatePatientsData)

    if (possibleDuplicatePatients[0] && possibleDuplicatePatients[0].id !== params.patientId) {
      throw new Error("A patient with similar information already exists.")
    }

    const parsedUpdatePatientSchema = UpdatePatientSchema.parse({
      ...params,
      userId: user.id,
    })

    const queryResponse = await updatePatient(tx, parsedUpdatePatientSchema)

    return { data: { ...queryResponse, birthDate: formatISO(queryResponse.birthDate) } }
  })
}

export async function deletePatientAction(params: z.infer<typeof DeletePatientActionSchema>) {
  const user = await requireAuthUser()

  return prisma.$transaction(async (tx) => {
    const parsedGetEncountersData = GetEncountersSchema.parse({
      type: ["IPD", "OPD", "ER"],
      search: "",
      status: ["ACTIVE", "COMPLETED", "CANCELLED"],
      unitId: "",
      userId: user.id,
      patientId: params.patientId,
    })

    const [encounters] = await getEncounters(tx, parsedGetEncountersData)

    if (encounters.length > 0) {
      throw new Error("Patient cannot be deleted because they already have encounter history.")
    }

    const parsedDeletePatientData = DeletePatientSchema.parse({ ...params, userId: user.id })

    const queryResponse = await deletePatient(tx, parsedDeletePatientData)

    return { data: { ...queryResponse, birthDate: formatISO(queryResponse.birthDate) } }
  })
}
