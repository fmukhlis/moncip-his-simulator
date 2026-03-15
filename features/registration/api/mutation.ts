import { z } from "zod"
import { mutationOptions } from "@tanstack/react-query"
import { createPatientAction } from "../actions/mutation"
import { CreatePatientFormSchema } from "../schema"

export const getCreatePatientActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof CreatePatientFormSchema>) => {
      const response = await createPatientAction(params)
      return response
    },
  })
