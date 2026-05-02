"use client"

import { useQuery } from "@tanstack/react-query"
import { Ban, CircleCheckBig, Clock3, House, Loader, LogOut, RotateCcw, Search, Siren } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { getGetUnitsActionOptions } from "@/features/unit/unit.api"
import { EncounterStatus, EncounterType } from "@/generated/prisma/enums"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active", icon: <Loader /> },
  { value: "COMPLETED", label: "Completed", icon: <CircleCheckBig /> },
  { value: "CANCELLED", label: "Cancelled", icon: <Ban /> },
]

const TYPE_OPTIONS = [
  { value: "ER", label: "Emergency", icon: <Siren /> },
  { value: "IPD", label: "Inpatient", icon: <House /> },
  { value: "OPD", label: "Outpatient", icon: <LogOut /> },
]

export default function EncounterFiltersCard({
  filters,
}: {
  filters: {
    type: EncounterType[]
    search: string
    status: EncounterStatus[]
    unitId: string
    patientId: string
  }
}) {
  const [type, setType] = useState(filters.type)
  const [unit, setUnit] = useState(filters.unitId)
  const [status, setStatus] = useState(filters.status)
  const [search, setSearch] = useState(filters.search)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateUrl(next: Record<string, string | string[] | null>) {
    const params = new URLSearchParams(searchParams.toString())

    for (const [key, value] of Object.entries(next)) {
      params.delete(key)

      if (Array.isArray(value)) {
        for (const v of value) {
          params.append(key, v)
        }
      } else {
        if (value) {
          params.set(key, value)
        }
      }
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const { data: unitsData } = useQuery(getGetUnitsActionOptions({ search: "", status: "ALL" }))

  const handleReset = () => {
    setUnit("")
    setType(["ER", "IPD", "OPD"])
    setStatus(["ACTIVE", "COMPLETED", "CANCELLED"])
    setSearch("")

    router.replace(`${pathname}`)
  }

  const debounced = useDebouncedCallback((value) => {
    updateUrl({ search: value })
  }, 1000)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filters</CardTitle>
        <CardDescription>Search encounters and narrow the list by status, type, or unit.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputGroup>
          <InputGroupInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              debounced(e.target.value)
            }}
            placeholder="Search by encounter no or provider..."
          />
          <InputGroupAddon>
            <Search className="text-muted-foreground" />
          </InputGroupAddon>
          {debounced.isPending() && (
            <InputGroupAddon align="inline-end">
              <Clock3 />
            </InputGroupAddon>
          )}
        </InputGroup>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-foreground mb-2 text-sm font-medium">Status</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full justify-start">
                <Button variant="outline">Select statuses...</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="border-b py-2.5">Encounter Statuses</DropdownMenuLabel>
                  {STATUS_OPTIONS.map(({ icon, label, value }) => (
                    <DropdownMenuCheckboxItem
                      key={value}
                      checked={status.includes(value)}
                      onCheckedChange={(checked) => {
                        const selectedStatuses = (
                          checked ? Array.from(new Set([...status, value])) : status.filter((s) => s !== value)
                        ) as EncounterStatus[]

                        if (selectedStatuses.length === 0) {
                          selectedStatuses.push("ACTIVE", "CANCELLED", "COMPLETED")
                        }

                        setStatus(selectedStatuses)
                        updateUrl({
                          status: selectedStatuses,
                        })
                      }}
                    >
                      {icon}
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <p className="text-foreground mb-2 text-sm font-medium">Type</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full justify-start">
                <Button variant="outline">Select types...</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="border-b py-2.5">Encounter Types</DropdownMenuLabel>
                  {TYPE_OPTIONS.map(({ icon, label, value }) => (
                    <DropdownMenuCheckboxItem
                      key={value}
                      checked={type.includes(value)}
                      onCheckedChange={(checked) => {
                        const selectedTypes = (
                          checked ? Array.from(new Set([...type, value])) : type.filter((s) => s !== value)
                        ) as EncounterType[]

                        if (selectedTypes.length === 0) {
                          selectedTypes.push("ER", "IPD", "OPD")
                        }

                        setType(selectedTypes)
                        updateUrl({
                          type: selectedTypes,
                        })
                      }}
                    >
                      {icon}
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <p className="text-foreground mb-2 text-sm font-medium">Unit</p>
            <Select
              value={unit}
              onValueChange={(value: string) => {
                setUnit(value)
                updateUrl({ unitId: value })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Unit..." />
              </SelectTrigger>
              <SelectContent>
                {unitsData?.items.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end justify-end">
            <Button variant="outline" className="w-full gap-2 lg:w-auto" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
