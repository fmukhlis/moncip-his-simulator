import { getEncounterDetailAction, getEncountersAction } from "./encounter.action"

export type EncounterDetail = NonNullable<Awaited<ReturnType<typeof getEncounterDetailAction>>["data"]>

export type Encounter = Awaited<ReturnType<typeof getEncountersAction>>["data"]["items"][number]
