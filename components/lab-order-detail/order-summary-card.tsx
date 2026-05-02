import { LabOrderDetail } from "@/features/lab-order/lab-order.type"
import { formatCurrencyFromDecimalString } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

export default function OrderSummaryCard({ labOrder }: { labOrder: LabOrderDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Quick overview of the current lab order.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center border p-4">
            <p className="text-muted-foreground">Selected Tests</p>
            <p className="mt-1 text-xl font-semibold">3</p>
          </div>
          <div className="flex flex-col items-center border p-3">
            <p className="text-muted-foreground">Total Price</p>
            <p className="mt-1 text-lg font-semibold">{formatCurrencyFromDecimalString("70000")}</p>
          </div>
        </div>
        <div className="border p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium">Priority</span>
            <Badge>{labOrder.priority}</Badge>
          </div>
          <Separator className="my-3" />
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">{labOrder.unitNameSnapshot}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-medium">{labOrder.orderingProvider.name}</span>
            </div>
          </div>
        </div>
        <div className="border border-dashed p-3">
          <p className="font-medium">Current Status</p>
          <p className="text-muted-foreground mt-1">
            Specimens have been collected and at least one test has entered processing. Final verification is still
            pending.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
