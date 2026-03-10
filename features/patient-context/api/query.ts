import { queryOptions } from "@tanstack/react-query"
import { getPatientOverviewAction } from "../actions/query"

export const getPatientOverviewActionOptions = (patientId: string) =>
  queryOptions({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      const response = await getPatientOverviewAction({ patientId })
      return response.data
    },
  })
