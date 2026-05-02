"use client"

import { useQuery } from "@tanstack/react-query"
import { ClipboardList, X } from "lucide-react"
import React from "react"
import { useFormContext, useWatch } from "react-hook-form"
import z from "zod"
import { CreateLabOrderActionSchema } from "@/features/lab-order/lab-order.validation"
import { getGetOrderableServicesActionOptions } from "@/features/orderable-service/orderable-service.api"
import { formatCurrencyFromDecimalString } from "@/lib/utils"
import { AddTestDialog } from "./add-test-dialog"
import { SelectPanelDialog } from "./select-panel-dialog"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

export default function RequestedTestsCard() {
  const { data: orderableServicesData } = useQuery(
    getGetOrderableServicesActionOptions({ type: ["PANEL", "SINGLE"], search: "", categories: [], trashed: false })
  )

  const map = new Map(orderableServicesData?.items.map((item) => [item.id, item]) ?? [])

  const { control, setValue } = useFormContext<z.infer<typeof CreateLabOrderActionSchema>>()

  const orderableServiceIds = useWatch({ name: "orderableServiceIds", control })

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Requested Tests</CardTitle>
          <CardDescription>Review and manage selected laboratory examinations.</CardDescription>
        </div>
        <AddTestDialog />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden border">
          {orderableServiceIds.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    style={{
                      width: 999,
                      flex: 1,
                    }}
                  >
                    <div>Name</div>
                  </TableHead>
                  <TableHead className="w-[75] text-center">
                    <div>Type</div>
                  </TableHead>
                  <TableHead
                    style={{
                      width: 999,
                      flex: 1,
                    }}
                  >
                    <div>Price</div>
                  </TableHead>
                  <TableHead className="w-[100px] text-center">
                    <div>Action</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderableServiceIds?.map((id) => (
                  <TableRow key={id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{map.get(id)?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Badge variant={map.get(id)?.type === "PANEL" ? "secondary" : "outline"}>
                          {map.get(id)?.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrencyFromDecimalString(map.get(id)?.price ?? "")}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="xs"
                        onClick={() => {
                          setValue(
                            "orderableServiceIds",
                            orderableServiceIds.filter((item) => item !== id),
                            {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            }
                          )
                        }}
                      >
                        <X />
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center border px-5 py-[26px] text-center">
              <div className="bg-muted text-muted-foreground mb-2 flex size-9 items-center justify-center border">
                <ClipboardList className="size-5" />
              </div>
              <h3 className="text-base font-semibold">No selected items</h3>
              <p className="text-muted-foreground mt-1 max-w-md leading-6">
                There are no selected items yet. Start by adding a test or panel.
              </p>
            </div>
          )}
        </div>
        <div className="border border-dashed px-4 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="font-medium">Need more tests?</p>
              <p className="text-muted-foreground">Add from preconfigured panels.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <SelectPanelDialog />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
