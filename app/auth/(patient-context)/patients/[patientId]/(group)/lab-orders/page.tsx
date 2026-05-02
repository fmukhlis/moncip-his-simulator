import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Activity, ArrowRight, ClipboardList, Plus, Stethoscope } from "lucide-react"
import Link from "next/link"
import { getQueryClient } from "@/app/get-query-client"
import LabOrderFiltersCard from "@/components/lab-orders/lab-order-filters-card"
import { LabOrderTableCard } from "@/components/lab-orders/lab-order-table-card"
import PatientSummaryCard from "@/components/lab-orders/patient-summary-card"
import SummaryCard from "@/components/lab-orders/summary-card"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { getGetLabOrdersActionOptions } from "@/features/lab-order/lab-order.api"
import { getGetPatientDetailActionOptions } from "@/features/patient/patient.api"
import { LabOrdersStoreProvider } from "@/providers/lab-orders-store-provider"
import { defaultInitState } from "@/stores/lab-orders-store"

export default async function PatientLabOrdersPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  const defaultFilters = defaultInitState.filters

  const queryClient = getQueryClient()

  const patient = await queryClient.fetchQuery(getGetPatientDetailActionOptions({ patientId }))
  const labOrders = await queryClient.fetchQuery(
    getGetLabOrdersActionOptions({ ...defaultFilters, encounterId: "", patientId })
  )

  const totalItems = labOrders.items.reduce((sum, item) => sum + item._count.items, 0)
  const totalOrders = labOrders.totalCount
  const urgentOrders = labOrders.items.filter((item) => item.priority === "STAT").length
  const cancelledOrders = labOrders.items.filter((item) => item.status === "CANCELLED").length

  if (!patient) {
    return <></>
  }

  return (
    <LabOrdersStoreProvider patientId={patientId}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="relative flex flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight">Lab. Orders</h1>
                  <p className="text-muted-foreground text-sm">
                    Review the selected patient's laboratory orders in a concise, clear view.
                  </p>
                </div>
                <Button asChild type="button" variant="outline">
                  <Link href={`/auth/patients/${patientId}/lab-orders/new`}>
                    <Plus /> Create Lab Order
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
          <section className="grid gap-4 lg:grid-cols-12">
            <PatientSummaryCard patient={patient} />
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
              <SummaryCard
                icon={<ClipboardList className="size-4" />}
                title="Total Orders"
                value={String(totalOrders)}
                description="All orders in the list"
              />
              <SummaryCard
                icon={<Activity className="size-4" />}
                title="Cancelled Orders"
                value={String(cancelledOrders)}
                description="Number of cancelled lab orders"
              />
              <SummaryCard
                icon={<ArrowRight className="size-4" />}
                title="Urgent Priority"
                value={String(urgentOrders)}
                description="Orders marked as urgent or stat"
              />
              <SummaryCard
                icon={<Stethoscope className="size-4" />}
                title="Total Items"
                value={String(totalItems)}
                description="Total order items"
              />
            </div>
          </section>
          <section>
            <LabOrderFiltersCard defaultFilters={defaultFilters} />
          </section>
          <section>
            <LabOrderTableCard labOrders={labOrders.items ?? []} />
          </section>
        </div>
      </HydrationBoundary>
    </LabOrdersStoreProvider>
  )
}
