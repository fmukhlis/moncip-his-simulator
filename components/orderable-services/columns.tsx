"use client"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { getOrderableServicesAction } from "@/features/orderable-service/actions/query"
import { formatCurrencyFromDecimalString } from "@/lib/utils"
import { Badge } from "../ui/badge"

type OrderableServie = Awaited<ReturnType<typeof getOrderableServicesAction>>["data"][number]

const columnHelper = createColumnHelper<OrderableServie>()

export const columns = [
  columnHelper.accessor("code", {
    header: () => <div className="w-full px-1.5">Code</div>,
    cell: ({ getValue }) => <div className="w-full px-1.5">{getValue()}</div>,
    size: 100,
  }),
  columnHelper.accessor("name", {
    header: () => <div className="w-full px-1.5">Name</div>,
    cell: ({ getValue }) => <div className="w-full px-1.5">{getValue()}</div>,
    size: 999,
  }),
  columnHelper.accessor("category", {
    header: () => <div className="w-full px-1.5">Category</div>,
    cell: ({ getValue }) => <div className="w-full px-1.5">{getValue()}</div>,
    size: 150,
  }),
  columnHelper.accessor("type", {
    header: () => <div className="w-full px-1.5 text-center">Type</div>,
    cell: ({ getValue }) => (
      <div className="w-full px-1.5 text-center">
        {getValue() === "PANEL" ? <Badge variant="secondary">Panel</Badge> : <Badge variant="outline">Single</Badge>}
      </div>
    ),
    size: 100,
  }),
  columnHelper.accessor("price", {
    header: () => <div className="w-full px-1.5">Price</div>,
    cell: ({ getValue }) => <div className="w-full px-1.5">{formatCurrencyFromDecimalString(getValue() ?? "")}</div>,
    size: 200,
  }),
  columnHelper.accessor((row) => (row.deletedAt ? "Inactive" : "Active"), {
    id: "status",
    header: () => <div className="w-full px-1.5 text-center">Status</div>,
    cell: ({ getValue }) => (
      <div className="w-full px-1.5 text-center">
        {getValue() === "Active" ? (
          <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        )}
      </div>
    ),
    size: 100,
  }),
] as ColumnDef<OrderableServie>[]
