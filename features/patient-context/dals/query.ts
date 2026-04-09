"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { formatISO } from "date-fns"
import { ActiveEncounterExistsError } from "@/lib/custom-errors/active-encounter-exists-error"
import { GetCreateEncounterPageDataSchema, GetPatientOverviewSchema } from "../schema"

export async function getPatientOverview({ patientId, userId }: z.infer<typeof GetPatientOverviewSchema>) {
  const [patient, activeEncounter, lastEncounter] = await Promise.all([
    prisma.patient.findUnique({
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
    }),
    prisma.encounter.findFirst({
      where: {
        patientId,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
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
        encounterNo: true,
        encounterType: true,
        encounterDateTime: true,
      },
    }),
    prisma.encounter.findFirst({
      where: {
        patientId,
        status: { in: ["COMPLETED", "CANCELLED"] },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
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
        encounterNo: true,
        encounterType: true,
        encounterDateTime: true,
      },
    }),

    // prisma.labOrder.count({
    //   where: { patientId },
    // }),

    // prisma.labOrder.count({
    //   where: {
    //     patientId,
    //     status: "PENDING",
    //   },
    // }),

    // prisma.labOrder.findFirst({
    //   where: { patientId },
    //   orderBy: { createdAt: "desc" },
    //   select: {
    //     id: true,
    //     status: true,
    //     createdAt: true,
    //     completedAt: true,
    //   },
    // }),
  ])

  if (!patient) return null

  return {
    patient: { ...patient, birthDate: formatISO(patient.birthDate) },
    lastEncounter: lastEncounter
      ? { ...lastEncounter, encounterDateTime: formatISO(lastEncounter.encounterDateTime) }
      : null,
    activeEncounter: activeEncounter
      ? { ...activeEncounter, encounterDateTime: formatISO(activeEncounter.encounterDateTime) }
      : null,
    // labSummary: {
    //   totalOrders,
    //   pendingOrders,
    //   lastOrderDate: lastLabOrder?.createdAt ?? null,
    //   lastResultDate: lastLabOrder?.completedAt ?? null,
    // },
  }
}

export async function getCreateEncounterPageData({
  userId,
  patientId,
}: z.infer<typeof GetCreateEncounterPageDataSchema>) {
  const patient = await prisma.patient.findFirst({
    where: {
      id: patientId,
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
      sex: true,
      fullName: true,
      mrnNumber: true,
      birthDate: true,
    },
  })

  if (!patient) {
    throw new Error("Patient not found or access denied.")
  }

  const [activeEncounter, units, providers] = await Promise.all([
    prisma.encounter.findFirst({
      where: {
        status: "ACTIVE",
        patientId,
        deletedAt: null,
      },
      orderBy: {
        encounterDateTime: "desc",
      },
      select: {
        id: true,
      },
    }),
    prisma.unit.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.provider.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ])

  if (activeEncounter) {
    throw new ActiveEncounterExistsError(activeEncounter.id)
  }

  return {
    units,
    patient: {
      ...patient,
      birthDate: formatISO(patient.birthDate),
    },
    providers,
  }
}
