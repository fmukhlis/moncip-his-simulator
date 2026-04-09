"use server"

import { z } from "zod"
import { auth } from "@/auth"
import { createEncounter, deletePatient, updatePatient } from "../dals/mutation"
import {
  CreateEncounterSchema,
  DeletePatientActionSchema,
  UpdatePatientActionSchema,
  CreateEncounterActionSchema,
} from "../schema"

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

export async function createEncounterAction(params: z.infer<typeof CreateEncounterActionSchema>) {
  // Authentication
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthenticated.")
  }

  // Payload validation
  const parsedData = CreateEncounterSchema.safeParse({ ...params, userId: session.user.id })
  if (!parsedData.success) {
    throw new Error("Data is invalid.")
  }

  const { unitId, patientId, providerId, coverageType, encounterType, reason, userId } = parsedData.data

  // DAL
  const patient = await createEncounter({
    reason,
    unitId,
    userId,
    patientId,
    providerId,
    coverageType,
    encounterType,
  })

  return { ...patient }
}
