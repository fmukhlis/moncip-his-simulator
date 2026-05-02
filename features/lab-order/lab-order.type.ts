import { getLabOrderDetailAction, getLabOrdersAction } from "./lab-order.action"

export type LabOrderDetail = NonNullable<Awaited<ReturnType<typeof getLabOrderDetailAction>>["data"]>

export type LabOrder = Awaited<ReturnType<typeof getLabOrdersAction>>["data"]["items"][number]

export type LabOrderItem = LabOrderDetail["items"][number]

export type LabResultReport = LabOrderDetail["resultReports"][number]

export type LabResultItem = LabOrderDetail["resultReports"][number]["resultItems"][number]
