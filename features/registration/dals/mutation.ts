"use server"

import z from "zod"

import { prisma } from "@/lib/prisma"
import { searchPatients } from "@/features/search-patients/dals/query"
import { CreatePatientSchema } from "../schema"

export async function createPatient({
  userId,
  fullName,
  birthDate,
  nationalId,
  ...rest
}: z.infer<typeof CreatePatientSchema>) {
  return await prisma.$transaction(async (tx) => {
    const patients = await searchPatients(tx, {
      count: 1,
      userId,
      fullName,
      birthDate,
      nationalId,
      mrnNumber: undefined,
    })

    if (patients[0]) {
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
        user: { connect: { id: userId } },
        fullName,
        birthDate,
        mrnNumber: (lastPatient?.mrnNumber ?? 0) + 1,
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
