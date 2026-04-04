"use server"

import { z } from "zod"
import { auth } from "@/auth"
import { deletePatient, updatePatient } from "../dals/mutation"
import { DeletePatientActionSchema, UpdatePatientActionSchema } from "../schema"

export async function updatePatientAction(params: z.infer<typeof UpdatePatientActionSchema>) {
  // Authentication
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthenticated.")
  }

  // Payload validation
  const parsedData = UpdatePatientActionSchema.safeParse(params)
  if (!parsedData.success) {
    throw new Error("Data is invalid.")
  }

  const { birthDate, fullName, sex, address, email, phone, nationalId, patientId } = parsedData.data

  // DAL
  const patient = await updatePatient({
    sex,
    email,
    phone,
    userId: session.user.id,
    address,
    fullName,
    patientId,
    birthDate,
    nationalId,
  })

  return { ...patient }
}

export async function deletePatientAction(params: z.infer<typeof DeletePatientActionSchema>) {
  // Authentication
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthenticated.")
  }

  // Payload validation
  const parsedData = DeletePatientActionSchema.safeParse(params)
  if (!parsedData.success) {
    throw new Error("Data is invalid.")
  }

  const { patientId } = parsedData.data

  // DAL
  const patient = await deletePatient({
    userId: session.user.id,
    patientId,
  })

  return { ...patient }
}
