import { Check, Clock } from "lucide-react"
import React from "react"
import { LabOrderDetail, LabOrderItem } from "@/features/lab-order/lab-order.type"
import ItemResultDialog from "./item-result-dialog"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

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
          <Check data-icon="inline-start" />
          Cancelled
        </Badge>
      )
  }
}

export default function RequestedTestsCard({ labOrder }: { labOrder: LabOrderDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Requested Tests</CardTitle>
        <CardDescription>Ordered laboratory examinations included in this request.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px]">Test</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labOrder.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.snapshotName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Badge variant="outline">{item.snapshotCategory}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">{getItemStatusBadge(item.status)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <ItemResultDialog
                        orderItem={item}
                        resultItems={
                          labOrder.resultReports
                            .at(0)
                            ?.resultItems.filter(({ labOrderItemId }) => labOrderItemId === item.id) ?? []
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
