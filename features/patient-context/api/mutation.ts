import { z } from "zod"
import { getQueryClient } from "@/app/get-query-client"
import { mutationOptions } from "@tanstack/react-query"
import { deletePatientAction, updatePatientAction } from "../actions/mutation"
import { DeletePatientActionSchema, UpdatePatientFormSchema } from "../schema"

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
