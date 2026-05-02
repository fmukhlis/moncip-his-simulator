import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getQueryClient } from "@/app/get-query-client"
import { NewLabOrderForm } from "@/components/new-lab-order/new-lab-order-form"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { getGetEncounterDetailActionOptions } from "@/features/encounter/encounter.api"
import { getGetPatientDetailActionOptions } from "@/features/patient/patient.api"
import { getGetProvidersActionOptions } from "@/features/provider/provider.api"

export default async function NewLabOrder({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  const queryClient = getQueryClient()

  const patient = await queryClient.fetchQuery(getGetPatientDetailActionOptions({ patientId }))

  if (!patient) {
    redirect(`/auth/search-patients`)
  }

  const activeEncounter = await queryClient.fetchQuery(
    getGetEncounterDetailActionOptions({ patientId, status: ["ACTIVE"] })
  )

  if (!activeEncounter) {
    redirect(`/auth/patients/${patientId}/overview?notice=no-active-encounter`)
  }

  await queryClient.prefetchQuery(getGetProvidersActionOptions({ search: "", status: "ALL" }))

  return (
    <div className="relative flex flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">New Lab. Order</h1>
              <p className="text-muted-foreground text-sm">Enter laboratory order details for the selected patient. </p>
            </div>
            <Button asChild type="button" variant="outline">
              <Link href={`/auth/patients/${patientId}/lab-orders`}>
                <ArrowLeft />
                Back to Lab. Orders
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NewLabOrderForm patient={patient} encounter={activeEncounter} />
      </HydrationBoundary>
    </div>
  )
}
