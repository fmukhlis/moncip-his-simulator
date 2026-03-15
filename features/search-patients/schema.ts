import { z } from "zod"

// #######################################################################
// ############################ SearchPatients ###########################

const SearchPatientsBase = z.object({
  count: z.number().positive().optional(),
  userId: z.string().cuid2(),
  fullName: z.string().trim().min(1).optional(),
  birthDate: z.coerce.date().optional(),
  nationalId: z.string().trim().regex(/^\d+$/, "National ID must be numeric").optional(),
})

export const SearchPatientsSchema = SearchPatientsBase.extend({ mrnNumber: z.number().optional() }).refine(
  (data) => data.mrnNumber || data.birthDate || data.fullName || data.nationalId,
  {
    message: "At least one search field must be provided",
    path: ["mrnNumber"],
  }
)

export const SearchPatientsActionSchema = SearchPatientsBase.omit({ userId: true })
  .extend({
    mrn: z.string().trim().min(1).optional(),
  })
  .refine((data) => data.mrn || data.birthDate || data.fullName || data.nationalId, {
    message: "At least one search field must be provided",
    path: ["mrn"],
  })
