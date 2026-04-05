import { z } from "zod"
import { CreatePatientSchema } from "../registration/schema"

// #######################################################################
// ########################## GetPatientOverview #########################

export const GetPatientOverviewSchema = z.object({ patientId: z.string().cuid2(), userId: z.string().cuid2() })

export const GetPatientOverviewActionSchema = GetPatientOverviewSchema.omit({ userId: true })

// #######################################################################
// ############################## UpdatePatient ##########################

export const UpdatePatientSchema = CreatePatientSchema.extend({ patientId: z.string().cuid2() })

export const UpdatePatientActionSchema = UpdatePatientSchema.omit({ userId: true })

export const UpdatePatientFormSchema = UpdatePatientActionSchema

// #######################################################################
// ############################## DeletePatient ##########################

export const DeletePatientSchema = z.object({ patientId: z.string().cuid2(), userId: z.string().cuid2() })

export const DeletePatientActionSchema = DeletePatientSchema.omit({ userId: true })
