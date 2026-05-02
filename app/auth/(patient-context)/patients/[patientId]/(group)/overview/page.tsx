import { Suspense } from "react"
import { getQueryClient } from "@/app/get-query-client"
import { ActiveEncounter } from "@/components/patient-overview/active-encounter"
import { LabOrders } from "@/components/patient-overview/lab-orders"
import { PatientSnapshot } from "@/components/patient-overview/patient-snapshot"
import { Timeline } from "@/components/patient-overview/timeline"
import { RedirectNotice } from "@/components/redirect-notice"
import { getGetEncountersActionOptions } from "@/features/encounter/encounter.api"
import { getGetLabOrdersActionOptions } from "@/features/lab-order/lab-order.api"
import { getGetPatientDetailActionOptions } from "@/features/patient/patient.api"

export default async function PatientOverview({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  const queryClient = getQueryClient()

  const patient = await queryClient.fetchQuery(getGetPatientDetailActionOptions({ patientId }))
  const encountersData = await queryClient.fetchQuery(
    getGetEncountersActionOptions({
      type: ["ER", "IPD", "OPD"],
      search: "",
      status: ["ACTIVE", "COMPLETED"],
      unitId: "",
      trashed: false,
      patientId,
    })
  )
  const activeEncounter = encountersData.items.find(({ status }) => status === "ACTIVE")
  const labOrdersInActiveEncounter = activeEncounter
    ? await queryClient.fetchQuery(
        getGetLabOrdersActionOptions({
          search: "",
          status: ["SUBMITTED", "RESULTED", "PARTIALLY_RESULTED"],
          priority: ["STAT", "ROUTINE"],
          patientId,
          encounterId: activeEncounter.id,
        })
      )
    : undefined

  if (!patient) {
    return <></>
  }

  return (
    <>
      <Suspense fallback={null}>
        <RedirectNotice />
      </Suspense>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <PatientSnapshot
          patient={patient}
          encountersCount={encountersData.totalCount}
          lastEncounterDateTime={encountersData.items.at(0)?.dateTime}
        />
        <ActiveEncounter patientId={patientId} activeEncounter={activeEncounter} />
        <LabOrders
          labOrders={labOrdersInActiveEncounter?.items ?? []}
          patientId={patientId}
          canAddNewOrder={!!activeEncounter}
        />
        <Timeline />
      </div>
    </>
  )
}
