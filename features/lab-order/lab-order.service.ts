"use server"

import z from "zod"

import { prisma } from "@/lib/prisma"
import { buildLabOrderNo, buildLabOrderPeriod } from "@/lib/generate-item-no"
import {
  CreateLabOrderSchema,
  ReserveLabOrderNumberSchema,
  AssertEncounterAccessibleSchema,
  GetValidatedOrderableServicesSchema,
  AssertOrderingProviderAccessibleSchema,
  GetLabOrderDetailSchema,
  GetLabOrdersSchema,
  AssertUnitAccessibleSchema,
} from "./lab-order.validation"
import { labOrderDetailSelect, labOrderListSelect } from "./lab-order.select"
import { Prisma } from "@/generated/prisma/client"

type DatabaseClient = typeof prisma

export async function reserveLabOrderNumber(
  db: Pick<DatabaseClient, "labOrderCounter">,
  { date }: z.infer<typeof ReserveLabOrderNumberSchema>
) {
  const period = buildLabOrderPeriod(date)

  const counter = await db.labOrderCounter.upsert({
    where: { period },
    create: { period, sequence: 1 },
    update: { sequence: { increment: 1 } },
    select: { sequence: true },
  })

  const no = buildLabOrderNo(period, counter.sequence)

  return {
    no,
    period: period,
    sequence: counter.sequence,
  }
}

export async function assertEncounterAccessible(
  db: Pick<DatabaseClient, "encounter">,
  { id, userId }: z.infer<typeof AssertEncounterAccessibleSchema>
) {
  const encounter = await db.encounter.findFirst({
    where: {
      id,
      status: "ACTIVE",
      patient: { userId, deletedAt: null },
      deletedAt: null,
    },
    select: { id: true, patient: { select: { id: true, fullName: true, mrnNumber: true } } },
  })

  if (!encounter) {
    throw new Error("Active encounter not found or access denied.")
  }

  return encounter
}

export async function assertOrderingProviderAccessible(
  db: Pick<DatabaseClient, "provider">,
  { id }: z.infer<typeof AssertOrderingProviderAccessibleSchema>
) {
  const orderingProvider = await db.provider.findFirst({
    where: {
      id,
      isActive: true,
    },
    select: { id: true, name: true },
  })

  if (!orderingProvider) {
    throw new Error("Active ordering provider not found.")
  }

  return orderingProvider
}

export async function assertUnitAccessible(
  db: Pick<DatabaseClient, "unit">,
  { id }: z.infer<typeof AssertUnitAccessibleSchema>
) {
  const unit = await db.unit.findFirst({
    where: {
      id: id,
      isActive: true,
    },
    select: { id: true, name: true },
  })

  if (!unit) {
    throw new Error("Active unit not found.")
  }

  return unit
}

export async function getValidatedOrderableServices(
  db: Pick<DatabaseClient, "orderableService">,
  { orderableServiceIds }: z.infer<typeof GetValidatedOrderableServicesSchema>
) {
  const orderableServices = await db.orderableService.findMany({
    where: {
      id: { in: orderableServiceIds },
      deletedAt: null,
    },
    select: { id: true, code: true, name: true, category: true, price: true },
  })

  if (orderableServices.length !== orderableServiceIds.length) {
    throw new Error("Some orderable services are invalid or inactive.")
  }

  return orderableServices.map(({ id, code, name, price, category }) => ({
    snapshotCode: code,
    snapshotName: name,
    snapshotPrice: price?.toString(),
    snapshotCategory: category,
    orderableServiceId: id,
  }))
}

export async function createLabOrder(
  db: Pick<DatabaseClient, "labOrder">,
  {
    no,
    items,
    period,
    unitId,
    userId,
    priority,
    sequence,
    patientId,
    encounterId,
    clinicalNote,
    unitNameSnapshot,
    orderingProviderId,
    providerNameSnapshot,
    patientFullNameSnapshot,
    patientMrnNumberSnapshot,
  }: z.infer<typeof CreateLabOrderSchema>
) {
  return db.labOrder.create({
    data: {
      no,
      items: { create: items },
      period,
      userId,
      unitId,
      priority,
      sequence,
      patientId,
      encounterId,
      clinicalNote,
      unitNameSnapshot,
      orderingProviderId,
      providerNameSnapshot,
      patientFullNameSnapshot,
      patientMrnNumberSnapshot,
    },
    select: labOrderDetailSelect,
  })
}

export async function getLabOrderDetail(
  db: Pick<DatabaseClient, "labOrder">,
  { id, userId }: z.infer<typeof GetLabOrderDetailSchema>
) {
  return await db.labOrder.findFirst({
    where: {
      id,
      userId,
    },
    select: labOrderDetailSelect,
  })
}

export async function getLabOrders(
  db: Pick<DatabaseClient, "labOrder">,
  { userId, patientId, encounterId, serverPagination, search, status, priority }: z.infer<typeof GetLabOrdersSchema>
) {
  const where: Prisma.LabOrderWhereInput = {
    userId,
    status: { in: status },
    priority: { in: priority },
  }

  if (patientId) {
    where.patientId = patientId
  }

  if (encounterId) {
    where.encounterId = encounterId
  }

  if (search) {
    where.OR = [{ no: { contains: search, mode: "insensitive" } }, { id: { contains: search, mode: "insensitive" } }]
  }

  return prisma.$transaction([
    db.labOrder.findMany({
      where,
      ...(serverPagination
        ? {
            skip: (serverPagination.page - 1) * serverPagination.pageSize,
            take: serverPagination.pageSize,
          }
        : {}),
      select: labOrderListSelect,
      orderBy: { createdAt: "desc" },
    }),
    db.labOrder.count({ where }),
  ])
}
