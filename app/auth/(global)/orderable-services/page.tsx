import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/app/get-query-client"
import { columns } from "@/components/orderable-services/columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientTable } from "@/components/ui/client-table"
import { getGetOrderableServicesActionOptions } from "@/features/orderable-service/orderable-service.api"

export default async function OrderableServiceList() {
  const queryClient = getQueryClient()

  const orderableServices = await queryClient.fetchQuery(
    getGetOrderableServicesActionOptions({ type: ["PANEL", "SINGLE"], search: "", categories: [], trashed: true })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="relative flex flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader className="px-4">
            <CardTitle>
              <h1>Orderable Services</h1>
            </CardTitle>
            <CardDescription>Clinical service catalog used by HIS mini for LIS demo.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="relative w-full py-4 shadow">
          <CardContent className="flex flex-col gap-4 px-4">
            <ClientTable tableOptions={{ data: orderableServices?.items ?? [], columns }} />
          </CardContent>
        </Card>
      </div>
    </HydrationBoundary>
  )
}
