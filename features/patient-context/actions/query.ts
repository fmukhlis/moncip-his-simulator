"use server"

import { z } from "zod"
import { auth } from "@/auth"
import { getPatientOverview } from "../dals/query"
import { GetPatientOverviewActionSchema } from "../schema"

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
