"use client"

import React from "react"

import { X } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { useSearchPatientsStore } from "@/providers/search-patients-store-provider"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export default function SearchPatientsFilters() {
  const { filters, setFilters } = useSearchPatientsStore((state) => state)

  const [birthDateCalendarOpen, setBirthDateCalendarOpen] = React.useState(false)

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
                setFilters({ nationalId: e.target.value })
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
              value={filters.mrn}
              onChange={(e) => {
                setFilters({ mrn: e.target.value })
              }}
              placeholder="Enter patient's mrn"
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
              setFilters({ fullName: e.target.value })
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
                  {filters.birthDate instanceof Date ? format(filters.birthDate, "d MMMM yyyy") : "Select date..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0">
                <Calendar
                  mode="single"
                  selected={filters.birthDate instanceof Date ? filters.birthDate : undefined}
                  defaultMonth={filters.birthDate instanceof Date ? filters.birthDate : undefined}
                  captionLayout="dropdown"
                  onSelect={(birthDate) => {
                    setFilters({ birthDate })
                    setBirthDateCalendarOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Button
            onClick={() => {
              setFilters({
                mrn: "",
                fullName: "",
                birthDate: undefined,
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
