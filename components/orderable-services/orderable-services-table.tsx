"use client"

import { useQuery } from "@tanstack/react-query"
import { getGetOrderableServicesActionOptions } from "@/features/orderable-service/apis/query"
import { columns } from "./columns"
import { BasicTable } from "../ui/basic-table"

export default function OrderableServicesTable() {
  const { data, isFetching } = useQuery(getGetOrderableServicesActionOptions())

  const getTableState: () => React.ComponentProps<typeof BasicTable>["tableState"] = () => {
    if (isFetching) {
      return {
        type: "loading",
        message: "Loading...",
      }
    }
    return undefined
  }

  return <BasicTable data={data ?? []} columns={columns} tableState={getTableState()} />
}
