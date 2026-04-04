"use server"

import z from "zod"

import { prisma } from "@/lib/prisma"
import { DeletePatientSchema, UpdatePatientSchema } from "../schema"

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
