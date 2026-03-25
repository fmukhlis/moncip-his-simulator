import z from "zod"

import { queryOptions } from "@tanstack/react-query"
import { searchPatientsAction } from "../actions/query"
import { SearchPatientsActionSchema } from "../schema"

export const getSearchPatientsActionOptions = (params: z.input<typeof SearchPatientsActionSchema>) =>
  queryOptions({
    queryKey: ["patients", "search", params],
    queryFn: async () => {
      console.log(params)
      const response = await searchPatientsAction(params)
      return response
    },
    enabled: SearchPatientsActionSchema.safeParse(params).success,
  })
