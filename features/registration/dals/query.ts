"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { FindDuplicatePatientSchema } from "../schema"

export async function findDuplicatePatient({
  userId,
  fullName,
  birthDate,
  nationalId,
}: z.infer<typeof FindDuplicatePatientSchema>) {
  const rawData = await prisma.patient.findFirst({
    where: {
      user: { id: userId },
      deletedAt: null,
      ...(fullName ? { fullName: { equals: fullName, mode: "insensitive" } } : {}),
      ...(birthDate ? { birthDate: { equals: new Date(birthDate) } } : {}),
      ...(nationalId ? { nationalId: { equals: nationalId } } : {}),
    },
    select: { id: true },
  })

  return rawData
}
