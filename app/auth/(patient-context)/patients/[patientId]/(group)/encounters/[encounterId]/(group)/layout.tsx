import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { getQueryClient } from "@/app/get-query-client"
import { getCachedGetEncounterDetailActionOptions } from "@/features/patient-context/api/query"

export default async function PatientEncounterLayout({
  params,
  children,
}: {
  params: Promise<{ encounterId: string; patientId: string }>
  children: React.ReactNode
}) {
  const { encounterId, patientId } = await params

  const queryClient = getQueryClient()

  const encounter = await queryClient.fetchQuery(getCachedGetEncounterDetailActionOptions({ encounterId, patientId }))

  if (!encounter) {
    notFound()
  }

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
}
