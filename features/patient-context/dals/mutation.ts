"use server"

import z from "zod"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma/client"
import { searchPatients } from "@/features/search-patients/dals/query"
import { getPatientEncountersCount } from "./query"
import { buildEncounterNo, buildEncounterPeriod } from "@/lib/generate-item-no"
import {
  UpdatePatientSchema,
  DeletePatientSchema,
  CancelEncounterSchema,
  CreateEncounterSchema,
  UpdateEncounterSchema,
  CompleteEncounterSchema,
} from "../schema"

export async function updatePatient({
  userId,
  fullName,
  patientId,
  birthDate,
  nationalId,
  ...rest
}: z.infer<typeof UpdatePatientSchema>) {
  return await prisma.$transaction(async (tx) => {
    const patients = await searchPatients(prisma, {
      count: 1,
      userId,
      fullName,
      birthDate,
      mrnNumber: undefined,
      nationalId,
    })

    if (patients[0] && patients[0].id !== patientId) {
      throw new Error("A patient with similar information already exists.")
    }

    return await tx.patient.update({
      where: {
        id: patientId,
        userId,
        deletedAt: null,
      },
      data: {
        ...rest,
        fullName,
        birthDate,
        nationalId,
      },
      select: {
        id: true,
      },
    })
  })
}

export async function deletePatient({ userId, patientId }: z.infer<typeof DeletePatientSchema>) {
  return await prisma.$transaction(async (tx) => {
    const patient = await getPatientEncountersCount(tx, { userId, patientId })

    if (!patient) {
      throw new Error("Patient not found.")
    }

    if (patient._count.encounters > 0) {
      throw new Error("Patient cannot be deleted because they already have encounter history.")
    }

    return await tx.patient.update({
      where: {
        id: patientId,
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
      },
    })
  })
}

export async function createEncounter({
  type,
  reason,
  userId,
  unitId,
  patientId,
  providerId,
  coverageType,
}: z.infer<typeof CreateEncounterSchema>) {
  const now = new Date()
  const period = buildEncounterPeriod(now)

  return prisma.$transaction(async (tx) => {
    const patient = await tx.patient.findFirst({
      where: {
        id: patientId,
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    })

    if (!patient) {
      throw new Error("Patient not found or access denied.")
    }

    const activeEncounter = await tx.encounter.findFirst({
      where: {
        status: "ACTIVE",
        deletedAt: null,
        patientId,
      },
      orderBy: {
        dateTime: "desc",
      },
      select: {
        id: true,
      },
    })

    if (activeEncounter) {
      throw new Error("Patient already has an active encounter.")
    }

    const [unit, provider] = await Promise.all([
      tx.unit.findFirst({
        where: {
          id: unitId,
          isActive: true,
        },
        select: {
          id: true,
        },
      }),
      tx.provider.findFirst({
        where: {
          id: providerId,
          isActive: true,
        },
        select: {
          id: true,
        },
      }),
    ])

    if (!unit) {
      throw new Error("Unit not found.")
    }

    if (!provider) {
      throw new Error("Provider not found.")
    }

    const encounterCounter = await tx.encounterCounter.upsert({
      where: {
        period,
      },
      create: {
        period,
        sequence: 1,
      },
      update: {
        sequence: {
          increment: 1,
        },
      },
      select: {
        sequence: true,
      },
    })

    const no = buildEncounterNo(period, encounterCounter.sequence)

    try {
      const encounter = await tx.encounter.create({
        data: {
          no,
          type,
          reason: reason,
          unitId: unitId,
          period,
          sequence: encounterCounter.sequence,
          patientId: patientId,
          providerId: providerId,
          coverageType,
        },
        select: {
          id: true,
          patientId: true,
        },
      })

      return encounter
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new Error("Encounter number conflict.")
      }

      throw error
    }
  })
}

export async function completeEncounter({ userId, patientId, encounterId }: z.infer<typeof CompleteEncounterSchema>) {
  return await prisma.encounter.update({
    where: {
      id: encounterId,
      patient: {
        id: patientId,
        user: { id: userId },
        deletedAt: null,
      },
      deletedAt: null,
    },
    data: {
      status: "COMPLETED",
    },
    select: {
      id: true,
      patient: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
  })
}

export async function cancelEncounter({ userId, patientId, encounterId }: z.infer<typeof CancelEncounterSchema>) {
  return await prisma.encounter.update({
    where: {
      id: encounterId,
      patient: {
        id: patientId,
        user: { id: userId },
        deletedAt: null,
      },
      deletedAt: null,
    },
    data: {
      status: "CANCELLED",
    },
    select: {
      id: true,
      patient: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
  })
}

export async function updateEncounter({
  type,
  reason,
  unitId,
  userId,
  patientId,
  providerId,
  encounterId,
  coverageType,
}: z.infer<typeof UpdateEncounterSchema>) {
  return prisma.$transaction(async (tx) => {
    const [unit, provider] = await Promise.all([
      tx.unit.findFirst({
        where: {
          id: unitId,
          isActive: true,
        },
        select: {
          id: true,
        },
      }),
      tx.provider.findFirst({
        where: {
          id: providerId,
          isActive: true,
        },
        select: {
          id: true,
        },
      }),
    ])

    if (!unit) {
      throw new Error("Unit not found.")
    }

    if (!provider) {
      throw new Error("Provider not found.")
    }

    return tx.encounter.update({
      where: {
        id: encounterId,
        patient: {
          id: patientId,
          user: { id: userId },
          deletedAt: null,
        },
        deletedAt: null,
      },
      data: {
        unitId,
        providerId,
        reason,
        coverageType,
        type,
      },
      select: {
        id: true,
        patient: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    })
  })
}
