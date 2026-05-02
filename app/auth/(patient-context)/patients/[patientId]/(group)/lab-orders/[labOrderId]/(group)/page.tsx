import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getQueryClient } from "@/app/get-query-client"
import ClinicalInformationCard from "@/components/lab-order-detail/clinical-information-card"
import OrderOverviewCard from "@/components/lab-order-detail/order-overview-card"
import OrderSummaryCard from "@/components/lab-order-detail/order-summary-card"
import PatientSummaryCard from "@/components/lab-order-detail/patient-summary-card"
import RequestedTestsCard from "@/components/lab-order-detail/requested-tests-card"
import SpecimenAndWorkflowCard from "@/components/lab-order-detail/specimen-and-workflow-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getGetLabOrderDetailActionOptions } from "@/features/lab-order/lab-order.api"

export default async function LabOrderDetail({
  params,
}: {
  params: Promise<{ patientId: string; labOrderId: string }>
}) {
  const { patientId, labOrderId } = await params

  const queryClient = getQueryClient()

  const labOrder = await queryClient.fetchQuery(getGetLabOrderDetailActionOptions({ id: labOrderId }))

  if (!labOrder) {
    notFound()
  }

  return (
    <div className="relative flex flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Lab. Order Detail</h1>
              <p className="text-muted-foreground text-sm">
                Review laboratory order information for the selected patient.
              </p>
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
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <OrderOverviewCard labOrder={labOrder} />
          <RequestedTestsCard labOrder={labOrder} />
          <ClinicalInformationCard labOrder={labOrder} />
          <SpecimenAndWorkflowCard labOrder={labOrder} />
        </div>
        <div className="space-y-4">
          <PatientSummaryCard labOrder={labOrder} />
          <OrderSummaryCard labOrder={labOrder} />
          <Card>
            <CardContent className="flex flex-col gap-2">
              <Button type="button" className="w-full">
                Print Report
              </Button>
              <Button type="button" variant="secondary" className="w-full">
                Mark as Reviewed
              </Button>
              <Button type="button" variant="outline" className="w-full" disabled>
                Cancel Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
