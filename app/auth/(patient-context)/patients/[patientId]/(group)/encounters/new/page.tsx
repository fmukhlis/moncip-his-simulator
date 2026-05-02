import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getQueryClient } from "@/app/get-query-client"
import { CreateEncounterForm } from "@/components/create-encounter/create-encounter-form"
import PatientSummary from "@/components/create-encounter/patient-summary"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { getGetEncountersActionOptions } from "@/features/encounter/encounter.api"
import { getGetPatientDetailActionOptions } from "@/features/patient/patient.api"
import { getGetProvidersActionOptions } from "@/features/provider/provider.api"
import { getGetUnitsActionOptions } from "@/features/unit/unit.api"

export default async function CreateEncounter({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  const queryClient = getQueryClient()

  const patient = await queryClient.fetchQuery(getGetPatientDetailActionOptions({ patientId }))

  if (!patient) {
    notFound()
  }

  const encountersData = await queryClient.fetchQuery(
    getGetEncountersActionOptions({
      type: ["ER", "IPD", "OPD"],
      search: "",
      status: ["ACTIVE"],
      unitId: "",
      patientId,
      trashed: false,
    })
  )

  const encounterId = encountersData.items.at(0)?.id

  if (encounterId) {
    redirect(`/auth/patients/${patientId}/encounters/${encounterId}?notice=existing-encounter`)
  }

  const unitsData = await queryClient.fetchQuery(getGetUnitsActionOptions({ search: "", status: "ALL" }))
  const providersData = await queryClient.fetchQuery(getGetProvidersActionOptions({ search: "", status: "ALL" }))

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
        <PatientSummary patient={patient} />
        <CreateEncounterForm
          patientId={patientId}
          availableUnits={unitsData.items}
          availableProviders={providersData.items}
        />
      </div>
    </HydrationBoundary>
  )
}
