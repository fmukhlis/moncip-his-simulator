"use client"

import React from "react"

import { Contact } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { getPatientOverviewActionOptions } from "@/features/patient-context/api/query"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"

export default function PatientCardSidebar() {
  const { patientId } = useParams<{ patientId: string }>()

  const { data } = useQuery(getPatientOverviewActionOptions(patientId))

  return (
    <Card className="mt-2 py-0 ring-0 group-data-[collapsible=icon]:hidden">
      <CardHeader className="gap-0.5 px-2">
        <CardTitle className="flex items-center gap-1.5">
          <Contact className="size-4" />
          <span className="text-[13px]/relaxed whitespace-nowrap">Patient</span>
        </CardTitle>
        <CardDescription className="whitespace-nowrap">{data?.patient.fullName}</CardDescription>
      </CardHeader>
    </Card>
  )
}
