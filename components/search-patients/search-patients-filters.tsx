"use client"

import { format, parse } from "date-fns"
import { X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export default function SearchPatientsFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const birthDateString = searchParams.get("birthDate")

  const [filters, setFilters] = useState(() => ({
    page: searchParams.get("page") ?? "1",
    fullName: searchParams.get("fullName") ?? "",
    birthDate: birthDateString ? parse(birthDateString, "yyyy-MM-dd", new Date()) : undefined,
    mrnNumber: searchParams.get("mrnNumber") ?? "",
    nationalId: searchParams.get("nationalId") ?? "",
  }))

  const [birthDateCalendarOpen, setBirthDateCalendarOpen] = useState(false)

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
          params.append(key, value)
        }
      }
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const debounced = useDebouncedCallback((value: Partial<Omit<typeof filters, "birthDate" | "page">>) => {
    updateUrl({ ...value })
  }, 1000)

  return (
    <FieldGroup className="gap-3">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
        <Field className="gap-2">
          <FieldLabel htmlFor="search-patients-national-id">National ID (NIK)</FieldLabel>
          <div className="flex flex-col gap-2">
            <Input
              id="search-patients-national-id"
              value={filters.nationalId}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, nationalId: e.target.value }))
                debounced({ nationalId: e.target.value })
              }}
              placeholder="16 digit national ID"
            />
          </div>
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="search-patients-mrn">Medical Record Number</FieldLabel>
          <div className="flex flex-col gap-2">
            <Input
              id="search-patients-mrn"
              value={filters.mrnNumber}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, mrnNumber: e.target.value }))
                debounced({ mrnNumber: e.target.value })
              }}
              placeholder="Please only use numbers"
            />
          </div>
        </Field>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] items-end gap-3">
        <Field className="gap-2">
          <FieldLabel htmlFor="search-patients-full-name">Full Name</FieldLabel>
          <Input
            id="search-patients-full-name"
            value={filters.fullName}
            required
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, fullName: e.target.value }))
              debounced({ fullName: e.target.value })
            }}
            placeholder="Enter patient's full name"
          />
        </Field>
        <div className="flex items-end gap-3">
          <Field className="gap-2">
            <FieldLabel htmlFor="search-patients-birth-date">Birth Date</FieldLabel>
            <Popover open={birthDateCalendarOpen} onOpenChange={setBirthDateCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="search-patients-birth-date" className="justify-start font-normal">
                  {filters.birthDate instanceof Date ? format(filters.birthDate, "dd MMMM yyyy") : "Select date..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0">
                <Calendar
                  mode="single"
                  selected={filters.birthDate instanceof Date ? filters.birthDate : undefined}
                  defaultMonth={filters.birthDate instanceof Date ? filters.birthDate : undefined}
                  captionLayout="dropdown"
                  onSelect={(birthDate) => {
                    setFilters((prev) => ({ ...prev, birthDate }))
                    debounced.cancel()
                    updateUrl({
                      birthDate: birthDate ? format(birthDate, "yyyy-MM-dd") : "",
                    })
                    setBirthDateCalendarOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Button
            onClick={() => {
              setFilters({
                page: "1",
                fullName: "",
                birthDate: undefined,
                mrnNumber: "",
                nationalId: "",
              })
              debounced.cancel()
              updateUrl({
                page: "1",
                fullName: "",
                birthDate: null,
                mrnNumber: "",
                nationalId: "",
              })
            }}
          >
            <X />
            <div>Clear filters</div>
          </Button>
        </div>
      </div>
    </FieldGroup>
  )
}
