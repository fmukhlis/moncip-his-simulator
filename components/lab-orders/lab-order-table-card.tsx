"use client"

import { getFilteredRowModel } from "@tanstack/react-table"
import { LabOrder } from "@/features/lab-order/lab-order.type"
import { useLabOrdersStore } from "@/providers/lab-orders-store-provider"
import { columns } from "./columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ClientTable } from "../ui/client-table"

export function LabOrderTableCard({ labOrders }: { labOrders: LabOrder[] }) {
  const { filters, setFilters } = useLabOrdersStore((state) => state)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Lab Order List</CardTitle>
        <CardDescription>Review lab order records and open the one you need.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ClientTable
          tableOptions={{
            data: labOrders,
            state: {
              columnFilters: [
                { id: "no", value: filters.search },
                { id: "status", value: filters.status },
                { id: "priority", value: filters.priority },
              ],
            },
            columns,
            getFilteredRowModel: getFilteredRowModel(),
            onGlobalFilterChange: (updater) => {
              const newFilterValue = updater instanceof Function ? updater(filters) : updater
              setFilters(newFilterValue)
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
