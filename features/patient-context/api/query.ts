import z from "zod"

import { queryOptions } from "@tanstack/react-query"
import { GetEncounterListActionSchema } from "../schema"
import {
  getCreateEncounterPageDataAction,
  getEncounterListAction,
  getEncounterUnitOptionsAction,
  getPatientOverviewAction,
} from "../actions/query"

export const getGetPatientOverviewActionOptions = (patientId: string) =>
  queryOptions({
    queryKey: ["patients", patientId, "overview"],
    queryFn: async () => {
      const response = await getPatientOverviewAction({ patientId })
      return response.data
    },
  })

export const getGetCreateEncounterPageDataActionOptions = (patientId: string) =>
  queryOptions({
    queryKey: ["patients", patientId, "encounters", "create"],
    queryFn: async () => {
      const response = await getCreateEncounterPageDataAction({ patientId })
      return response.data
    },
  })

export const getGetEncounterListActionOptions = (params: z.infer<typeof GetEncounterListActionSchema>) =>
  queryOptions({
    queryKey: ["encounters", "search", params],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      const response = await getEncounterListAction(params)
      return response.data
    },
    enabled: GetEncounterListActionSchema.safeParse(params).success,
  })

export const getGetEncounterUnitOptionsAction = () =>
  queryOptions({
    queryKey: ["encounter-units"],
    queryFn: async () => {
      const response = await getEncounterUnitOptionsAction()
      return response.data
    },
  })
