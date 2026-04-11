"use server"

import { z } from "zod"
import { auth } from "@/auth"
import {
  getCreateEncounterPageData,
  getEncounterList,
  getEncounterUnitOptions,
  getPatientOverview,
} from "../dals/query"
import {
  GetCreateEncounterPageDataActionSchema,
  GetEncounterListActionSchema,
  GetEncounterListSchema,
  GetPatientOverviewActionSchema,
} from "../schema"

export async function getPatientOverviewAction(params: z.infer<typeof GetPatientOverviewActionSchema>) {
  // Authentication
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthenticated.")
  }

  // Payload validation
  const parsedData = GetPatientOverviewActionSchema.safeParse(params)
  if (!parsedData.success) {
    throw new Error("Data is invalid.")
  }

  const { patientId } = parsedData.data

  // DAL
  const queryResponse = await getPatientOverview({ patientId, userId: session.user.id })

  if (!queryResponse) {
    throw new Error("Patient not found.")
  }

  return { data: queryResponse }
}

export async function getCreateEncounterPageDataAction(params: z.infer<typeof GetCreateEncounterPageDataActionSchema>) {
  // Authentication
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthenticated.")
  }

  // Payload validation
  const parsedData = GetCreateEncounterPageDataActionSchema.safeParse(params)
  if (!parsedData.success) {
    throw new Error("Data is invalid.")
  }

  const { patientId } = parsedData.data

  // DAL
  const queryResponse = await getCreateEncounterPageData({
    userId: session.user.id,
    patientId,
  })

  return { data: queryResponse }
}

export async function getEncounterListAction(params: z.infer<typeof GetEncounterListActionSchema>) {
  // Authentication
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthenticated.")
  }

  // Payload validation
  const parsedData = GetEncounterListSchema.safeParse({ ...params, userId: session.user.id })
  if (!parsedData.success) {
    throw new Error("Data is invalid.")
  }

  const { q, page, status, type, unitId, pageSize, userId, patientId } = parsedData.data

  // DAL
  const queryResponse = await getEncounterList({
    q,
    page,
    type,
    status,
    unitId,
    userId,
    pageSize,
    patientId,
  })

  return { data: queryResponse }
}

export async function getEncounterUnitOptionsAction() {
  // Authentication
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthenticated.")
  }

  // DAL
  const queryResponse = await getEncounterUnitOptions()

  return { data: queryResponse }
}
