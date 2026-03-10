"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { CreatePatientSchema } from "../schema"

export async function createPatient({ userId, ...rest }: z.infer<typeof CreatePatientSchema>) {
  return await prisma.patient.create({
    data: { ...rest, user: { connect: { id: userId } } },
    select: {
      id: true,
      fullName: true,
      mrnNumber: true,
    },
  })
}
