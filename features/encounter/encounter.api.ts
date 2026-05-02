import z from "zod"
import {
  CancelEncounterActionSchema,
  CompleteEncounterActionSchema,
  CreateEncounterActionSchema,
  GetEncounterDetailActionSchema,
  GetEncountersActionSchema,
  UpdateEncounterActionSchema,
} from "./encounter.validation"
import { mutationOptions, queryOptions } from "@tanstack/react-query"
import {
  cancelEncounterAction,
  completeEncounterAction,
  createEncounterAction,
  cachedGetEncounterDetailAction,
  getEncountersAction,
  updateEncounterAction,
} from "./encounter.action"
import { getQueryClient } from "@/app/get-query-client"

export function getGetEncounterDetailActionOptions(params: z.infer<typeof GetEncounterDetailActionSchema>) {
  return queryOptions({
    queryKey: ["encounter", "detail", params],
    queryFn: async () => {
      const response = await cachedGetEncounterDetailAction(params)
      return response.data
    },
  })
}

export function getGetEncountersActionOptions(
  params: z.infer<typeof GetEncountersActionSchema>,
  enabled: boolean | undefined = true
) {
  return queryOptions({
    queryKey: ["encounter", "list", params],
    queryFn: async () => {
      const response = await getEncountersAction(params)
      return response.data
    },
    enabled,
  })
}

export const getCreateEncounterActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof CreateEncounterActionSchema>) => {
      const response = await createEncounterAction(params)
      return response.data
    },
    onSuccess: async () => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["encounter", "list"],
        }),
      ])
    },
  })

export const getCompleteEncounterActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof CompleteEncounterActionSchema>) => {
      const response = await completeEncounterAction(params)
      return response.data
    },
    onSuccess: async () => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["encounter"],
        }),
      ])
    },
  })

export const getCancelEncounterActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof CancelEncounterActionSchema>) => {
      const response = await cancelEncounterAction(params)
      return response.data
    },
    onSuccess: async () => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["encounter"],
        }),
      ])
    },
  })

export const getUpdateEncounterActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof UpdateEncounterActionSchema>) => {
      const response = await updateEncounterAction(params)
      return response.data
    },
    onSuccess: async () => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["encounter"],
        }),
      ])
    },
  })
