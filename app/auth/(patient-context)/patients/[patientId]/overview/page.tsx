import { Timeline } from "@/components/patient-overview/timeline"
import { LabOrders } from "@/components/patient-overview/lab-orders"
import { ActiveEncounter } from "@/components/patient-overview/active-encounter"
import { PatientSnapshot } from "@/components/patient-overview/patient-snapshot"

export default async function PatientOverview({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <PatientSnapshot patientId={patientId} />
      <ActiveEncounter />
      <LabOrders />
      <Timeline />
    </div>
  )
}
