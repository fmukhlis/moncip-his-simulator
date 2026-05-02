import { format } from "date-fns"
import { LabOrderDetail } from "@/features/lab-order/lab-order.type"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export default function OrderOverviewCard({ labOrder }: { labOrder: LabOrderDetail }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{labOrder.status}</Badge>
              <Badge variant="outline">{labOrder.priority}</Badge>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">Lab Order #{labOrder.no}</CardTitle>
              <CardDescription>
                Review order details, requested tests, specimen information, and progress.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" type="button" disabled>
              Print Label
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="border p-3">
            <dt className="text-muted-foreground">Ordered At</dt>
            <dd className="mt-1 font-medium">{format(labOrder.orderedAt, "dd MMM yyyy, HH.mm")}</dd>
          </div>
          <div className="border p-3">
            <dt className="text-muted-foreground">Encounter</dt>
            <dd className="mt-1 font-medium">
              {labOrder.encounter.type} · {labOrder.encounter.unit.name}
            </dd>
          </div>
          <div className="border p-3">
            <dt className="text-muted-foreground">Ordering Provider</dt>
            <dd className="mt-1 font-medium">{labOrder.orderingProvider.name}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
