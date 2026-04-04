"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { CreatePatientSchema } from "../schema"

export async function createPatient({
  userId,
  fullName,
  birthDate,
  nationalId,
  ...rest
}: z.infer<typeof CreatePatientSchema>) {
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

    if (duplicatePatient) {
      throw new Error("A patient with similar information already exists.")
    }

    const lastPatient = await tx.patient.findFirst({
      where: { userId },
      select: { mrnNumber: true },
      orderBy: { mrnNumber: "desc" },
    })

    return await tx.patient.create({
      data: {
        ...rest,
        fullName,
        birthDate,
        nationalId,
        mrnNumber: (lastPatient?.mrnNumber ?? 0) + 1,
        user: { connect: { id: userId } },
      },
      select: {
        id: true,
        fullName: true,
        mrnNumber: true,
      },
    })
  })
}
