import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/app/get-query-client"
import OrderableServicesTable from "@/components/orderable-services/orderable-services-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getGetOrderableServicesActionOptions } from "@/features/orderable-service/apis/query"

export default async function OrderableServiceList() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(getGetOrderableServicesActionOptions())

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
          <CardContent className="px-4">
            <OrderableServicesTable />
          </CardContent>
        </Card>
      </div>
    </HydrationBoundary>
  )
}
