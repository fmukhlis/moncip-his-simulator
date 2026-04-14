import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import EncounterCareContextCard from "@/components/encounter-detail/encounter-care-context-card"
import EncounterClinicalContextCard from "@/components/encounter-detail/encounter-clinical-context-card"
import EncounterDetailHeader from "@/components/encounter-detail/encounter-detail-header"
import EncounterLabOrdersCard from "@/components/encounter-detail/encounter-lab-orders-card"
import EncounterMetadataCard from "@/components/encounter-detail/encounter-metadata-card"

import { RedirectNotice } from "@/components/redirect-notice"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"

export default async function EncounterDetail({
  params,
}: {
  params: Promise<{ encounterId: string; patientId: string }>
}) {
  const { encounterId, patientId } = await params

  return (
    <>
      <Suspense fallback={null}>
        <RedirectNotice />
      </Suspense>
      <div className="relative flex flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">Encounter Detail</h1>
                <p className="text-muted-foreground text-sm">
                  Review the selected encounter within the current patient context.
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
        <EncounterDetailHeader patientId={patientId} encounterId={encounterId} />
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <EncounterCareContextCard encounterId={encounterId} patientId={patientId} />
            <EncounterLabOrdersCard />
          </div>
          <div className="space-y-4 lg:col-span-4">
            <EncounterClinicalContextCard patientId={patientId} encounterId={encounterId} />
            <EncounterMetadataCard patientId={patientId} encounterId={encounterId} />
          </div>
        </div>
      </div>
    </>
  )
}
