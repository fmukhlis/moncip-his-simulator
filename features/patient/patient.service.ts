"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { patientDetailSelect, patientListSelect } from "./patient.select"
import {
  CreatePatientSchema,
  DeletePatientSchema,
  GetPatientDetailSchema,
  GetPatientsSchema,
  UpdatePatientSchema,
} from "./patient.validation"
import { Prisma } from "@/generated/prisma/client"

type DatabaseClient = typeof prisma

export async function getPatientDetail(
  db: Pick<DatabaseClient, "patient">,
  { userId, patientId }: z.infer<typeof GetPatientDetailSchema>
) {
  return db.patient.findFirst({
    where: { id: patientId, userId, deletedAt: null },
    select: patientDetailSelect,
  })
}

export async function getPatients(
  db: Pick<DatabaseClient, "patient">,
  { userId, fullName, mrnNumber, birthDate, nationalId, trashed, serverPagination }: z.infer<typeof GetPatientsSchema>
) {
  const where: Prisma.PatientWhereInput = {
    userId,
  }

  if (!trashed) {
    where.deletedAt = null
  }

  if (fullName) {
    where.fullName = { contains: fullName, mode: "insensitive" }
  }

  if (birthDate) {
    where.birthDate = { equals: new Date(birthDate) }
  }

  if (mrnNumber) {
    where.mrnNumber = { equals: mrnNumber }
  }

  if (nationalId) {
    where.nationalId = { equals: nationalId }
  }

  return prisma.$transaction([
    db.patient.findMany({
      where,
      ...(serverPagination
        ? {
            skip: (serverPagination.page - 1) * serverPagination.pageSize,
            take: serverPagination.pageSize,
          }
        : {}),
      select: patientListSelect,
      orderBy: { mrnNumber: "desc" },
    }),
    db.patient.count({ where }),
  ])
}

export async function createPatient(
  db: Pick<DatabaseClient, "patient">,
  { userId, ...rest }: z.infer<typeof CreatePatientSchema>
) {
  return db.patient.create({
    data: {
      ...rest,
      user: { connect: { id: userId } },
    },
    select: patientDetailSelect,
  })
}

export async function updatePatient(
  db: Pick<DatabaseClient, "patient">,
  { patientId, userId, ...rest }: z.infer<typeof UpdatePatientSchema>
) {
  return db.patient.update({
    where: {
      id: patientId,
      userId,
      deletedAt: null,
    },
    data: { ...rest },
    select: patientDetailSelect,
  })
}

export async function deletePatient(
  db: Pick<DatabaseClient, "patient">,
  { userId, patientId }: z.infer<typeof DeletePatientSchema>
) {
  return db.patient.update({
    where: {
      id: patientId,
      userId,
      deletedAt: null,
    },
    data: { deletedAt: new Date() },
    select: patientDetailSelect,
  })
}
