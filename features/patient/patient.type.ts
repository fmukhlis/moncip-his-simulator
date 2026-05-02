import { cachedGetPatientDetailAction, getPatientsAction } from "./patient.action"

export type PatientDetail = NonNullable<Awaited<ReturnType<typeof cachedGetPatientDetailAction>>["data"]>

export type Patient = Awaited<ReturnType<typeof getPatientsAction>>["data"]["items"][number]
