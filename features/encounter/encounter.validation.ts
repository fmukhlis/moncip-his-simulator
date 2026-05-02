import { CoverageType, EncounterStatus, EncounterType } from "@/generated/prisma/enums"
import { requiredCuid2, requiredEnumString } from "@/lib/custom-zod-types"
import z from "zod"

export const GetEncounterDetailActionSchema = z.strictObject({
  id: z.string().cuid2().optional(),
  status: z.array(z.enum(EncounterStatus)).optional(),
  patientId: requiredCuid2("Patient"),
})

export const GetEncounterDetailSchema = GetEncounterDetailActionSchema.extend({
  userId: requiredCuid2("User"),
})

export const GetEncountersActionSchema = z.strictObject({
  page: z.coerce.number().int().positive().optional(),
  type: z.array(z.enum(EncounterType)).nonempty(),
  search: z.string().trim(),
  unitId: z.string().trim(),
  status: z.array(z.enum(EncounterStatus)).nonempty(),
  trashed: z.boolean().default(false),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  patientId: z.string().trim(),
})

export const GetEncountersSchema = GetEncountersActionSchema.extend({
  userId: requiredCuid2("User"),
}).transform((value) => {
  const useServerSidePagination = value.page !== undefined || value.pageSize !== undefined

  return {
    type: value.type,
    search: value.search ? value.search : undefined,
    unitId: value.unitId ? value.unitId : undefined,
    userId: value.userId,
    status: value.status,
    trashed: value.trashed,
    patientId: value.patientId ? value.patientId : undefined,
    serverPagination: useServerSidePagination ? { page: value.page ?? 1, pageSize: value.pageSize ?? 10 } : null,
  }
})

export const ReserveEncounterNumberSchema = z.strictObject({
  date: z.date(),
})

export const CreateEncounterActionSchema = z.strictObject({
  type: requiredEnumString(["OPD", "IPD", "ER"], "Encounter type"),
  reason: z.string().max(500, { error: "Reason must be 500 characters or less." }).default(""),
  unitId: requiredCuid2("Unit"),
  patientId: requiredCuid2("Patient"),
  providerId: requiredCuid2("Provider"),
  coverageType: requiredEnumString(["SELF_PAY", "BPJS", "INSURANCE"], "Coverage type"),
})

export const CreateEncounterSchema = CreateEncounterActionSchema.extend({
  no: z.string().trim().min(1),
  period: z.string().trim().min(1),
  sequence: z.int().positive(),
}).transform((value) => ({
  no: value.no,
  type: value.type as EncounterType,
  period: value.period,
  reason: value.reason.trim() === "" ? null : value.reason.trim(),
  unitId: value.unitId,
  sequence: value.sequence,
  patientId: value.patientId,
  providerId: value.providerId,
  coverageType: value.coverageType as CoverageType,
}))

export const CompleteEncounterActionSchema = z.strictObject({
  id: requiredCuid2("Encounter"),
  patientId: requiredCuid2("Patient"),
})

export const CompleteEncounterSchema = CompleteEncounterActionSchema.extend({
  userId: requiredCuid2("User"),
})

export const CancelEncounterActionSchema = z.strictObject({
  id: requiredCuid2("Encounter"),
  patientId: requiredCuid2("Patient"),
})

export const CancelEncounterSchema = CancelEncounterActionSchema.extend({
  userId: requiredCuid2("User"),
})

export const UpdateEncounterActionSchema = z.strictObject({
  id: requiredCuid2("Encounter"),
  type: requiredEnumString(["OPD", "IPD", "ER"], "Encounter type"),
  reason: z.string().max(500, { error: "Reason must be 500 characters or less." }).default(""),
  unitId: requiredCuid2("Unit"),
  patientId: requiredCuid2("Patient"),
  providerId: requiredCuid2("Provider"),
  coverageType: requiredEnumString(["SELF_PAY", "BPJS", "INSURANCE"], "Coverage type"),
})

export const UpdateEncounterSchema = UpdateEncounterActionSchema.extend({
  userId: requiredCuid2("User"),
}).transform((value) => ({
  id: value.id,
  type: value.type as EncounterType,
  reason: value.reason.trim() === "" ? null : value.reason.trim(),
  userId: value.userId,
  unitId: value.unitId,
  patientId: value.patientId,
  providerId: value.providerId,
  coverageType: value.coverageType as CoverageType,
}))
