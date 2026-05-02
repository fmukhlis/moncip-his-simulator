import { Prisma } from "@/generated/prisma/client"

export const labOrderDetailSelect = {
  id: true,
  no: true,
  status: true,
  priority: true,
  createdAt: true,
  orderedAt: true,
  updatedAt: true,
  cancelledAt: true,
  clinicalNote: true,
  unitNameSnapshot: true,
  integrationStatus: true,
  resultReports: {
    include: { resultItems: true },
  },
  items: {
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      snapshotCode: true,
      snapshotName: true,
      snapshotPrice: true,
      resultReceivedAt: true,
      snapshotCategory: true,
      orderableServiceId: true,
    },
  },
  patient: {
    select: {
      id: true,
      sex: true,
      fullName: true,
      mrnNumber: true,
      birthDate: true,
    },
  },
  encounter: {
    select: {
      id: true,
      no: true,
      type: true,
      unit: {
        select: {
          id: true,
          name: true,
        },
      },
      status: true,
      createdAt: true,
      updatedAt: true,
      coverageType: true,
    },
  },
  orderingProvider: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.LabOrderSelect

export const labOrderListSelect = {
  id: true,
  no: true,
  status: true,
  priority: true,
  createdAt: true,
  orderedAt: true,
  cancelledAt: true,
  unitNameSnapshot: true,
  integrationStatus: true,
  providerNameSnapshot: true,
  encounter: {
    select: {
      id: true,
      type: true,
      status: true,
    },
  },
  orderingProvider: {
    select: {
      id: true,
      name: true,
    },
  },
  patient: {
    select: {
      id: true,
    },
  },
  _count: {
    select: {
      items: true,
    },
  },
} satisfies Prisma.LabOrderSelect
