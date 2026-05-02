import z from "zod"

import { LabOrderStatus, LabOrderPriority } from "@/generated/prisma/enums"
import { requiredCuid2, requiredEnumString } from "@/lib/custom-zod-types"

export const ReserveLabOrderNumberSchema = z.strictObject({
  date: z.date(),
})

export const AssertEncounterAccessibleSchema = z.strictObject({
  id: requiredCuid2("Encounter"),
  userId: requiredCuid2("User"),
})

export const AssertOrderingProviderAccessibleSchema = z.strictObject({
  id: requiredCuid2("Ordering provider"),
})

export const AssertUnitAccessibleSchema = z.strictObject({
  id: requiredCuid2("Unit"),
})

export const GetValidatedOrderableServicesSchema = z.strictObject({
  orderableServiceIds: z.array(requiredCuid2("Orderable service")).min(1),
})

export const CreateLabOrderActionSchema = z.strictObject({
  unitId: requiredCuid2("Unit"),
  priority: requiredEnumString(["ROUTINE", "STAT"], "Lab order priority"),
  encounterId: requiredCuid2("Encounter"),
  clinicalNote: z.string().trim().max(2000),
  orderingProviderId: requiredCuid2("Ordering provider"),
  orderableServiceIds: z
    .array(requiredCuid2("Orderable service"))
    .min(1, "Orderable services are required.")
    .refine((ids) => new Set(ids).size === ids.length, { error: "Orderable services must be unique" }),
})

export const CreateLabOrderSchema = CreateLabOrderActionSchema.omit({ orderableServiceIds: true })
  .extend({
    no: z.string().trim().min(1),
    items: z.array(
      z.strictObject({
        snapshotCode: z.string().trim().min(1),
        snapshotName: z.string().trim().min(1),
        snapshotPrice: z
          .string()
          .trim()
          .min(1, { error: "Snapshot price is required." })
          .regex(/^\d+(\.\d+)?$/, { error: "Snapshot price must be a valid decimal number." }),
        snapshotCategory: z.string().trim().min(1),
        orderableServiceId: requiredCuid2("Orderable service"),
      })
    ),
    period: z.string().trim().min(1),
    userId: requiredCuid2("User"),
    sequence: z.int().positive(),
    patientId: requiredCuid2("Patient"),
    unitNameSnapshot: z.string().trim().min(1),
    providerNameSnapshot: z.string().trim().min(1),
    patientFullNameSnapshot: z.string().trim().min(1),
    patientMrnNumberSnapshot: z.number().positive(),
  })
  .transform((value) => ({
    no: value.no,
    items: value.items,
    period: value.period,
    userId: value.userId,
    unitId: value.unitId,
    priority: value.priority as LabOrderPriority,
    sequence: value.sequence,
    patientId: value.patientId,
    encounterId: value.encounterId,
    clinicalNote: value.clinicalNote ? value.clinicalNote?.trim() : null,
    unitNameSnapshot: value.unitNameSnapshot,
    orderingProviderId: value.orderingProviderId,
    providerNameSnapshot: value.providerNameSnapshot,
    patientFullNameSnapshot: value.patientFullNameSnapshot,
    patientMrnNumberSnapshot: value.patientMrnNumberSnapshot,
  }))

export const GetLabOrderDetailActionSchema = z.strictObject({
  id: requiredCuid2("Lab order"),
})

export const GetLabOrderDetailSchema = GetLabOrderDetailActionSchema.extend({
  userId: requiredCuid2("User"),
})

export const GetLabOrdersActionSchema = z.strictObject({
  page: z.coerce.number().int().positive().optional(),
  search: z.string().trim(),
  status: z.array(z.enum(LabOrderStatus)).nonempty(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  priority: z.array(z.enum(LabOrderPriority)).nonempty(),
  patientId: z.string().trim(),
  encounterId: z.string().trim(),
})

export const GetLabOrdersSchema = GetLabOrdersActionSchema.extend({
  userId: requiredCuid2("User"),
}).transform((value) => {
  const useServerSidePagination = value.page !== undefined || value.pageSize !== undefined

  return {
    userId: value.userId,
    search: value.search ? value.search : undefined,
    status: value.status,
    priority: value.priority,
    patientId: value.patientId === "ALL" ? undefined : value.patientId,
    encounterId: value.encounterId === "ALL" ? undefined : value.encounterId,
    serverPagination: useServerSidePagination ? { page: value.page ?? 1, pageSize: value.pageSize ?? 10 } : null,
  }
})

// export const getLabOrdersQuerySchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   pageSize: z.coerce.number().int().min(1).max(100).default(10),
//   status: emptyToUndefined(z.nativeEnum(LabOrderStatus).optional()),
//   patientId: emptyToUndefined(z.string().min(1).optional()),
//   encounterId: emptyToUndefined(z.string().min(1).optional()),
//   search: emptyToUndefined(z.string().trim().max(100).optional()),
// })
