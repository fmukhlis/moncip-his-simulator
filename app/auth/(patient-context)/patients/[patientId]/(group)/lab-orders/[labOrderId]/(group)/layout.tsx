import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/app/get-query-client"

export default async function PatientEncounterLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
}
