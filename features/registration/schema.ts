import { z } from "zod"

// #######################################################################
// ############################ CreatePatient ############################

export const CreatePatientSchema = z.object({
  sex: z.enum(["M", "F"]),
  email: z.preprocess((v) => (v === "" ? undefined : v), z.string().max(30).optional()),
  phone: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().regex(/^\d+$/, "National ID must be numeric").max(30).optional()
  ),
  userId: z.string().cuid2(),
  address: z.preprocess((v) => (v === "" ? undefined : v), z.string().max(255).optional()),
  fullName: z.string().trim().min(1).max(200),
  birthDate: z.coerce.date(),
  nationalId: z.preprocess((v) => (v === "" ? undefined : v), z.string().max(30).optional()),
})

export const CreatePatientActionSchema = CreatePatientSchema.omit({ userId: true })

export const CreatePatientFormSchema = CreatePatientActionSchema

// #######################################################################
// ######################### FindDuplicatePatient ########################

export const FindDuplicatePatientSchema = z.object({
  userId: z.string().cuid2(),
  fullName: z.string().trim().min(1).max(200),
  birthDate: z.coerce.date(),
  nationalId: z.preprocess((v) => (v === "" ? undefined : v), z.string().max(30).optional()),
})
