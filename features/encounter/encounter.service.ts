"use server"

import { prisma } from "@/lib/prisma"
import z from "zod"
import {
  CancelEncounterSchema,
  CompleteEncounterSchema,
  CreateEncounterSchema,
  GetEncounterDetailSchema,
  GetEncountersSchema,
  ReserveEncounterNumberSchema,
  UpdateEncounterSchema,
} from "./encounter.validation"
import { encounterDetailSelect, encounterListSelect } from "./encounter.select"
import { Prisma } from "@/generated/prisma/client"
import { buildEncounterNo, buildEncounterPeriod } from "@/lib/generate-item-no"

type DatabaseClient = typeof prisma

export async function getEncounterDetail(
  db: Pick<DatabaseClient, "encounter">,
  { userId, patientId, id, status }: z.infer<typeof GetEncounterDetailSchema>
) {
  const where: Prisma.EncounterWhereInput = {
    patientId,
    patient: {
      userId,
      deletedAt: null,
    },
    deletedAt: null,
  }

  if (id) {
    where.id = id
  }

  if (status) {
    where.status = { in: status }
  }

  return db.encounter.findFirst({
    where,
    select: encounterDetailSelect,
    orderBy: { createdAt: "desc" },
  })
}

export async function getEncounters(
  db: Pick<DatabaseClient, "encounter">,
  { type, unitId, userId, status, search, trashed, patientId, serverPagination }: z.infer<typeof GetEncountersSchema>
) {
  const where: Prisma.EncounterWhereInput = {
    type: { in: type },
    status: { in: status },
    patient: {
      id: patientId,
      userId: userId,
      deletedAt: null,
    },
  }

  if (!trashed) {
    where.deletedAt = null
  }

  if (unitId) {
    where.unitId = unitId
  }

  if (search) {
    where.OR = [
      { no: { contains: search, mode: "insensitive" } },
      { unit: { name: { contains: search, mode: "insensitive" } } },
      { provider: { name: { contains: search, mode: "insensitive" } } },
    ]
  }

  return prisma.$transaction([
    db.encounter.findMany({
      where,
      ...(serverPagination
        ? {
            skip: (serverPagination.page - 1) * serverPagination.pageSize,
            take: serverPagination.pageSize,
          }
        : {}),
      select: encounterListSelect,
      orderBy: [{ dateTime: "desc" }, { sequence: "desc" }],
    }),
    db.encounter.count({ where }),
  ])
}

export async function reserveEncounterNumber(
  db: Pick<DatabaseClient, "encounterCounter">,
  { date }: z.infer<typeof ReserveEncounterNumberSchema>
) {
  const period = buildEncounterPeriod(date)

  const counter = await db.encounterCounter.upsert({
    where: { period },
    create: { period, sequence: 1 },
    update: { sequence: { increment: 1 } },
    select: { sequence: true },
  })

  const no = buildEncounterNo(period, counter.sequence)

  return {
    no,
    period: period,
    sequence: counter.sequence,
  }
}

export async function createEncounter(
  db: Pick<DatabaseClient, "encounter">,
  {
    no,
    type,
    reason,
    period,
    unitId,
    sequence,
    patientId,
    providerId,
    coverageType,
  }: z.infer<typeof CreateEncounterSchema>
) {
  return db.encounter.create({
    data: {
      no,
      type,
      reason,
      unitId,
      period,
      sequence,
      patientId,
      providerId,
      coverageType,
    },
    select: encounterDetailSelect,
  })
}

export async function completeEncounter(
  db: Pick<DatabaseClient, "encounter">,
  { id, userId, patientId }: z.infer<typeof CompleteEncounterSchema>
) {
  return db.encounter.update({
    where: {
      id,
      patient: {
        id: patientId,
        user: { id: userId },
        deletedAt: null,
      },
      deletedAt: null,
    },
    data: { status: "COMPLETED" },
    select: encounterDetailSelect,
  })
}

export async function cancelEncounter(
  db: Pick<DatabaseClient, "encounter">,
  { id, userId, patientId }: z.infer<typeof CancelEncounterSchema>
) {
  return db.encounter.update({
    where: {
      id,
      patient: {
        id: patientId,
        user: { id: userId },
        deletedAt: null,
      },
      deletedAt: null,
    },
    data: { status: "CANCELLED" },
    select: encounterDetailSelect,
  })
}

export async function updateEncounter(
  db: Pick<DatabaseClient, "encounter">,
  { id, type, reason, unitId, userId, patientId, providerId, coverageType }: z.infer<typeof UpdateEncounterSchema>
) {
  return db.encounter.update({
    where: {
      id,
      patient: {
        id: patientId,
        user: { id: userId },
        deletedAt: null,
      },
      deletedAt: null,
    },
    data: {
      type,
      unitId,
      reason,
      providerId,
      coverageType,
    },
    select: encounterDetailSelect,
  })
}
