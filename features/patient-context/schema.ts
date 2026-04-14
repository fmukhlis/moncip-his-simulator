import z from "zod"

import { CreatePatientActionSchema } from "../registration/schema"
import { requiredCuid2, requiredEnumString } from "@/lib/custom-zod-types"
import { CoverageType, EncounterStatus, EncounterType, PatientSex } from "@/generated/prisma/enums"

// ########################################################################
// ####################### GetPatientDetailSchema #########################

export const GetPatientDetailActionSchema = z.strictObject({
  patientId: requiredCuid2("Patient"),
})

export const GetPatientDetailSchema = GetPatientDetailActionSchema.extend({
  userId: requiredCuid2("User"),
})

// ########################################################################
// ###################### GetActiveEncounterSchema ########################

export const GetActiveEncounterActionSchema = z.strictObject({
  patientId: requiredCuid2("Patient"),
})

export const GetActiveEncounterSchema = GetActiveEncounterActionSchema.extend({
  userId: requiredCuid2("User"),
})

// ########################################################################
// #################### GetLastEncounterActionSchema ######################

export const GetLastEncounterActionSchema = z.strictObject({
  patientId: requiredCuid2("Patient"),
})

export const GetLastEncounterSchema = GetLastEncounterActionSchema.extend({
  userId: requiredCuid2("User"),
})

// ########################################################################
// ####################### GetPatientEncountersCount ######################

export const GetPatientEncountersCountActionSchema = z.object({
  patientId: requiredCuid2("Patient"),
})

export const GetPatientEncountersCountSchema = GetPatientEncountersCountActionSchema.extend({
  userId: requiredCuid2("User"),
})

// #######################################################################
// ############################# UpdatePatient ###########################

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

// #######################################################################
// ############################# DeletePatient ###########################

export const DeletePatientActionSchema = z.object({ patientId: requiredCuid2("Patient") })

export const DeletePatientSchema = DeletePatientActionSchema.extend({ userId: requiredCuid2("User") })

// ########################################################################
// ######################## CreateEncounterSchema #########################

export const CreateEncounterActionSchema = z.strictObject({
  type: requiredEnumString(["OPD", "IPD", "ER"], "Encounter type"),
  reason: z.string().max(500, { error: "Reason must be 500 characters or less." }).default(""),
  unitId: requiredCuid2("Unit"),
  patientId: requiredCuid2("Patient"),
  providerId: requiredCuid2("Provider"),
  coverageType: requiredEnumString(["SELF_PAY", "BPJS", "INSURANCE"], "Coverage type"),
})

export const CreateEncounterSchema = CreateEncounterActionSchema.extend({
  userId: requiredCuid2("User"),
}).transform((value) => ({
  type: value.type as EncounterType,
  reason: value.reason.trim() === "" ? null : value.reason.trim(),
  userId: value.userId,
  unitId: value.unitId,
  patientId: value.patientId,
  providerId: value.providerId,
  coverageType: value.coverageType as CoverageType,
}))

// ########################################################################
// ##################### GetPatientEncountersSchema #######################

export const GetPatientEncountersActionSchema = z.object({
  q: z.string().trim(),
  page: z.number().int().positive().optional(),
  type: requiredEnumString(["ALL", "IPD", "OPD", "ER"], "Encounter Type"),
  unitId: z.string().trim(),
  status: requiredEnumString(["ALL", "ACTIVE", "COMPLETED", "CANCELLED"], "Encounter Status"),
  pageSize: z.number().int().positive().max(100).optional(),
  patientId: requiredCuid2("Patient"),
})

export const GetPatientEncountersSchema = GetPatientEncountersActionSchema.extend({
  userId: requiredCuid2("User"),
}).transform((value) => ({
  q: value.q,
  page: value.page ?? 1,
  type: value.type === "ALL" ? undefined : (value.type as EncounterType),
  unitId: value.unitId ? value.unitId : undefined,
  userId: value.userId,
  status: value.status === "ALL" ? undefined : (value.status as EncounterStatus),
  pageSize: value.pageSize ?? 10,
  patientId: value.patientId,
}))

// ########################################################################
// ######################### GetEncounterDetail ###########################

export const GetEncounterDetailActionSchema = z.strictObject({
  patientId: requiredCuid2("Patient"),
  encounterId: requiredCuid2("Encounter"),
})

export const GetEncounterDetailSchema = GetEncounterDetailActionSchema.extend({
  userId: requiredCuid2("User"),
})

// ########################################################################
// ###################### CompleteEncounterSchema #########################

export const CompleteEncounterActionSchema = z.strictObject({
  encounterId: requiredCuid2("Encounter"),
  patientId: requiredCuid2("Patient"),
})

export const CompleteEncounterSchema = CompleteEncounterActionSchema.extend({
  userId: requiredCuid2("User"),
})

// ########################################################################
// ####################### CancelEncounterSchema ##########################

export const CancelEncounterActionSchema = z.strictObject({
  encounterId: requiredCuid2("Encounter"),
  patientId: requiredCuid2("Patient"),
})

export const CancelEncounterSchema = CancelEncounterActionSchema.extend({
  userId: requiredCuid2("User"),
})

// ########################################################################
// ######################## UpdateEncounterSchema #########################

export const UpdateEncounterActionSchema = z.strictObject({
  type: requiredEnumString(["OPD", "IPD", "ER"], "Encounter type"),
  reason: z.string().max(500, { error: "Reason must be 500 characters or less." }).default(""),
  unitId: requiredCuid2("Unit"),
  patientId: requiredCuid2("Patient"),
  providerId: requiredCuid2("Provider"),
  encounterId: requiredCuid2("Encounter"),
  coverageType: requiredEnumString(["SELF_PAY", "BPJS", "INSURANCE"], "Coverage type"),
})

export const UpdateEncounterSchema = UpdateEncounterActionSchema.extend({
  userId: requiredCuid2("User"),
}).transform((value) => ({
  type: value.type as EncounterType,
  reason: value.reason.trim() === "" ? null : value.reason.trim(),
  userId: value.userId,
  unitId: value.unitId,
  patientId: value.patientId,
  providerId: value.providerId,
  encounterId: value.encounterId,
  coverageType: value.coverageType as CoverageType,
}))

// ########################################################################
// ################### GetEditEncounterPageDataSchema #####################

export const GetEditEncounterPageDataActionSchema = z.strictObject({
  patientId: requiredCuid2("Patient"),
  encounterId: requiredCuid2("Encounter"),
})

export const GetEditEncounterPageDataSchema = GetEditEncounterPageDataActionSchema.extend({
  userId: requiredCuid2("User"),
})
