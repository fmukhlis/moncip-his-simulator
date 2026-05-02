import { requiredEnumString } from "@/lib/custom-zod-types"
import z from "zod"

export const GetUnitsActionSchema = z.strictObject({
  page: z.coerce.number().int().positive().optional(),
  search: z.string().trim(),
  status: requiredEnumString(["ALL", "ACTIVE", "INACTIVE"], "Unit Status"),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
})

export const GetUnitsSchema = GetUnitsActionSchema.transform((value) => {
  const useServerSidePagination = value.page !== undefined || value.pageSize !== undefined

  return {
    search: value.search ? value.search : undefined,
    status: value.status === "ALL" ? undefined : value.status,
    serverPagination: useServerSidePagination ? { page: value.page ?? 1, pageSize: value.pageSize ?? 10 } : null,
  }
})
