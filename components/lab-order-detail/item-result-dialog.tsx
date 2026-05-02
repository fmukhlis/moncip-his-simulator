"use client"

import { Ban, Check, Clock, TriangleAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LabOrderItem, LabResultItem } from "@/features/lab-order/lab-order.type"

function getItemStatusBadge(status: LabOrderItem["status"]) {
  switch (status) {
    case "ORDERED":
      return (
        <Badge variant="outline" className={`bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300`}>
          <Clock data-icon="inline-start" />
          Ordered
        </Badge>
      )
    case "RESULTED":
      return (
        <Badge variant="outline" className={`bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300`}>
          <Check data-icon="inline-start" />
          Resulted
        </Badge>
      )
    case "CANCELLED":
      return (
        <Badge variant="outline" className={`bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300`}>
          <Ban data-icon="inline-start" />
          Cancelled
        </Badge>
      )
  }
}

export default function ItemResultDialog({
  orderItem,
  resultItems,
}: {
  orderItem: LabOrderItem
  resultItems: LabResultItem[]
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="xs">
          View Result
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-3 sm:max-w-4xl">
        <DialogHeader>
          <div className="mb-1 flex flex-wrap items-center gap-2">{getItemStatusBadge(orderItem.status)}</div>
          <DialogTitle className="text-left">
            {orderItem.snapshotName}
            <span className="text-muted-foreground ml-2 text-sm font-normal">{orderItem.snapshotCode}</span>
          </DialogTitle>
          <DialogDescription className="text-left">
            Review detailed result information for this lab order item.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="border px-3 py-2">
              <p className="text-muted-foreground">Result Received At</p>
              <p>{orderItem.resultReceivedAt ?? "Result not received yet"}</p>
            </div>
          </div>
          {resultItems.length ? (
            <div className="overflow-hidden border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-center">Unit</TableHead>
                    <TableHead>Reference Range</TableHead>
                    <TableHead className="text-center">Flag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultItems.map((resultItem) => (
                    <TableRow key={resultItem.id}>
                      <TableCell className="font-medium">{resultItem.testNameSnapshot}</TableCell>
                      <TableCell>{resultItem.valueType}</TableCell>
                      <TableCell className="text-center">{resultItem.unitSnapshot ?? "-"}</TableCell>
                      <TableCell>{resultItem.referenceRangeSnapshot ?? "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Badge variant={resultItem.abnormalFlag ? "destructive" : "outline"}>
                            {resultItem.abnormalFlag ? (
                              <div className="flex items-center gap-1">
                                <TriangleAlert className="size-3" />
                                {resultItem.abnormalFlag}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">Normal</div>
                            )}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border border-dashed px-3 py-2">
              <p className="font-medium">No result available yet</p>
              <p className="text-muted-foreground mt-2 leading-6">
                This item has not produced a verified result. You can still use this dialog to review the current
                processing status and specimen context.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
