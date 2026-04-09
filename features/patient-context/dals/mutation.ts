"use server"

import z from "zod"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma/client"
import { buildEncounterNo, buildEncounterPeriod } from "@/lib/generate-item-no"
import { CreateEncounterSchema, DeletePatientSchema, UpdatePatientSchema } from "../schema"

export async function updatePatient({
  userId,
  fullName,
  patientId,
  birthDate,
  nationalId,
  ...rest
}: z.infer<typeof UpdatePatientSchema>) {
  return await prisma.$transaction(async (tx) => {
    const duplicatePatient = await tx.patient.findFirst({
      where: {
        user: { id: userId },
        deletedAt: null,
        ...(fullName ? { fullName: { equals: fullName, mode: "insensitive" } } : {}),
        ...(birthDate ? { birthDate: { equals: new Date(birthDate) } } : {}),
        ...(nationalId ? { nationalId: { equals: nationalId } } : {}),
      },
      select: { id: true },
    })

    if (duplicatePatient && duplicatePatient.id !== patientId) {
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
        fullName: true,
        mrnNumber: true,
      },
    })
  })
}

export async function deletePatient({ userId, patientId }: z.infer<typeof DeletePatientSchema>) {
  return await prisma.$transaction(async (tx) => {
    const patient = await tx.patient.findFirst({
      where: {
        id: patientId,
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        mrnNumber: true,
        _count: {
          select: {
            encounters: true,
          },
        },
      },
    })

    if (!patient) {
      throw new Error("Patient not found.")
    }

    if (patient._count.encounters > 0) {
      throw new Error("Patient cannot be deleted because they already have encounter history.")
    }

    return await tx.patient.update({
      where: {
        id: patient.id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        fullName: true,
        mrnNumber: true,
      },
    })
  })
}

export async function createEncounter({
  reason,
  userId,
  unitId,
  patientId,
  providerId,
  coverageType,
  encounterType,
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
        encounterDateTime: "desc",
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

    const encounterNo = buildEncounterNo(period, encounterCounter.sequence)

    try {
      const encounter = await tx.encounter.create({
        data: {
          reason: reason,
          unitId: unitId,
          period,
          sequence: encounterCounter.sequence,
          patientId: patientId,
          providerId: providerId,
          encounterNo,
          coverageType,
          encounterType,
        },
        select: {
          id: true,
          period: true,
          status: true,
          sequence: true,
          patientId: true,
          encounterNo: true,
          encounterDateTime: true,
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
