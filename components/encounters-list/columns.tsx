"use client"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import { CalendarClock, Hospital, MoreHorizontal, Stethoscope } from "lucide-react"
import Link from "next/link"
import { Encounter } from "@/features/encounter/encounter.type"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

const ENCOUNTER_TYPE_LABEL = {
  ER: "Emergency",
  IPD: "Inpatient",
  OPD: "Outpatient",
}

function getStatusBadge(status: string) {
  if (status === "ACTIVE") {
    return <Badge className="hover:bg-emerald-90 w-[85px] bg-emerald-100 text-emerald-700">Active</Badge>
  }
  if (status === "COMPLETED") {
    return (
      <Badge variant="secondary" className="w-[85px]">
        Completed
      </Badge>
    )
  }
  return (
    <Badge variant="destructive" className="w-[85px]">
      Cancelled
    </Badge>
  )
}

const columnHelper = createColumnHelper<Encounter>()

export const columns = [
  columnHelper.accessor("no", {
    header: () => <div>Encounter No</div>,
    cell: ({ getValue }) => <div>{getValue()}</div>,
    size: 150,
  }),
  columnHelper.accessor("type", {
    header: () => <div className="text-center">Encounter Type</div>,
    cell: ({ getValue }) => (
      <div className="text-center">
        <Badge variant="outline">{ENCOUNTER_TYPE_LABEL[getValue()]}</Badge>
      </div>
    ),
    size: 150,
  }),
  columnHelper.accessor("unit", {
    header: () => <div className="text-center">Unit</div>,
    cell: ({ getValue }) => (
      <div>
        <div className="text-muted-foreground flex items-center justify-center gap-2">
          <Hospital className="h-4 w-4" />
          <span>{getValue().name}</span>
        </div>
      </div>
    ),
    size: 999,
  }),
  columnHelper.accessor("provider", {
    header: () => <div>Provider</div>,
    cell: ({ getValue }) => (
      <div>
        <div className="text-muted-foreground flex items-center gap-2">
          <Stethoscope className="h-4 w-4" />
          <span>{getValue().name}</span>
        </div>
      </div>
    ),
    size: 999,
  }),
  columnHelper.accessor("dateTime", {
    header: () => <div>Encounter Date</div>,
    cell: ({ getValue }) => (
      <div>
        <div className="text-muted-foreground flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          <span>{format(getValue(), "dd MMM yyyy")}</span>
        </div>
      </div>
    ),
    size: 999,
  }),
  columnHelper.accessor("status", {
    header: () => <div className="text-center">Status</div>,
    cell: ({ getValue }) => <div className="text-center">{getStatusBadge(getValue())}</div>,
    size: 100,
  }),
  columnHelper.display({
    id: "actions",
    header: () => <div>Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/auth/patients/${row.original.patient.id}/encounters/${row.original.id}`}>
                View encounter
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Create lab order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    size: 100,
  }),
] as ColumnDef<Encounter>[]
