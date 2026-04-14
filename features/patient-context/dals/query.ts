"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma/client"
import {
  GetLastEncounterSchema,
  GetPatientDetailSchema,
  GetActiveEncounterSchema,
  GetEncounterDetailSchema,
  GetPatientEncountersSchema,
  GetPatientEncountersCountSchema,
} from "../schema"

type DatabaseClient = typeof prisma

export async function getPatientDetail(
  db: Pick<DatabaseClient, "patient">,
  { userId, patientId }: z.infer<typeof GetPatientDetailSchema>
) {
  return db.patient.findUnique({
    where: { id: patientId, userId, deletedAt: null },
    select: {
      id: true,
      sex: true,
      phone: true,
      email: true,
      address: true,
      fullName: true,
      mrnNumber: true,
      birthDate: true,
      nationalId: true,
    },
  })
}

export async function getActiveEncounter(
  db: Pick<DatabaseClient, "encounter">,
  { userId, patientId }: z.infer<typeof GetActiveEncounterSchema>
) {
  return db.encounter.findFirst({
    where: {
      patient: {
        id: patientId,
        userId,
        deletedAt: null,
      },
      status: "ACTIVE",
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      no: true,
      type: true,
      unit: {
        select: {
          name: true,
        },
      },
      status: true,
      reason: true,
      provider: {
        select: {
          name: true,
        },
      },
      dateTime: true,
    },
  })
}

export async function getLastEncounter(
  db: Pick<DatabaseClient, "encounter">,
  { userId, patientId }: z.infer<typeof GetLastEncounterSchema>
) {
  return db.encounter.findFirst({
    where: {
      patient: {
        id: patientId,
        userId,
        deletedAt: null,
      },
      status: { in: ["COMPLETED", "CANCELLED"] },
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      no: true,
      type: true,
      unit: {
        select: {
          name: true,
        },
      },
      status: true,
      reason: true,
      provider: {
        select: {
          name: true,
        },
      },
      dateTime: true,
    },
  })
}

export async function getPatientEncountersCount(
  db: Pick<DatabaseClient, "patient">,
  { userId, patientId }: z.infer<typeof GetPatientEncountersCountSchema>
) {
  return db.patient.findFirst({
    where: {
      id: patientId,
      userId,
      deletedAt: null,
    },
    select: {
      _count: {
        select: {
          encounters: true,
        },
      },
    },
  })
}

export async function getEncounterUnits(db: Pick<DatabaseClient, "unit">) {
  return db.unit.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })
}

export async function getEncounterProviders(db: Pick<DatabaseClient, "provider">) {
  return db.provider.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })
}

export async function getPatientEncounters(
  db: Pick<DatabaseClient, "encounter">,
  params: z.infer<typeof GetPatientEncountersSchema>
) {
  const where: Prisma.EncounterWhereInput = {
    patient: {
      id: params.patientId,
      userId: params.userId,
      deletedAt: null,
    },
    deletedAt: null,
  }

  if (params.status) {
    where.status = params.status
  }

  if (params.type) {
    where.type = params.type
  }

  if (params.unitId) {
    where.unitId = params.unitId
  }

  if (params.q) {
    where.OR = [
      { no: { contains: params.q, mode: "insensitive" } },
      { unit: { name: { contains: params.q, mode: "insensitive" } } },
      { provider: { name: { contains: params.q, mode: "insensitive" } } },
    ]
  }

  return Promise.all([
    db.encounter.findMany({
      where,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      select: {
        id: true,
        no: true,
        type: true,
        unit: { select: { id: true, name: true } },
        status: true,
        patient: { select: { id: true } },
        provider: { select: { id: true, name: true } },
        dateTime: true,
      },
      orderBy: [{ dateTime: "desc" }, { sequence: "desc" }],
    }),
    db.encounter.count({ where }),
  ])
}

export async function getEncounterDetail(
  db: Pick<DatabaseClient, "encounter">,
  params: z.infer<typeof GetEncounterDetailSchema>
) {
  return db.encounter.findUnique({
    where: {
      id: params.encounterId,
      patient: {
        id: params.patientId,
        user: { id: params.userId },
        deletedAt: null,
      },
      deletedAt: null,
    },
    select: {
      id: true,
      no: true,
      type: true,
      unit: { select: { id: true, name: true, code: true } },
      status: true,
      reason: true,
      dateTime: true,
      provider: { select: { id: true, name: true, code: true } },
      sequence: true,
      createdAt: true,
      deletedAt: true,
      updatedAt: true,
      coverageType: true,
    },
  })
}
