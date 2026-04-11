import { z } from "zod"
import { CreatePatientSchema } from "../registration/schema"
import { CoverageType, EncounterStatus, EncounterType } from "@/generated/prisma/enums"

const requiredCuid2 = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} is required.` })
    .pipe(z.string().cuid2({ message: `${label} is invalid.` }))

const requiredEnumString = <T extends readonly [string, ...string[]]>(values: T, label: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `${label} is required.` })
    .refine((value) => values.includes(value), {
      error: `Invalid ${label.toLowerCase()}.`,
    })

// #######################################################################
// ########################## GetPatientOverview #########################

export const GetPatientOverviewSchema = z.object({ patientId: requiredCuid2("Patient"), userId: requiredCuid2("User") })

export const GetPatientOverviewActionSchema = GetPatientOverviewSchema.omit({ userId: true })

// #######################################################################
// ############################# UpdatePatient ###########################

export const UpdatePatientSchema = CreatePatientSchema.extend({ patientId: requiredCuid2("Patient") })

export const UpdatePatientActionSchema = UpdatePatientSchema.omit({ userId: true })

export const UpdatePatientFormSchema = UpdatePatientActionSchema

// #######################################################################
// ############################# DeletePatient ###########################

export const DeletePatientSchema = z.object({ patientId: requiredCuid2("Patient"), userId: requiredCuid2("User") })

export const DeletePatientActionSchema = DeletePatientSchema.omit({ userId: true })

// #######################################################################
// ###################### GetCreateEncounterPageData #####################

export const GetCreateEncounterPageDataSchema = z.strictObject({
  userId: requiredCuid2("User"),
  patientId: requiredCuid2("Patient"),
})

export const GetCreateEncounterPageDataActionSchema = GetCreateEncounterPageDataSchema.omit({ userId: true })

// ########################################################################
// ############################ CreatePatient #############################

export const CreateEncounterActionSchema = z.strictObject({
  reason: z.string().max(500, { error: "Reason must be 500 characters or less." }).default(""),
  unitId: requiredCuid2("Unit"),
  patientId: requiredCuid2("Patient"),
  providerId: requiredCuid2("Provider"),
  coverageType: requiredEnumString(["SELF_PAY", "BPJS", "INSURANCE"], "Coverage type"),
  encounterType: requiredEnumString(["OPD", "IPD", "ER"], "Encounter type"),
})

export const CreateEncounterSchema = CreateEncounterActionSchema.extend({
  userId: requiredCuid2("User"),
}).transform((value) => ({
  reason: value.reason.trim() === "" ? null : value.reason.trim(),
  userId: value.userId,
  unitId: value.unitId,
  patientId: value.patientId,
  providerId: value.providerId,
  coverageType: value.coverageType as CoverageType,
  encounterType: value.encounterType as EncounterType,
}))

// ########################################################################
// ########################## GetEncounterList ############################

export const GetEncounterListActionSchema = z.object({
  q: z.string().trim(),
  page: z.number().int().positive().optional(),
  type: requiredEnumString(["ALL", "IPD", "OPD", "ER"], "Encounter Type"),
  unitId: z.string().trim(),
  status: requiredEnumString(["ALL", "ACTIVE", "COMPLETED", "CANCELLED"], "Encounter Status"),
  pageSize: z.number().int().positive().max(100).optional(),
  patientId: requiredCuid2("Patient"),
})

export const GetEncounterListSchema = GetEncounterListActionSchema.extend({ userId: requiredCuid2("User") }).transform(
  (value) => ({
    q: value.q,
    page: value.page ?? 1,
    type: value.type === "ALL" ? undefined : (value.type as EncounterType),
    unitId: value.unitId ? value.unitId : undefined,
    userId: value.userId,
    status: value.status === "ALL" ? undefined : (value.status as EncounterStatus),
    pageSize: value.pageSize ?? 10,
    patientId: value.patientId,
  })
)
