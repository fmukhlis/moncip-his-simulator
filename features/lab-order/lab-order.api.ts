import z from "zod"
import {
  CreateLabOrderActionSchema,
  GetLabOrderDetailActionSchema,
  GetLabOrdersActionSchema,
} from "./lab-order.validation"
import { createLabOrderAction, getLabOrderDetailAction, getLabOrdersAction } from "./lab-order.action"
import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { getQueryClient } from "@/app/get-query-client"

export function getGetLabOrderDetailActionOptions(params: z.infer<typeof GetLabOrderDetailActionSchema>) {
  return queryOptions({
    queryKey: ["lab-order", "detail", params],
    queryFn: async () => {
      const response = await getLabOrderDetailAction(params)
      return response.data
    },
  })
}

export function getGetLabOrdersActionOptions(
  params: z.infer<typeof GetLabOrdersActionSchema>,
  enabled: boolean | undefined = true
) {
  return queryOptions({
    queryKey: ["lab-order", "list", params],
    queryFn: async () => {
      const response = await getLabOrdersAction(params)
      return response.data
    },
    enabled,
  })
}

export function getCreateLabOrderActionOptions() {
  return mutationOptions({
    mutationFn: async (params: z.infer<typeof CreateLabOrderActionSchema>) => {
      const response = await createLabOrderAction(params)
      return response.data
    },
    onSuccess: async () => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["lab-order", "list"],
        }),
      ])
    },
  })
}
