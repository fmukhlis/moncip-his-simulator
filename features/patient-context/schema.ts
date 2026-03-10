import { z } from "zod"

// #######################################################################
// ########################## GetPatientOverview #########################

export const GetPatientOverviewSchema = z.object({ patientId: z.string().cuid2() })

export const GetPatientOverviewActionSchema = GetPatientOverviewSchema
