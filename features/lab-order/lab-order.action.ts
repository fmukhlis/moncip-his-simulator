"use server"

import z from "zod"

import { prisma } from "@/lib/prisma"
import { requireAuthUser } from "@/lib/require-auth-user"
import { buildLabOrderPeriod } from "@/lib/generate-item-no"
import {
  CreateLabOrderActionSchema,
  CreateLabOrderSchema,
  GetLabOrderDetailActionSchema,
  GetLabOrderDetailSchema,
  GetLabOrdersActionSchema,
  GetLabOrdersSchema,
} from "./lab-order.validation"
import {
  createLabOrder,
  reserveLabOrderNumber,
  assertEncounterAccessible,
  getValidatedOrderableServices,
  assertOrderingProviderAccessible,
  getLabOrderDetail,
  getLabOrders,
  assertUnitAccessible,
} from "./lab-order.service"
import { formatISO } from "date-fns"

export async function createLabOrderAction(params: z.infer<typeof CreateLabOrderActionSchema>) {
  const user = await requireAuthUser()

  return await prisma.$transaction(async (tx) => {
    const { no, period, sequence } = await reserveLabOrderNumber(tx, { date: new Date() })

    const encounter = await assertEncounterAccessible(tx, {
      id: params.encounterId,
      userId: user.id ?? "",
    })

    const orderingProvider = await assertOrderingProviderAccessible(tx, { id: params.orderingProviderId })

    const unit = await assertUnitAccessible(tx, { id: params.unitId })

    const items = await getValidatedOrderableServices(tx, { orderableServiceIds: params.orderableServiceIds })

    const parsedData = CreateLabOrderSchema.parse({
      no,
      items,
      period,
      userId: user.id,
      unitId: unit.id,
      priority: params.priority,
      sequence,
      patientId: encounter.patient.id,
      encounterId: encounter.id,
      clinicalNote: params.clinicalNote,
      unitNameSnapshot: unit.name,
      orderingProviderId: orderingProvider.id,
      providerNameSnapshot: orderingProvider.name,
      patientFullNameSnapshot: encounter.patient.fullName,
      patientMrnNumberSnapshot: encounter.patient.mrnNumber,
    })

    const response = await createLabOrder(tx, parsedData)

    return {
      data: {
        ...response,
        items: response.items.map((item) => ({
          ...item,
          createdAt: formatISO(item.createdAt),
          updatedAt: formatISO(item.updatedAt),
          snapshotPrice: item.snapshotPrice?.toString(),
          resultReceivedAt: item.resultReceivedAt ? formatISO(item.resultReceivedAt) : null,
        })),
        patient: {
          ...response.patient,
          birthDate: formatISO(response.patient.birthDate),
        },
        createdAt: formatISO(response.createdAt),
        encounter: {
          ...response.encounter,
          createdAt: formatISO(response.encounter.createdAt),
          updatedAt: formatISO(response.encounter.updatedAt),
        },
        orderedAt: formatISO(response.orderedAt),
        updatedAt: formatISO(response.updatedAt),
        cancelledAt: response.cancelledAt ? formatISO(response.cancelledAt) : null,
      },
    }
  })
}

export async function getLabOrderDetailAction(params: z.infer<typeof GetLabOrderDetailActionSchema>) {
  const user = await requireAuthUser()

  const { id, userId } = GetLabOrderDetailSchema.parse({ ...params, userId: user.id })

  const queryResponse = await getLabOrderDetail(prisma, { id, userId })

  if (!queryResponse) {
    return { data: null }
  }

  return {
    data: {
      ...queryResponse,
      resultReports: queryResponse.resultReports.map((item) => ({
        ...item,
        resultItems: item.resultItems.map((resultItem) => ({
          ...resultItem,
          createdAt: formatISO(resultItem.createdAt),
          updatedAt: formatISO(resultItem.updatedAt),
          observedAt: resultItem.observedAt ? formatISO(resultItem.observedAt) : null,
          releasedAt: resultItem.releasedAt ? formatISO(resultItem.releasedAt) : null,
          valueNumeric: resultItem.valueNumeric?.toString(),
          resultReceivedAt: resultItem.releasedAt ? formatISO(resultItem.releasedAt) : null,
        })),
        createdAt: formatISO(item.createdAt),
        updatedAt: formatISO(item.updatedAt),
        releasedAt: item.releasedAt ? formatISO(item.releasedAt) : null,
      })),
      items: queryResponse.items.map((item) => ({
        ...item,
        createdAt: formatISO(item.createdAt),
        updatedAt: formatISO(item.updatedAt),
        snapshotPrice: item.snapshotPrice?.toString(),
        resultReceivedAt: item.resultReceivedAt ? formatISO(item.resultReceivedAt) : null,
      })),
      patient: {
        ...queryResponse.patient,
        birthDate: formatISO(queryResponse.patient.birthDate),
      },
      createdAt: formatISO(queryResponse.createdAt),
      encounter: {
        ...queryResponse.encounter,
        createdAt: formatISO(queryResponse.encounter.createdAt),
        updatedAt: formatISO(queryResponse.encounter.updatedAt),
      },
      orderedAt: formatISO(queryResponse.orderedAt),
      updatedAt: formatISO(queryResponse.updatedAt),
      cancelledAt: queryResponse.cancelledAt ? formatISO(queryResponse.cancelledAt) : null,
    },
  }
}

export async function getLabOrdersAction(params: z.infer<typeof GetLabOrdersActionSchema>) {
  const user = await requireAuthUser()

  const parsedGetLabOrdersData = GetLabOrdersSchema.parse({
    ...params,
    userId: user.id,
  })

  const [queryResponse, total] = await getLabOrders(prisma, parsedGetLabOrdersData)

  const data = {
    items: queryResponse.map((item) => ({
      ...item,
      createdAt: formatISO(item.createdAt),
      orderedAt: formatISO(item.orderedAt),
      cancelledAt: item.cancelledAt ? formatISO(item.cancelledAt) : null,
    })),
    totalCount: queryResponse.length,
    paginationMeta: null as {
      page: number
      total: number
      pageSize: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    } | null,
  }

  if (parsedGetLabOrdersData.serverPagination) {
    const { page, pageSize } = parsedGetLabOrdersData.serverPagination

    const totalPages = queryResponse.length === 0 ? 1 : Math.ceil(queryResponse.length / pageSize)

    data.paginationMeta = {
      page,
      total,
      pageSize,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  }

  return { data }
}
