"use server"

import z from "zod"

import { prisma } from "@/lib/prisma"
import { searchPatients } from "../dals/query"
import { requireAuthUser } from "@/lib/require-auth-user"
import { SearchPatientsActionSchema, SearchPatientsSchema } from "../schema"

export async function searchPatientsAction(params: z.input<typeof SearchPatientsActionSchema>) {
  // Authentication
  const user = await requireAuthUser()

  // Payload validation
  const { birthDate, count, fullName, mrnNumber, nationalId, userId } = SearchPatientsSchema.parse({
    ...params,
    userId: user.id,
  })

  // DAL
  const queryResponse = await searchPatients(prisma, {
    count: count,
    userId,
    fullName,
    birthDate,
    mrnNumber,
    nationalId,
  })

  return { data: queryResponse }
}
