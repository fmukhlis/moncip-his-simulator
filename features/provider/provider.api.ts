import { queryOptions } from "@tanstack/react-query"
import { getProvidersAction } from "./provider.action"
import z from "zod"
import { GetProvidersActionSchema } from "./provider.validation"

export function getGetProvidersActionOptions(
  params: z.infer<typeof GetProvidersActionSchema>,
  enabled: boolean | undefined = true
) {
  return queryOptions({
    queryKey: ["provider", "list"],
    queryFn: async () => {
      const response = await getProvidersAction(params)
      return response.data
    },
    enabled,
  })
}
