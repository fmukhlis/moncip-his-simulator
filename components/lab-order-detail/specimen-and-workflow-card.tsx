import { format } from "date-fns"
import { Check } from "lucide-react"
import React from "react"
import { LabOrderDetail } from "@/features/lab-order/lab-order.type"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Spinner } from "../ui/spinner"

export default function SpecimenAndWorkflowCard({ labOrder }: { labOrder: LabOrderDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Specimen & Workflow Progress</CardTitle>
        <CardDescription>Track the order lifecycle from placement to result verification.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex w-8 flex-col items-center">
              <Check className="size-4" />
              <div className="bg-border mt-2 w-px flex-1" />
            </div>
            <div className="flex-1 border px-3 py-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium">Order Submitted</p>
                <p className="text-muted-foreground">{format(labOrder.orderedAt, "dd MMM yyyy, HH.mm")}</p>
              </div>
              <p className="text-muted-foreground mt-1">
                Order created by laboratory staff with encounter and patient context confirmed.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex w-8 flex-col items-center">
              <Spinner />
              <div className="bg-border mt-2 w-px flex-1" />
            </div>
            <div className="flex-1 border px-3 py-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium">Testing In Progress</p>
                <p className="text-muted-foreground">17 Apr 2026, 09:21</p>
              </div>
              <p className="text-muted-foreground mt-1">
                One or more requested tests are currently being processed by the laboratory.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex w-8 flex-col items-center">
              <div className="bg-muted h-4 w-3 rounded-full" />
              <div className="bg-border mt-2 h-full w-px" />
            </div>
            <div className="flex-1 border px-3 py-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium">Result Verification</p>
                <p className="text-muted-foreground">Pending</p>
              </div>
              <p className="text-muted-foreground mt-1">
                Blood and urine specimens Results will appear here once review and verification are completed. at
                Phlebotomy Room by assigned collector.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
