import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getQueryClient } from "@/app/get-query-client"
import { CreateEncounterForm } from "@/components/create-encounter/create-encounter-form"
import PatientSummary from "@/components/create-encounter/patient-summary"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import {
  getGetActiveEncounterActionOptions,
  getGetEncounterProvidersActionOptions,
  getGetEncounterUnitsActionOptions,
  getGetPatientDetailActionOptions,
} from "@/features/patient-context/api/query"

export default async function CreateEncounter({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  const queryClient = getQueryClient()

  const patient = await queryClient.fetchQuery(getGetPatientDetailActionOptions({ patientId }))

  if (!patient) {
    notFound()
  }

  const encounter = await queryClient.fetchQuery(getGetActiveEncounterActionOptions({ patientId }))

  if (encounter) {
    redirect(`/auth/patients/${patientId}/encounters/${encounter.id}?notice=existing-encounter`)
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
                <h1 className="text-2xl font-semibold tracking-tight">Create Encounter</h1>
                <p className="text-muted-foreground text-sm">Create a new encounter for the selected patient.</p>
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
        <CreateEncounterForm patientId={patientId} />
      </div>
    </HydrationBoundary>
  )
}
