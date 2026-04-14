"use client"

import EncounterTableSkeleton from "./encounter-table-skeleton"

import { Button } from "../ui/button"
import { columns } from "./columns"
import { useQuery } from "@tanstack/react-query"
import { Separator } from "../ui/separator"
import { BasicTable } from "../ui/basic-table"
import { ComponentProps } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getGetPatientEncountersActionOptions } from "@/features/patient-context/api/query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "../ui/card"

export function EncounterTableCard({
  filters,
}: {
  filters: {
    q: string
    page: number
    type: string
    status: string
    unitId: string
    patientId: string
  }
}) {
  const { data, isFetching } = useQuery(
    getGetPatientEncountersActionOptions({
      q: filters.q,
      page: filters.page,
      type: filters.type,
      status: filters.status,
      unitId: filters.unitId,
      patientId: filters.patientId,
    })
  )

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getTableState: () => ComponentProps<typeof BasicTable>["tableState"] = () => {
    if (isFetching) {
      return {
        type: "loading",
        message: "Loading...",
      }
    }
    return undefined
  }

  const end = data ? (data.totalCount === 0 ? 1 : Math.min(data.page * data.pageSize, data.totalCount)) : 0
  const start = data ? (data.totalCount === 0 ? 1 : (data.page - 1) * data.pageSize + 1) : 0
  const totalPages = data ? (data.totalCount === 0 ? 1 : Math.ceil(data.totalCount / data.pageSize)) : 0

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Encounter List</CardTitle>
        <CardDescription>Review encounter records and open the one you need.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isFetching ? (
          <EncounterTableSkeleton />
        ) : (
          <>
            <div className="overflow-x-auto">
              <BasicTable columns={columns} data={data?.items ?? []} tableState={getTableState()} />
            </div>
            <Separator />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground text-center sm:text-start">
                Showing {start}-{end} of {data?.totalCount} encounters
              </p>
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <p className="text-muted-foreground">
                  Page {data?.page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      if (data) {
                        updateUrl({ page: String(data.page - 1) })
                      }
                    }}
                    disabled={!data?.hasPreviousPage}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      if (data) {
                        updateUrl({ page: String(data.page + 1) })
                      }
                    }}
                    disabled={!data?.hasNextPage}
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
