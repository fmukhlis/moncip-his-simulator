import z from "zod"

import { getQueryClient } from "@/app/get-query-client"
import { mutationOptions } from "@tanstack/react-query"
import { createPatientAction } from "../actions/mutation"
import { CreatePatientActionSchema } from "../schema"

export const getCreatePatientActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof CreatePatientActionSchema>) => {
      const response = await createPatientAction(params)
      return response
    },
    onSuccess: async () => {
      await getQueryClient().invalidateQueries({
        queryKey: ["patient-search"],
      })
    },
  })
