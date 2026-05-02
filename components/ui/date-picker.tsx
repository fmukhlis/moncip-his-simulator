"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function DatePicker({
  date,
  htmlId,
  className,
  onDateChange = () => {},
}: {
  date?: Date
  htmlId?: string
  className?: string
  onDateChange?: (date: Date | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={htmlId}
          variant="outline"
          data-empty={!date}
          className={cn("data-[empty=true]:text-muted-foreground justify-start text-left font-normal", className)}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            onDateChange(date)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
