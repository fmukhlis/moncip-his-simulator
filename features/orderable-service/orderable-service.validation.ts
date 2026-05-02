import { OrderableServiceType } from "@/generated/prisma/enums"
import { requiredCuid2 } from "@/lib/custom-zod-types"
import z from "zod"

export const GetOrderableServicesActionSchema = z.strictObject({
  page: z.coerce.number().int().positive().optional(),
  type: z.array(z.enum(OrderableServiceType)).nonempty(),
  search: z.string().trim(),
  trashed: z.boolean().default(false),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  categories: z.array(z.string().trim()),
})

export const GetOrderableServicesSchema = GetOrderableServicesActionSchema.transform((value) => {
  const useServerSidePagination = value.page !== undefined || value.pageSize !== undefined

  return {
    type: value.type,
    search: value.search ? value.search : undefined,
    trashed: value.trashed,
    categories: value.categories.length ? value.categories : undefined,
    serverPagination: useServerSidePagination ? { page: value.page ?? 1, pageSize: value.pageSize ?? 10 } : null,
  }
})

export const GetOrderableServiceDetailActionSchema = z.strictObject({
  id: requiredCuid2("Orderable service"),
  trashed: z.boolean().default(false),
})

export const GetOrderableServiceDetailSchema = GetOrderableServiceDetailActionSchema
