import { Plus } from "lucide-react"
import Link from "next/link"
import { getQueryClient } from "@/app/get-query-client"
import { columns } from "@/components/encounters-list/columns"
import EncounterFiltersCard from "@/components/encounters-list/encounter-filters-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ServerTable } from "@/components/ui/server-table"
import { getGetEncountersActionOptions } from "@/features/encounter/encounter.api"
import { EncounterStatus, EncounterType } from "@/generated/prisma/enums"

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function EncounterListPage({
  params,
  searchParams,
}: {
  params: Promise<{ patientId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { patientId } = await params
  const { page, type, search, status, unitId } = await searchParams

  const filters = {
    page: Number(getSingleSearchParam(page) ?? "1"),
    type: (Array.isArray(type) ? type : type ? [type] : ["ER", "IPD", "OPD"]) as EncounterType[],
    search: getSingleSearchParam(search) ?? "",
    status: (Array.isArray(status)
      ? status
      : status
      ? [status]
      : ["ACTIVE", "CANCELLED", "COMPLETED"]) as EncounterStatus[],
    unitId: getSingleSearchParam(unitId) ?? "",
    patientId,
  }

  const queryClient = getQueryClient()

  const { items: encounters, paginationMeta: encountersPaginationMeta } = await queryClient.fetchQuery(
    getGetEncountersActionOptions({
      ...filters,
      trashed: false,
    })
  )

  return (
    <div className="relative flex flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Encounters</h1>
              <p className="text-muted-foreground text-sm">
                Browse active and historical patient encounters. Open an encounter to review visit information and
                continue clinical orders.
              </p>
            </div>
            <Button asChild type="button" variant="outline">
              <Link href={`/auth/patients/${patientId}/encounters/new`}>
                <Plus /> Create Encounter
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>
      <EncounterFiltersCard filters={filters} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Encounter List</CardTitle>
          <CardDescription>Review encounter records and open the one you need.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ServerTable columns={columns} data={encounters} paginationMeta={encountersPaginationMeta!} />
        </CardContent>
      </Card>
    </div>
  )
}
