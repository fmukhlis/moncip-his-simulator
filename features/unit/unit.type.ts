import { getUnitsAction } from "./unit.action"

export type Unit = Awaited<ReturnType<typeof getUnitsAction>>["data"]["items"][number]
