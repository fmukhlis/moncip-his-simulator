import z from "zod"

import { queryOptions } from "@tanstack/react-query"
import {
  GetLastEncounterActionSchema,
  GetPatientDetailActionSchema,
  GetActiveEncounterActionSchema,
  GetEncounterDetailActionSchema,
  GetPatientEncountersActionSchema,
  GetPatientEncountersCountActionSchema,
} from "../schema"
import {
  getLastEncounterAction,
  getPatientDetailAction,
  getEncounterUnitsAction,
  getActiveEncounterAction,
  getPatientEncountersAction,
  getEncounterProvidersAction,
  cachedGetEncounterDetailAction,
  getPatientEncountersCountAction,
} from "../actions/query"

export const getGetPatientDetailActionOptions = (params: z.infer<typeof GetPatientDetailActionSchema>) =>
  queryOptions({
    queryKey: ["patient-detail", params.patientId],
    queryFn: async () => {
      const response = await getPatientDetailAction(params)
      return response.data
    },
  })

export const getGetActiveEncounterActionOptions = (params: z.infer<typeof GetActiveEncounterActionSchema>) =>
  queryOptions({
    queryKey: ["patient-active-encounter", params.patientId],
    queryFn: async () => {
      const response = await getActiveEncounterAction(params)
      return response.data
    },
  })

export const getGetLastEncounterActionOptions = (params: z.infer<typeof GetLastEncounterActionSchema>) =>
  queryOptions({
    queryKey: ["patient-last-encounter", params.patientId],
    queryFn: async () => {
      const response = await getLastEncounterAction(params)
      return response.data
    },
  })

export const getGetPatientEncountersCountActionOptions = (
  params: z.infer<typeof GetPatientEncountersCountActionSchema>
) =>
  queryOptions({
    queryKey: ["patient-encounters-count", params.patientId, "count"],
    queryFn: async () => {
      const response = await getPatientEncountersCountAction(params)
      return response.data
    },
  })

export const getGetEncounterUnitsActionOptions = () =>
  queryOptions({
    queryKey: ["encounter-units"],
    queryFn: async () => {
      const response = await getEncounterUnitsAction()
      return response.data
    },
  })

export const getGetEncounterProvidersActionOptions = () =>
  queryOptions({
    queryKey: ["encounter-providers"],
    queryFn: async () => {
      const response = await getEncounterProvidersAction()
      return response.data
    },
  })

export const getGetPatientEncountersActionOptions = (params: z.infer<typeof GetPatientEncountersActionSchema>) =>
  queryOptions({
    queryKey: ["patient-encounters", params.patientId, params],

    queryFn: async () => {
      const response = await getPatientEncountersAction(params)
      return response.data
    },
    enabled: GetPatientEncountersActionSchema.safeParse(params).success,
  })

export const getCachedGetEncounterDetailActionOptions = (params: z.infer<typeof GetEncounterDetailActionSchema>) =>
  queryOptions({
    queryKey: ["encounter-detail", params.encounterId],
    queryFn: async () => {
      const response = await cachedGetEncounterDetailAction(params)
      return response.data
    },
  })
