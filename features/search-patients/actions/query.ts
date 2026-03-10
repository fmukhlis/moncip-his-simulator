"use server"

import { z } from "zod"
import { auth } from "@/auth"
import { searchPatients } from "../dals/query"
import { SearchPatientsActionSchema } from "../schema"

export async function searchPatientsAction(params: z.input<typeof SearchPatientsActionSchema>) {
  // Authentication
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthenticated.")
  }

  // Payload validation
  const parsedData = SearchPatientsActionSchema.safeParse(params)
  if (!parsedData.success) {
    throw new Error("Data is invalid.")
  }

  const { birthDate, count, fullName, mrn, nationalId } = parsedData.data

  // DAL
  const queryResponse = await searchPatients({
    count: count,
    userId: session.user.id,
    fullName,
    birthDate,
    mrnNumber: Number(mrn?.match(/\d+/)?.[0] ?? 0),
    nationalId,
  })

  return { data: queryResponse, meta: { count: queryResponse.length } }
}
