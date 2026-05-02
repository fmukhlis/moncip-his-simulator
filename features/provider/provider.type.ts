import { getProvidersAction } from "./provider.action"

export type Provider = Awaited<ReturnType<typeof getProvidersAction>>["data"][number]
