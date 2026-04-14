"use client"

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type TableState =
  | { type: "idle"; message: string }
  | { type: "error"; message: string }
  | { type: "loading"; message: string }

interface BasicTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  tableState?: TableState
}

function IdleState({ columnsLength, message }: { columnsLength: number; message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={columnsLength} className="text-muted-foreground h-16 text-center">
        {message}
      </TableCell>
    </TableRow>
  )
}

function LoadingState({ columnsLength, message }: { columnsLength: number; message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={columnsLength} className="text-muted-foreground h-16 text-center">
        {message}
      </TableCell>
    </TableRow>
  )
}

function ErrorState({ columnsLength, message }: { columnsLength: number; message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={columnsLength} className="text-muted-foreground h-16 text-center">
        {message}
      </TableCell>
    </TableRow>
  )
}

function EmptyState({ columnsLength }: { columnsLength: number }) {
  return (
    <TableRow>
      <TableCell colSpan={columnsLength} className="text-muted-foreground h-16 text-center">
        No results.
      </TableCell>
    </TableRow>
  )
}

export function BasicTable<TData, TValue>({ data, columns, tableState }: BasicTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const getTableBodyContent = () => {
    if (tableState?.type === "idle") {
      return <IdleState columnsLength={columns.length} message={tableState.message} />
    } else if (tableState?.type === "loading") {
      return <LoadingState columnsLength={columns.length} message={tableState.message} />
    } else if (tableState?.type === "error") {
      return <ErrorState columnsLength={columns.length} message={tableState.message} />
    } else {
      return table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                style={{
                  width: cell.column.getSize(),
                  flex: cell.column.getSize() === 999 ? 1 : "none",
                }}
                key={cell.id}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <EmptyState columnsLength={columns.length} />
      )
    }
  }

  return (
    <div className="overflow-hidden border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      flex: header.getSize() === 999 ? 1 : "none",
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>{getTableBodyContent()}</TableBody>
      </Table>
    </div>
  )
}
