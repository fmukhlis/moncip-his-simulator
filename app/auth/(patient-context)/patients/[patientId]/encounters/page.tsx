import EncounterFiltersCard from "@/components/encounters-list/encounter-filters-card"

import { Card, CardHeader } from "@/components/ui/card"
import { EncounterTableCard } from "@/components/encounters-list/encounter-table-card"

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
  const { q, page, type, status, unitId } = await searchParams

  const filters = {
    q: getSingleSearchParam(q) ?? "",
    page: Number(getSingleSearchParam(page) ?? "1"),
    type: getSingleSearchParam(type) ?? "ALL",
    status: getSingleSearchParam(status) ?? "ALL",
    unitId: getSingleSearchParam(unitId) ?? "",
    patientId,
  }

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
          </div>
        </CardHeader>
      </Card>
      <EncounterFiltersCard filters={filters} />
      <EncounterTableCard filters={filters} />
    </div>
  )
}
