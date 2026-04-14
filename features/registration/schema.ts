import z from "zod"

import { PatientSex } from "@/generated/prisma/enums"
import { requiredCuid2, requiredEnumString } from "@/lib/custom-zod-types"

// #######################################################################
// ############################ CreatePatient ############################

export const CreatePatientActionSchema = z.object({
  sex: requiredEnumString(["M", "F"], "Sex"),
  email: z.string().trim().max(30),
  phone: z.string().trim().max(30).regex(/^\d*$/, "Phone must be numeric"),
  address: z.string().trim().max(255),
  fullName: z.string().trim().min(1).max(200),
  birthDate: z.coerce.date(),
  nationalId: z.string().trim().regex(/^\d*$/, "National ID must be numeric").max(30),
})

export const CreatePatientSchema = CreatePatientActionSchema.extend({ userId: requiredCuid2("User") }).transform(
  (value) => ({
    sex: value.sex as PatientSex,
    email: value.email ? value.email : undefined,
    phone: value.phone ? value.phone : undefined,
    userId: value.userId,
    address: value.address ? value.address : undefined,
    fullName: value.fullName,
    birthDate: value.birthDate,
    nationalId: value.nationalId ? value.nationalId : undefined,
  })
)
