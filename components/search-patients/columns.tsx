"use client"

import Link from "next/link"

import { Button } from "../ui/button"
import { parseISO } from "date-fns"
import { formatAge } from "@/lib/utils"
import { searchPatientsAction } from "@/features/search-patients/actions/query"
import { SquareArrowOutUpRight } from "lucide-react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

const columnHelper = createColumnHelper<Awaited<ReturnType<typeof searchPatientsAction>>["data"][number]>()

export const columns = [
  columnHelper.accessor("mrn", {
    header: () => <div className="w-full px-1.5">MRN</div>,
    cell: ({ getValue }) => <div className="w-full px-1.5">{getValue()}</div>,
  }),
  columnHelper.accessor("fullName", {
    header: () => <div className="w-full px-1.5">Full Name</div>,
    cell: ({ getValue }) => <div className="w-full px-1.5">{getValue()}</div>,
    size: 999,
  }),
  columnHelper.accessor("sex", {
    header: () => <div className="w-full px-1.5 text-center">Sex</div>,
    cell: ({ getValue }) => <div className="w-full px-1.5 text-center">{getValue()}</div>,
  }),
  columnHelper.accessor("birthDate", {
    header: () => <div className="w-full px-1.5 text-center">Age</div>,
    cell: ({ getValue }) => <div className="w-full px-1.5 text-center">{formatAge(parseISO(getValue()))}</div>,
  }),
  columnHelper.accessor("nationalId", {
    header: () => <div className="w-full px-1.5">National ID</div>,
    cell: ({ getValue }) => <div className="w-full px-1.5">{getValue() ? getValue() : "-"}</div>,
  }),
  columnHelper.display({
    id: "actions",
    header: () => <div className="w-full px-1.5 text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="w-full px-1.5">
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size={"icon-sm"} variant={"ghost"}>
                <Link href={`/auth/patients/${row.original.id}/overview`}>
                  <SquareArrowOutUpRight className="size-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View patient details</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    ),
  }),
] as ColumnDef<Awaited<ReturnType<typeof searchPatientsAction>>["data"][number]>[]
