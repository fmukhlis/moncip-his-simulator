"use client"

import { columns } from "./columns"
import { useQuery } from "@tanstack/react-query"
import { BasicTable } from "../ui/basic-table"
import { useSearchPatientsStore } from "@/providers/search-patients-store-provider"
import { getSearchPatientsActionOptions } from "@/features/search-patients/api/query"

export default function SearchPatientsResult() {
  const { filters } = useSearchPatientsStore((state) => state)

  const { data, isFetching, isEnabled } = useQuery(
    getSearchPatientsActionOptions({
      count: 20,
      fullName: filters.fullName,
      birthDate: filters.birthDate,
      mrnNumber: filters.mrnNumber,
      nationalId: filters.nationalId,
    })
  )

  const getTableState: () => React.ComponentProps<typeof BasicTable>["tableState"] = () => {
    if (!isEnabled) {
      return {
        type: "idle",
        message: "Search patients by Name, MRN, National ID, or Birth Date...",
      }
    } else if (isFetching) {
      return {
        type: "loading",
        message: "Loading...",
      }
    }
    return undefined
  }

  return <BasicTable data={data?.data ?? []} columns={columns} tableState={getTableState()} />
}
