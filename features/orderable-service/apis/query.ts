import z from "zod"

import { queryOptions } from "@tanstack/react-query"
import { GetOrderableServiceByIdActionSchema } from "../schemas/query"
import { getOrderableServiceByIdAction, getOrderableServicesAction } from "../actions/query"

export const getGetOrderableServicesActionOptions = () =>
  queryOptions({
    queryKey: ["orderable-services"],
    queryFn: async () => {
      const response = await getOrderableServicesAction()
      return response.data
    },
  })

export const getActiveGetOrderableServicesActionOptions = () =>
  queryOptions({
    queryKey: ["active-orderable-services"],
    queryFn: async () => {
      const response = await getOrderableServicesAction()
      return response.data
    },
  })

export const getGetOrderableServiceByIdAction = (params: z.infer<typeof GetOrderableServiceByIdActionSchema>) =>
  queryOptions({
    queryKey: ["active-orderable-services", params.id],
    queryFn: async () => {
      const response = await getOrderableServiceByIdAction(params)
      return response.data
    },
  })
