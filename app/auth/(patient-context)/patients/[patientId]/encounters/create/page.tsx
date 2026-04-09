import Link from "next/link"
import PatientSummary from "@/components/create-encounter/patient-summary"

import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { getQueryClient } from "@/app/get-query-client"
import { CreateEncounterForm } from "@/components/create-encounter/create-encounter-form"
import { ActiveEncounterExistsError } from "@/lib/custom-errors/active-encounter-exists-error"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getGetCreateEncounterPageDataActionOptions } from "@/features/patient-context/api/query"

export default async function CreateEncounter({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  const queryClient = getQueryClient()

  try {
    await queryClient.fetchQuery(getGetCreateEncounterPageDataActionOptions(patientId))
  } catch (error) {
    if (error instanceof ActiveEncounterExistsError) {
      redirect(`/auth/patients/${patientId}/encounters/${error.encounterId}?notice=existing-encounter`)
    }

    throw error
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="relative flex flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Create Encounter</h1>
            <p className="text-muted-foreground text-sm">Create a new encounter for the selected patient.</p>
          </div>
          <Button asChild type="button" variant="outline">
            <Link href={`/auth/patients/${patientId}/encounters`}>Back to Encounters</Link>
          </Button>
        </div>
        <PatientSummary patientId={patientId} />
        <CreateEncounterForm patientId={patientId} />
      </div>
    </HydrationBoundary>
  )
}
