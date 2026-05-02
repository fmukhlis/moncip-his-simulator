"use client"

import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Controller, useFormContext } from "react-hook-form"
import z from "zod"
import { EncounterDetail } from "@/features/encounter/encounter.type"
import { CreateLabOrderActionSchema } from "@/features/lab-order/lab-order.validation"
import { getGetProvidersActionOptions } from "@/features/provider/provider.api"
import { getGetUnitsActionOptions } from "@/features/unit/unit.api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"
import { Textarea } from "../ui/textarea"

export default function OrderInformationCard({ encounter }: { encounter: EncounterDetail }) {
  const { data: unitsData } = useQuery(getGetUnitsActionOptions({ search: "", status: "ALL" }))
  const { data: providersData } = useQuery(getGetProvidersActionOptions({ search: "", status: "ALL" }))

  const { control } = useFormContext<z.infer<typeof CreateLabOrderActionSchema>>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Information</CardTitle>
        <CardDescription>Fill in the basic details of this laboratory order.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="encounter">Encounter</Label>
            <Select defaultValue={encounter.id} disabled>
              <SelectTrigger id="encounter" className="w-full">
                <SelectValue placeholder="Select encounter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={encounter.id}>{`${encounter.type} · ${encounter.unit.name} · ${format(
                  encounter.dateTime,
                  "dd MMM yyyy"
                )}`}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Controller
              name="priority"
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROUTINE">Routine</SelectItem>
                    <SelectItem value="STAT">STAT</SelectItem>
                  </SelectContent>
                </Select>
              )}
              control={control}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ordering-provider">Ordering Provider</Label>
            <Controller
              name="orderingProviderId"
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger id="ordering-provider" className="w-full">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providersData?.items.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              control={control}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Controller
              name="unitId"
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger id="unit" className="w-full">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitsData?.items.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              control={control}
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="clinical-note">Clinical Notes</Label>
            <Controller
              name="clinicalNote"
              render={({ field: { value, onChange } }) => (
                <Textarea
                  id="clinical-note"
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                  className="min-h-28 resize-y"
                  placeholder="Add relevant clinical context, symptoms, current treatment, or special instructions..."
                />
              )}
              control={control}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
