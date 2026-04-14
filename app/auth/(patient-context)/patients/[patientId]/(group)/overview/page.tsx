import { Timeline } from "@/components/patient-overview/timeline"
import { LabOrders } from "@/components/patient-overview/lab-orders"
import { getQueryClient } from "@/app/get-query-client"
import { ActiveEncounter } from "@/components/patient-overview/active-encounter"
import { PatientSnapshot } from "@/components/patient-overview/patient-snapshot"
import {
  getGetLastEncounterActionOptions,
  getGetActiveEncounterActionOptions,
  getGetPatientEncountersCountActionOptions,
} from "@/features/patient-context/api/query"

export default async function PatientOverview({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(getGetLastEncounterActionOptions({ patientId }))
  await queryClient.prefetchQuery(getGetActiveEncounterActionOptions({ patientId }))
  await queryClient.prefetchQuery(getGetPatientEncountersCountActionOptions({ patientId }))

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <PatientSnapshot patientId={patientId} />
      <ActiveEncounter patientId={patientId} />
      <LabOrders />
      <Timeline />
    </div>
  )
}
