import { Prisma } from "@/generated/prisma/client"

export const patientDetailSelect = {
  id: true,
  sex: true,
  phone: true,
  email: true,
  address: true,
  fullName: true,
  mrnNumber: true,
  birthDate: true,
  nationalId: true,
} satisfies Prisma.PatientSelect

export const patientListSelect = {
  id: true,
  sex: true,
  fullName: true,
  mrnNumber: true,
  birthDate: true,
  nationalId: true,
  encounters: {
    where: { status: "ACTIVE" },
    select: { id: true },
  },
} satisfies Prisma.PatientSelect
