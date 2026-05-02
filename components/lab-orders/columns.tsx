"use client"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { View } from "lucide-react"
import Link from "next/link"
import { LabOrder } from "@/features/lab-order/lab-order.type"
import { LabOrderPriority, LabOrderStatus } from "@/generated/prisma/enums"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import ClientDateTimeText from "../ui/client-date-time-text"

const columnHelper = createColumnHelper<LabOrder>()

export const columns = [
  columnHelper.accessor("no", {
    header: ({ column }) => <div className={column.columnDef.meta?.headerClassName}>Lab. Order No.</div>,
    cell: ({ getValue, column }) => <div className={column.columnDef.meta?.cellClassName}>{getValue()}</div>,
    size: 999,
    meta: {
      headerClassName: "w-full px-1.5",
      cellClassName: "w-full px-1.5",
    },
  }),
  columnHelper.accessor("orderedAt", {
    header: ({ column }) => <div className={column.columnDef.meta?.headerClassName}>Ordered At</div>,
    cell: ({ getValue, column }) => (
      <div className={column.columnDef.meta?.cellClassName}>
        <ClientDateTimeText formatStr="dd MMM yyyy, HH.mm" dateTime={getValue()} />
      </div>
    ),
    size: 150,
    meta: {
      headerClassName: "w-full px-1.5",
      cellClassName: "w-full px-1.5",
    },
  }),
  columnHelper.accessor("encounter.type", {
    header: ({ column }) => <div className={column.columnDef.meta?.headerClassName}>Encounter Type</div>,
    cell: ({ getValue, column }) => (
      <div className={column.columnDef.meta?.cellClassName}>
        <Badge variant={"outline"}>{getValue()}</Badge>
      </div>
    ),
    size: 100,
    meta: {
      headerClassName: "w-full px-1.5 text-center",
      cellClassName: "flex w-full justify-center px-1.5",
    },
  }),
  columnHelper.accessor("orderingProvider.name", {
    header: ({ column }) => <div className={column.columnDef.meta?.headerClassName}>Ordering Provider</div>,
    cell: ({ getValue, column }) => <div className={column.columnDef.meta?.cellClassName}>{getValue()}</div>,
    size: 999,
    meta: {
      headerClassName: "w-full px-1.5",
      cellClassName: "w-full px-1.5",
    },
  }),
  columnHelper.accessor("_count.items", {
    header: ({ column }) => <div className={column.columnDef.meta?.headerClassName}>Items Count</div>,
    cell: ({ getValue, column }) => (
      <div className={column.columnDef.meta?.cellClassName}>
        <Badge variant={"secondary"}>{getValue()}</Badge>
      </div>
    ),
    size: 100,
    meta: {
      headerClassName: "w-full px-1.5 text-center",
      cellClassName: "flex w-full justify-center px-1.5",
    },
  }),
  columnHelper.accessor("priority", {
    header: ({ column }) => <div className={column.columnDef.meta?.headerClassName}>Priority</div>,
    cell: ({ getValue, column }) => (
      <div className={column.columnDef.meta?.cellClassName}>{getPriorityBadge(getValue())}</div>
    ),
    size: 100,
    meta: {
      headerClassName: "w-full px-1.5 text-center",
      cellClassName: "flex w-full justify-center px-1.5",
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => <div className={column.columnDef.meta?.headerClassName}>Status</div>,
    cell: ({ getValue, column }) => (
      <div className={column.columnDef.meta?.cellClassName}>{getStatusBadge(getValue())}</div>
    ),
    size: 100,
    meta: {
      headerClassName: "w-full px-1.5 text-center",
      cellClassName: "flex w-full justify-center px-1.5",
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  }),
  columnHelper.display({
    id: "action",
    header: ({ column }) => <div className={column.columnDef.meta?.headerClassName}>Action</div>,
    cell: ({ column, row }) => (
      <div className={column.columnDef.meta?.cellClassName}>
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/auth/patients/${row.original.patient.id}/lab-orders/${row.original.id}`}>
            <View className="size-4" />
            <span className="sr-only">View</span>
          </Link>
        </Button>
      </div>
    ),
    size: 100,
    meta: {
      headerClassName: "w-full px-1.5 text-center",
      cellClassName: "flex w-full justify-center px-1.5",
    },
  }),
] as ColumnDef<LabOrder>[]

function getStatusBadge(status: LabOrderStatus) {
  switch (status) {
    case "SUBMITTED":
      return <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Submitted</Badge>
    case "PARTIALLY_RESULTED":
      return <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">Partially Resulted</Badge>
    case "RESULTED":
      return <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Resulted</Badge>
    case "CANCELLED":
      return <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">Cancelled</Badge>
  }
}

function getPriorityBadge(priority: LabOrderPriority) {
  switch (priority) {
    case "ROUTINE":
      return <Badge variant="outline">{priority}</Badge>
    case "STAT":
      return <Badge variant="destructive">{priority}</Badge>
  }
}
