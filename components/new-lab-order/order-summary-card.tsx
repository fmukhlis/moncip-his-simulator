"use client"

import { useQuery } from "@tanstack/react-query"
import { useFormContext, useWatch } from "react-hook-form"
import z from "zod"
import { CreateLabOrderActionSchema } from "@/features/lab-order/lab-order.validation"
import { getGetOrderableServicesActionOptions } from "@/features/orderable-service/orderable-service.api"
import { getGetProvidersActionOptions } from "@/features/provider/provider.api"
import { getGetUnitsActionOptions } from "@/features/unit/unit.api"
import { formatCurrencyFromDecimalString } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

export default function OrderSummaryCard() {
  const { data: orderableServicesData } = useQuery(
    getGetOrderableServicesActionOptions({ type: ["PANEL", "SINGLE"], search: "", categories: [], trashed: false })
  )
  const { data: unitsData } = useQuery(getGetUnitsActionOptions({ search: "", status: "ALL" }))
  const { data: providersData } = useQuery(getGetProvidersActionOptions({ search: "", status: "ALL" }))

  const { control } = useFormContext<z.infer<typeof CreateLabOrderActionSchema>>()

  const unitId = useWatch({ name: "unitId", control })

  const orderableServiceIds = useWatch({ name: "orderableServiceIds", control })
  const orderingProviderId = useWatch({ name: "orderingProviderId", control })
  const priority = useWatch({ name: "priority", control })

  const totalPrice = `${
    orderableServicesData?.items.reduce((total, { id, price }) => {
      if (orderableServiceIds.includes(id)) {
        return total + Number(price)
      }
      return total
    }, 0) ?? ""
  }`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Quick overview of the current lab order.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center border p-3">
            <p className="text-muted-foreground">Selected Items</p>
            <p className="mt-1 text-lg font-semibold">{orderableServiceIds.length}</p>
          </div>
          <div className="flex flex-col items-center border p-3">
            <p className="text-muted-foreground">Total Price</p>
            <p className="mt-1 text-lg font-semibold">{formatCurrencyFromDecimalString(totalPrice)}</p>
          </div>
        </div>
        <div className="border p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium">Priority</span>
            <Badge>{priority}</Badge>
          </div>
          <Separator className="my-3" />
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">
                {unitsData?.items.find((u) => u.id === unitId)?.name ?? "No selected location"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-medium">
                {providersData?.items.find((p) => p.id === orderingProviderId)?.name ?? "No selected provider"}
              </span>
            </div>
          </div>
        </div>
        <div className="border border-dashed p-3">
          <p className="font-medium">Submission Checklist</p>
          <ul className="text-muted-foreground mt-3 space-y-1">
            <li>• Patient context confirmed</li>
            <li>• Encounter selected</li>
            <li>• Requested tests reviewed</li>
            <li>• Collection instructions added</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
