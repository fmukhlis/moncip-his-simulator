import { queryOptions } from "@tanstack/react-query"
import { getCreateEncounterPageDataAction, getPatientOverviewAction } from "../actions/query"

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
