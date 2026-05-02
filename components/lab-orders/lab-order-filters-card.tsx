"use client"

import { RotateCcw, Search } from "lucide-react"
import { LabOrderPriority, LabOrderStatus } from "@/generated/prisma/enums"
import { useLabOrdersStore } from "@/providers/lab-orders-store-provider"
import { defaultInitState } from "@/stores/lab-orders-store"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"

const STATUS_OPTIONS = [
  { value: "SUBMITTED", label: "Submitted", icon: <></> },
  { value: "PARTIALLY_RESULTED", label: "Partially Resulted", icon: <></> },
  { value: "RESULTED", label: "Resulted", icon: <></> },
  { value: "CANCELLED", label: "Cancelled", icon: <></> },
]

const PIRORITY_OPTIONS = [
  { value: "STAT", label: "Stat", icon: <></> },
  { value: "ROUTINE", label: "Routine", icon: <></> },
]

export default function LabOrderFiltersCard({
  defaultFilters,
}: {
  defaultFilters: (typeof defaultInitState)["filters"]
}) {
  const { filters, setFilters } = useLabOrdersStore((state) => state)

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 sm:flex-row sm:items-center">
          <InputGroup>
            <InputGroupInput
              value={filters.search}
              onChange={(e) => {
                setFilters({ search: e.target.value })
              }}
              placeholder="Search by order no..."
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(75px,1fr))] gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full justify-start">
                <Button variant="outline">Select statuses...</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="border-b py-2.5">Lab Order Statuses</DropdownMenuLabel>
                  {STATUS_OPTIONS.map(({ icon, label, value }) => (
                    <DropdownMenuCheckboxItem
                      key={value}
                      checked={filters.status.includes(value)}
                      onCheckedChange={(checked) => {
                        const selectedStatuses = (
                          checked
                            ? Array.from(new Set([...filters.status, value]))
                            : filters.status.filter((s) => s !== value)
                        ) as LabOrderStatus[]

                        if (selectedStatuses.length === 0) {
                          selectedStatuses.push("SUBMITTED", "PARTIALLY_RESULTED", "RESULTED", "CANCELLED")
                        }

                        setFilters({ status: selectedStatuses })
                      }}
                    >
                      {icon}
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full justify-start">
                <Button variant="outline">Select Priorities...</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="border-b py-2.5">Lab Order Priorities</DropdownMenuLabel>
                  {PIRORITY_OPTIONS.map(({ icon, label, value }) => (
                    <DropdownMenuCheckboxItem
                      key={value}
                      checked={filters.priority.includes(value)}
                      onCheckedChange={(checked) => {
                        const selectedPriorities = (
                          checked
                            ? Array.from(new Set([...filters.priority, value]))
                            : filters.priority.filter((s) => s !== value)
                        ) as LabOrderPriority[]

                        if (selectedPriorities.length === 0) {
                          selectedPriorities.push("STAT", "ROUTINE")
                        }

                        setFilters({ priority: selectedPriorities })
                      }}
                    >
                      {icon}
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              onClick={() => {
                setFilters(defaultFilters)
              }}
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
