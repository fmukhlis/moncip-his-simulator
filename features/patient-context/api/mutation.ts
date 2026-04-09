import { z } from "zod"
import { getQueryClient } from "@/app/get-query-client"
import { mutationOptions } from "@tanstack/react-query"
import { createEncounterAction, deletePatientAction, updatePatientAction } from "../actions/mutation"
import { CreateEncounterActionSchema, DeletePatientActionSchema, UpdatePatientFormSchema } from "../schema"

export const getUpdatePatientActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof UpdatePatientFormSchema>) => {
      const response = await updatePatientAction(params)
      return response
    },
    onSuccess: async ({ id }) => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["patients", "search"],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patients", id, "overview"],
        }),
      ])
    },
  })

export const getDeletePatientActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof DeletePatientActionSchema>) => {
      const response = await deletePatientAction(params)
      return response
    },
    onSuccess: async ({ id }) => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["patients", "search"],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patients", id, "overview"],
        }),
      ])
    },
  })

export const getCreateEncounterActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof CreateEncounterActionSchema>) => {
      const response = await createEncounterAction(params)
      return response
    },
    onSuccess: async ({ patientId }) => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["patients", patientId, "overview"],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patients", patientId, "encounters", "create"],
        }),
      ])
    },
  })
