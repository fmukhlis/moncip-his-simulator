"use server"

import z from "zod"

import { prisma } from "@/lib/prisma"
import { formatISO } from "date-fns"
import { SearchPatientsSchema } from "../schema"

type DatabaseClient = typeof prisma

export async function searchPatients(
  db: Pick<DatabaseClient, "patient">,
  { count = 50, userId, fullName, mrnNumber, birthDate, nationalId }: z.infer<typeof SearchPatientsSchema>
) {
  const patients = await db.patient.findMany({
    where: {
      userId,
      deletedAt: null,
      ...(fullName ? { fullName: { contains: fullName, mode: "insensitive" } } : {}),
      ...(birthDate ? { birthDate: { equals: new Date(birthDate) } } : {}),
      ...(mrnNumber ? { mrnNumber: { equals: mrnNumber } } : {}),
      ...(nationalId ? { nationalId: { equals: nationalId } } : {}),
    },
    select: {
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
    },
    take: count,
    orderBy: { fullName: "asc" },
  })

  return patients
    ? patients.map(({ mrnNumber, birthDate, ...restPatient }) => ({
        ...restPatient,
        mrn: `MRN-${mrnNumber.toString().padStart(8, "0")}`,
        birthDate: formatISO(birthDate),
      }))
    : []
}
