import z from "zod"
import { queryOptions } from "@tanstack/react-query"
import { GetOrderableServiceDetailActionSchema, GetOrderableServicesActionSchema } from "./orderable-service.validation"
import { getOrderableServiceDetailAction, getOrderableServicesAction } from "./orderable-service.action"

export const getGetOrderableServicesActionOptions = (
  params: z.infer<typeof GetOrderableServicesActionSchema>,
  enabled: boolean | undefined = true
) =>
  queryOptions({
    queryKey: ["orderable-service", "list", params],
    queryFn: async () => {
      const response = await getOrderableServicesAction(params)
      return response.data
    },
    enabled,
  })

export const getGetOrderableServiceDetailActionOptions = (
  params: z.infer<typeof GetOrderableServiceDetailActionSchema>
) =>
  queryOptions({
    queryKey: ["orderable-service", "detail", params],
    queryFn: async () => {
      const response = await getOrderableServiceDetailAction(params)
      return response.data
    },
  })
