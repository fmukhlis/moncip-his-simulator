import { getOrderableServiceDetailAction, getOrderableServicesAction } from "./orderable-service.action"

export type OrderableServiceDetail = NonNullable<Awaited<ReturnType<typeof getOrderableServiceDetailAction>>["data"]>

export type OrderableService = Awaited<ReturnType<typeof getOrderableServicesAction>>["data"]["items"][number]
