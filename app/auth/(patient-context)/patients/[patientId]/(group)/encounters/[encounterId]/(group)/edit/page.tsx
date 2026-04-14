import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getQueryClient } from "@/app/get-query-client"
import { EditEncounterForm } from "@/components/edit-encounter/edit-encounter-form"
import PatientSummary from "@/components/edit-encounter/patient-summary"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import {
  getCachedGetEncounterDetailActionOptions,
  getGetEncounterProvidersActionOptions,
  getGetEncounterUnitsActionOptions,
} from "@/features/patient-context/api/query"

export default async function EditEncounter({
  params,
}: {
  params: Promise<{ patientId: string; encounterId: string }>
}) {
  const { patientId, encounterId } = await params

  const queryClient = getQueryClient()

  const encounter = await queryClient.fetchQuery(getCachedGetEncounterDetailActionOptions({ encounterId, patientId }))

  if (encounter && encounter.status !== "ACTIVE") {
    redirect(`/auth/patients/${patientId}/encounters/${encounterId}`)
  }

  await queryClient.fetchQuery(getGetEncounterUnitsActionOptions())
  await queryClient.fetchQuery(getGetEncounterProvidersActionOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="relative flex flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">Edit Encounter</h1>
                <p className="text-muted-foreground text-sm">
                  Update the selected encounter within the current patient context.
                </p>
              </div>
              <Button asChild type="button" variant="outline">
                <Link href={`/auth/patients/${patientId}/encounters`}>
                  <ArrowLeft />
                  Back to Encounters
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
        <PatientSummary patientId={patientId} />
        <EditEncounterForm patientId={patientId} encounterId={encounterId} />
      </div>
    </HydrationBoundary>
  )
}
