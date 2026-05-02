import { queryOptions } from "@tanstack/react-query"
import { getUnitsAction } from "./unit.action"
import z from "zod"
import { GetUnitsActionSchema } from "./unit.validation"

export function getGetUnitsActionOptions(
  params: z.infer<typeof GetUnitsActionSchema>,
  enabled: boolean | undefined = true
) {
  return queryOptions({
    queryKey: ["unit", "list"],
    queryFn: async () => {
      const response = await getUnitsAction(params)
      return response.data
    },
    enabled,
  })
}
