import { parse } from "date-fns"
import { getQueryClient } from "@/app/get-query-client"
import { columns } from "@/components/search-patients/columns"
import SearchPatientsFilters from "@/components/search-patients/search-patients-filters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ServerTable } from "@/components/ui/server-table"
import { getGetPatientsActionOptions } from "@/features/patient/patient.api"
import { GetPatientsActionSchema } from "@/features/patient/patient.validation"
import { SearchPatientsStoreProvider } from "@/providers/search-patients-store-provider"

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function SearchPatients({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { fullName, birthDate, mrnNumber, nationalId, page } = await searchParams

  const birthDateString = getSingleSearchParam(birthDate)

  const filters = {
    page: Number(getSingleSearchParam(page) ?? "1"),
    fullName: getSingleSearchParam(fullName) ?? "",
    birthDate: birthDateString ? parse(birthDateString, "yyyy-MM-dd", new Date()) : undefined,
    mrnNumber: getSingleSearchParam(mrnNumber) ?? "",
    nationalId: getSingleSearchParam(nationalId) ?? "",
  }

  const queryClient = getQueryClient()

  const tableData = []

  const paginationMeta = {
    page: 1,
    total: 0,
    pageSize: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  }

  if (GetPatientsActionSchema.safeParse(filters).success) {
    const patientsData = await queryClient.fetchQuery(getGetPatientsActionOptions(filters))
    tableData.push(...patientsData.items)
    paginationMeta.page = patientsData.paginationMeta!.page!
    paginationMeta.total = patientsData.paginationMeta!.total!
    paginationMeta.pageSize = patientsData.paginationMeta!.pageSize!
    paginationMeta.hasNextPage = patientsData.paginationMeta!.hasNextPage!
    paginationMeta.hasPreviousPage = patientsData.paginationMeta!.hasPreviousPage!
  }

  return (
    <SearchPatientsStoreProvider>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="relative w-full py-4 shadow">
          <CardHeader className="px-4">
            <CardTitle>
              <h1>Find Patient</h1>
            </CardTitle>
            <CardDescription>
              Find an existing patient using their name, national ID, medical record number, or date of birth.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <SearchPatientsFilters />
          </CardContent>
        </Card>
        <Card className="relative w-full py-4 shadow">
          <CardContent className="flex flex-col gap-4 px-4">
            <ServerTable data={tableData} columns={columns} paginationMeta={paginationMeta} />
          </CardContent>
        </Card>
      </div>
    </SearchPatientsStoreProvider>
  )
}
