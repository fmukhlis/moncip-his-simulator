import { Plus, View } from "lucide-react"
import Link from "next/link"
import { LabOrder } from "@/features/lab-order/lab-order.type"
import { LabOrderPriority, LabOrderStatus } from "@/generated/prisma/enums"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import ClientDateTimeText from "../ui/client-date-time-text"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

function getOrderStatusBadge(status: LabOrderStatus) {
  if (status === "SUBMITTED")
    return (
      <Badge variant="outline" className="bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
        {status}
      </Badge>
    )
  if (status === "PARTIALLY_RESULTED")
    return (
      <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
        {status}
      </Badge>
    )
  if (status === "RESULTED")
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        {status}
      </Badge>
    )
  if (status === "CANCELLED")
    return (
      <Badge variant="outline" className="bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
        {status}
      </Badge>
    )
}

function getOrderPriorityBadge(status: LabOrderPriority) {
  if (status === "ROUTINE") return <Badge variant="outline">{status}</Badge>
  if (status === "STAT")
    return (
      <Badge variant="outline" className="bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
        {status}
      </Badge>
    )
}

export default function EncounterLabOrdersCard({ labOrders, patientId }: { labOrders: LabOrder[]; patientId: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle>Orders</CardTitle>
            <CardDescription> View orders associated with the current encounter.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" asChild>
              <Link href={`/auth/patients/${patientId}/lab-orders/new`}>
                <Plus />
                New Order
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      {labOrders.length ? (
        <CardContent>
          <div className="border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Ordering Provider</TableHead>
                  <TableHead>Ordered At</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labOrders.map((labOrder) => (
                  <TableRow key={labOrder.id}>
                    <TableCell>
                      <div className="font-medium">{labOrder.no}</div>
                    </TableCell>
                    <TableCell>
                      <div>{labOrder.unitNameSnapshot}</div>
                    </TableCell>
                    <TableCell className="text-center">{getOrderStatusBadge(labOrder.status)}</TableCell>
                    <TableCell>{labOrder.orderingProvider.name}</TableCell>
                    <TableCell>
                      <ClientDateTimeText formatStr="dd MMM yyyy, HH:mm" dateTime={labOrder.orderedAt} />
                    </TableCell>
                    <TableCell className="text-center">{getOrderPriorityBadge(labOrder.priority)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/auth/patients/${patientId}/lab-orders/${labOrder.id}`}>
                          <View className="size-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-start gap-1">
              <p className="flex gap-2 font-semibold">
                <span>No lab orders for this encounter</span>
              </p>
              <p className="flex items-center gap-1">
                <span>Order labs to track diagnostics and results for this visit.</span>
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
