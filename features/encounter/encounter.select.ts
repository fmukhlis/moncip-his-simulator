import { Prisma } from "@/generated/prisma/client"

export const encounterDetailSelect = {
  id: true,
  no: true,
  type: true,
  unit: { select: { id: true, name: true, code: true } },
  status: true,
  reason: true,
  dateTime: true,
  provider: { select: { id: true, name: true, code: true } },
  sequence: true,
  createdAt: true,
  deletedAt: true,
  updatedAt: true,
  coverageType: true,
} satisfies Prisma.EncounterSelect

export const encounterListSelect = {
  id: true,
  no: true,
  type: true,
  unit: { select: { id: true, name: true } },
  status: true,
  reason: true,
  patient: { select: { id: true } },
  provider: { select: { id: true, name: true } },
  dateTime: true,
} satisfies Prisma.EncounterSelect
