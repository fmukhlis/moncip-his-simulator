"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { formatISO } from "date-fns"
import { GetPatientOverviewSchema } from "../schema"

export async function getPatientOverview({ patientId }: z.infer<typeof GetPatientOverviewSchema>) {
  const [patient, activeEncounter, lastEncounter] = await prisma.$transaction([
    prisma.patient.findUnique({
      where: { id: patientId, deletedAt: null },
      select: {
        id: true,
        sex: true,
        phone: true,
        email: true,
        address: true,
        fullName: true,
        mrnNumber: true,
        birthDate: true,
        nationalId: true,
      },
    }),
    prisma.encounter.findFirst({
      where: {
        patientId,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        department: true,
        encounterType: true,
        encounterDateTime: true,
      },
    }),
    prisma.encounter.findFirst({
      where: {
        patientId,
        status: { in: ["COMPLETED", "CANCELLED"] },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        department: true,
        encounterType: true,
        encounterDateTime: true,
      },
    }),

    // prisma.labOrder.count({
    //   where: { patientId },
    // }),

    // prisma.labOrder.count({
    //   where: {
    //     patientId,
    //     status: "PENDING",
    //   },
    // }),

    // prisma.labOrder.findFirst({
    //   where: { patientId },
    //   orderBy: { createdAt: "desc" },
    //   select: {
    //     id: true,
    //     status: true,
    //     createdAt: true,
    //     completedAt: true,
    //   },
    // }),
  ])

  if (!patient) return null

  return {
    patient: { ...patient, birthDate: formatISO(patient.birthDate) },
    // lastEncounter,
    // activeEncounter,
    // labSummary: {
    //   totalOrders,
    //   pendingOrders,
    //   lastOrderDate: lastLabOrder?.createdAt ?? null,
    //   lastResultDate: lastLabOrder?.completedAt ?? null,
    // },
  }
}
