"use server"

import { z } from "zod"
import { auth } from "@/auth"
import { createPatient } from "../dals/mutation"
import { CreatePatientActionSchema } from "../schema"

export async function createPatientAction(params: z.infer<typeof CreatePatientActionSchema>) {
  // Authentication
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthenticated.")
  }

  // Payload validation
  const parsedData = CreatePatientActionSchema.safeParse(params)
  if (!parsedData.success) {
    throw new Error("Data is invalid.")
  }

  const { birthDate, fullName, sex, address, email, phone, nationalId } = parsedData.data

  // DAL
  const queryResponse = await createPatient({
    sex,
    email,
    phone,
    userId: session.user.id,
    address,
    fullName,
    birthDate,
    nationalId,
  })

  return { id: queryResponse.id }
}
