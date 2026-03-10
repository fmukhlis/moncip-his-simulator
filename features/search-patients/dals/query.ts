"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { formatISO } from "date-fns"
import { SearchPatientsSchema } from "../schema"

export async function searchPatients({
  count = 50,
  userId,
  fullName,
  mrnNumber,
  birthDate,
  nationalId,
}: z.infer<typeof SearchPatientsSchema>) {
  const rawData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      patients: {
        where: {
          deletedAt: null,
          ...(mrnNumber ? { mrnNumber: { equals: mrnNumber } } : {}),
          ...(fullName ? { fullName: { contains: fullName, mode: "insensitive" } } : {}),
          ...(birthDate ? { birthDate: { equals: new Date(birthDate) } } : {}),
          ...(nationalId ? { nationalId: { equals: nationalId } } : {}),
        },
        select: {
          id: true,
          sex: true,
          fullName: true,
          mrnNumber: true,
          birthDate: true,
          encounters: {
            where: { status: "ACTIVE" },
            select: { id: true },
          },
        },
        take: count,
        orderBy: { fullName: "asc" },
      },
    },
  })

  return rawData
    ? rawData.patients.map(({ mrnNumber, birthDate, ...restPatient }) => ({
        ...restPatient,
        mrn: `MRN-${mrnNumber.toString().padStart(8, "0")}`,
        birthDate: formatISO(birthDate),
      }))
    : []
}

// {
//   age: number
//   phone?: string | null
//   email?: string | null
//   address?: string | null

//   activeEncounter: {
//     id: string
//     startedAt: Date
//   } | null

//   lastEncounter: {
//     id: string
//     startedAt: Date
//     endedAt: Date | null
//   } | null

//   totalEncounters: number
// }

// export async function getLocalPatient({
//   id,
// }: z.infer<typeof GetLocalPatientSchema>) {
//   const rawData = await prisma.patient.findUnique({
//     where: { id, deletedAt: null },
//     select: {
//       id: true,
//       name: true,
//       gender: true,
//       source: true,
//       linkedAt: true,
//       createdAt: true,
//       dateOfBirth: true,
//       externalSystemId: true,
//     },
//   });

//   return rawData
//     ? {
//         ...rawData,
//         linkedAt: rawData.linkedAt ? formatISO(rawData.linkedAt) : null,
//         createdAt: rawData.createdAt ? formatISO(rawData.createdAt) : null,
//         dateOfBirth: formatISO(rawData.dateOfBirth),
//       }
//     : null;
// }
