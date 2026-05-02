import { PatientSex } from "@/generated/prisma/enums"
import { requiredCuid2, requiredEnumString } from "@/lib/custom-zod-types"
import z from "zod"

export const GetPatientDetailActionSchema = z.strictObject({
  patientId: requiredCuid2("Patient"),
})

export const GetPatientDetailSchema = GetPatientDetailActionSchema.extend({
  userId: requiredCuid2("User"),
})

export const GetPatientsActionSchema = z.strictObject({
  page: z.coerce.number().int().positive().optional(),
  trashed: z.boolean().default(false),
  fullName: z.string().trim(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  birthDate: z.coerce.date().optional(),
  mrnNumber: z.string().trim(),
  nationalId: z.string().trim().regex(/^\d*$/, "National ID must be numeric"),
})

export const GetPatientsSchema = GetPatientsActionSchema.extend({
  userId: requiredCuid2("User"),
}).transform((value) => {
  const numericMRN = value?.mrnNumber ? value.mrnNumber.match(/\d+/) : undefined
  const useServerSidePagination = value.page !== undefined || value.pageSize !== undefined

  return {
    userId: value.userId,
    trashed: value.trashed,
    fullName: value.fullName ? value.fullName : undefined,
    birthDate: value.birthDate,
    mrnNumber: numericMRN ? Number(numericMRN) : undefined,
    nationalId: value.nationalId ? value.nationalId : undefined,
    serverPagination: useServerSidePagination ? { page: value.page ?? 1, pageSize: value.pageSize ?? 10 } : null,
  }
})

export const CreatePatientActionSchema = z.object({
  sex: requiredEnumString(["M", "F"], "Sex"),
  email: z.string().trim().max(30),
  phone: z.string().trim().max(30).regex(/^\d*$/, "Phone must be numeric"),
  address: z.string().trim().max(255),
  fullName: z.string().trim().min(1).max(200),
  birthDate: z.coerce.date(),
  nationalId: z.string().trim().regex(/^\d*$/, "National ID must be numeric").max(30),
})

export const CreatePatientSchema = CreatePatientActionSchema.extend({
  userId: requiredCuid2("User"),
  mrnNumber: z.number().positive(),
}).transform((value) => ({
  sex: value.sex as PatientSex,
  email: value.email ? value.email : undefined,
  phone: value.phone ? value.phone : undefined,
  userId: value.userId,
  address: value.address ? value.address : undefined,
  fullName: value.fullName,
  birthDate: value.birthDate,
  mrnNumber: value.mrnNumber,
  nationalId: value.nationalId ? value.nationalId : undefined,
}))

export const UpdatePatientActionSchema = CreatePatientActionSchema.extend({
  patientId: requiredCuid2("Patient"),
})

export const UpdatePatientSchema = UpdatePatientActionSchema.extend({
  userId: requiredCuid2("User"),
}).transform((value) => ({
  sex: value.sex as PatientSex,
  email: value.email ? value.email : undefined,
  phone: value.phone ? value.phone : undefined,
  userId: value.userId,
  address: value.address ? value.address : undefined,
  fullName: value.fullName,
  birthDate: value.birthDate,
  patientId: value.patientId,
  nationalId: value.nationalId ? value.nationalId : undefined,
}))

export const DeletePatientActionSchema = z.object({ patientId: requiredCuid2("Patient") })

export const DeletePatientSchema = DeletePatientActionSchema.extend({ userId: requiredCuid2("User") })
