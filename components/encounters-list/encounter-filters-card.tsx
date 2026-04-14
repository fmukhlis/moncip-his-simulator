"use client"

import { Button } from "../ui/button"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useDebouncedCallback } from "use-debounce"
import { Clock3, RotateCcw, Search } from "lucide-react"
import { EncounterStatus, EncounterType } from "@/generated/prisma/enums"
import { getGetEncounterUnitsActionOptions } from "@/features/patient-context/api/query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
]

const TYPE_OPTIONS = [
  { value: "ER", label: "Emergency" },
  { value: "IPD", label: "Inpatient" },
  { value: "OPD", label: "Outpatient" },
]

export default function EncounterFiltersCard({
  filters,
}: {
  filters: {
    q: string
    type: string
    status: string
    unitId: string
  }
}) {
  const [type, setType] = useState(filters.type)
  const [unit, setUnit] = useState(filters.unitId)
  const [status, setStatus] = useState(filters.status)
  const [searchValue, setSearchValue] = useState(filters.q)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateUrl(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())

    for (const [key, value] of Object.entries(next)) {
      if (!value) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const { data: units } = useQuery(getGetEncounterUnitsActionOptions())

  const handleReset = () => {
    setUnit("")
    setType("ALL")
    setStatus("ALL")
    setSearchValue("")

    router.replace(`${pathname}`)
  }

  const debounced = useDebouncedCallback((value) => {
    updateUrl({ q: value })
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
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              debounced(e.target.value)
            }}
            placeholder="Search by encounter number, unit, or provider..."
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
            <Select
              value={status === "ALL" ? "" : status}
              onValueChange={(value: EncounterStatus | "ALL") => {
                setStatus(value)
                updateUrl({ status: value })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status..." />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-foreground mb-2 text-sm font-medium">Type</p>
            <Select
              value={type === "ALL" ? "" : type}
              onValueChange={(value: EncounterType | "ALL") => {
                setType(value)
                updateUrl({ type: value })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type..." />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                {units?.map((unit) => (
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
