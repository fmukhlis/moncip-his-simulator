import z from "zod"

import { requiredCuid2 } from "@/lib/custom-zod-types"

// #######################################################################
// ############################ SearchPatients ###########################

export const SearchPatientsActionSchema = z
  .strictObject({
    count: z.number().positive(),
    fullName: z.string().trim(),
    birthDate: z.coerce.date().optional(),
    mrnNumber: z.string().trim(),
    nationalId: z.string().trim().regex(/^\d*$/, "National ID must be numeric"),
  })
  .refine((data) => data.mrnNumber || data.birthDate || data.fullName || data.nationalId, {
    message: "At least one search field must be provided",
    path: ["mrnNumber"],
  })

export const SearchPatientsSchema = SearchPatientsActionSchema.extend({
  userId: requiredCuid2("User"),
}).transform((value) => {
  const numericMRN = value?.mrnNumber ? value.mrnNumber.match(/\d+/) : undefined

  return {
    count: value.count,
    userId: value.userId,
    fullName: value.fullName ? value.fullName : undefined,
    birthDate: value.birthDate,
    mrnNumber: numericMRN ? Number(numericMRN) : undefined,
    nationalId: value.nationalId ? value.nationalId : undefined,
  }
})
