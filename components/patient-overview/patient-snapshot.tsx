"use client"

import { Mars } from "lucide-react"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { formatAge } from "@/lib/utils"
import { PatientActionsMenu } from "./patient-actions-menu"
import { useEffect, useState } from "react"
import { Card, CardTitle, CardAction, CardFooter, CardHeader, CardContent } from "@/components/ui/card"
import {
  getGetLastEncounterActionOptions,
  getGetPatientDetailActionOptions,
  getGetPatientEncountersCountActionOptions,
} from "@/features/patient-context/api/query"

const GENDER_LABEL = {
  M: "Male",
  F: "Female",
}

export function PatientSnapshot({ patientId }: { patientId: string }) {
  const { data: patient } = useQuery(getGetPatientDetailActionOptions({ patientId }))
  const { data: lastEncounter } = useQuery(getGetLastEncounterActionOptions({ patientId }))
  const { data: encountersCount } = useQuery(getGetPatientEncountersCountActionOptions({ patientId }))

  const [lastEncounterDateTime, setLastEncounterDateTime] = useState("—")

  useEffect(() => {
    setLastEncounterDateTime(lastEncounter?.dateTime ? format(lastEncounter.dateTime, "dd MMM yyyy, HH:mm") : "—")
  }, [lastEncounter?.dateTime])

  if (!patient) {
    return <></>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-semibold">Patient Snapshot</CardTitle>
        <CardAction>
          <PatientActionsMenu patientId={patientId} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
            <div className="flex flex-col gap-1">
              <p className="flex gap-2">
                <span className="w-[200px]">{patient.fullName}</span>
              </p>
              <p className="flex items-center gap-1">
                <Mars className="size-3.5" />
                <span className="">{GENDER_LABEL[patient.sex]}</span>
                <span className="">,</span>
                <span className="w-[200px]">{formatAge(new Date(patient.birthDate))}</span>
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="flex gap-2">
                <span className="w-[50px] shrink-0">MRN</span>
                <span className="w-[5px] shrink-0">:</span>
                <span className="w-[200px]">MRN-{patient.mrnNumber.toString().padStart(6, "0")}</span>
              </p>
              <p className="flex gap-2">
                <span className="w-[50px] shrink-0">NIK</span>
                <span className="w-[5px] shrink-0">:</span>
                <span className="w-[200px]">{patient.nationalId ?? "-"}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
              <p className="flex gap-2">
                <span className="w-[50px] shrink-0">Phone</span>
                <span className="w-[5px] shrink-0">:</span>
                <span className="w-[200px]">{patient.phone ?? "-"}</span>
              </p>
              <p className="flex gap-2">
                <span className="w-[50px] shrink-0">Email</span>
                <span className="w-[5px] shrink-0">:</span>
                <span className="w-[200px]">{patient.email ?? "-"}</span>
              </p>
            </div>
            <p className="flex gap-2">
              <span className="w-[50px] shrink-0">Address</span>
              <span className="w-[5px] shrink-0">:</span>
              <span>{patient.address ?? "-"}</span>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
          <p className="flex gap-2">
            <span className="w-[100px] shrink-0">Last Visit</span>
            <span className="w-[5px] shrink-0">:</span>
            <span className="w-[200px]">{lastEncounterDateTime}</span>
          </p>
          <p className="flex gap-2">
            <span className="w-[100px] shrink-0">Total Encounters</span>
            <span className="w-[5px] shrink-0">:</span>
            <span className="w-[200px]">{encountersCount}</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
