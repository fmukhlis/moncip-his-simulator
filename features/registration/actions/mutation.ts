"use server"

import z from "zod"

import { createPatient } from "../dals/mutation"
import { requireAuthUser } from "@/lib/require-auth-user"
import { CreatePatientActionSchema, CreatePatientSchema } from "../schema"

export async function createPatientAction(params: z.infer<typeof CreatePatientActionSchema>) {
  // Authentication
  const user = await requireAuthUser()

  // Payload validation
  const { birthDate, fullName, sex, address, email, phone, nationalId, userId } = CreatePatientSchema.parse({
    ...params,
    userId: user.id,
  })

  // DAL
  const patient = await createPatient({
    sex,
    email,
    phone,
    userId,
    address,
    fullName,
    birthDate,
    nationalId,
  })

  return { id: patient.id }
}
