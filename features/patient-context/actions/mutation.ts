"use server"

import z from "zod"

import { requireAuthUser } from "@/lib/require-auth-user"
import {
  deletePatient,
  updatePatient,
  cancelEncounter,
  createEncounter,
  updateEncounter,
  completeEncounter,
} from "../dals/mutation"
import {
  DeletePatientSchema,
  UpdatePatientSchema,
  CancelEncounterSchema,
  CreateEncounterSchema,
  UpdateEncounterSchema,
  CompleteEncounterSchema,
  DeletePatientActionSchema,
  UpdatePatientActionSchema,
  CancelEncounterActionSchema,
  CreateEncounterActionSchema,
  UpdateEncounterActionSchema,
  CompleteEncounterActionSchema,
} from "../schema"

export async function updatePatientAction(params: z.infer<typeof UpdatePatientActionSchema>) {
  const user = await requireAuthUser()

  const { birthDate, fullName, sex, address, email, phone, nationalId, patientId, userId } = UpdatePatientSchema.parse({
    ...params,
    userId: user.id,
    patientId: params.patientId,
  })

  const queryResponse = await updatePatient({
    sex,
    email,
    phone,
    userId,
    address,
    fullName,
    patientId,
    birthDate,
    nationalId,
  })

  return { data: queryResponse }
}

export async function deletePatientAction(params: z.infer<typeof DeletePatientActionSchema>) {
  const user = await requireAuthUser()

  const { patientId, userId } = DeletePatientSchema.parse({ ...params, userId: user.id })

  const queryResponse = await deletePatient({ userId, patientId })

  return { data: queryResponse }
}

export async function createEncounterAction(params: z.infer<typeof CreateEncounterActionSchema>) {
  const user = await requireAuthUser()

  const { unitId, patientId, providerId, coverageType, type, reason, userId } = CreateEncounterSchema.parse({
    ...params,
    userId: user.id,
  })

  const queryResponse = await createEncounter({
    type,
    reason,
    unitId,
    userId,
    patientId,
    providerId,
    coverageType,
  })

  return { data: queryResponse }
}

export async function completeEncounterAction(params: z.infer<typeof CompleteEncounterActionSchema>) {
  const user = await requireAuthUser()

  const { encounterId, patientId, userId } = CompleteEncounterSchema.parse({ ...params, userId: user.id })

  const queryResponse = await completeEncounter({ userId, patientId, encounterId })

  return { data: queryResponse }
}

export async function cancelEncounterAction(params: z.infer<typeof CancelEncounterActionSchema>) {
  const user = await requireAuthUser()

  const { encounterId, patientId, userId } = CancelEncounterSchema.parse({ ...params, userId: user.id })

  const queryResponse = await cancelEncounter({ userId, patientId, encounterId })

  return { data: queryResponse }
}

export async function updateEncounterAction(params: z.infer<typeof UpdateEncounterActionSchema>) {
  const user = await requireAuthUser()

  const { unitId, patientId, providerId, coverageType, type, reason, userId, encounterId } =
    UpdateEncounterSchema.parse({ ...params, userId: user.id })

  const queryResponse = await updateEncounter({
    type,
    reason,
    unitId,
    userId,
    patientId,
    providerId,
    encounterId,
    coverageType,
  })

  return { data: queryResponse }
}
