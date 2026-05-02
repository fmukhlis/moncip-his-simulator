"use client"

import { format } from "date-fns"
import { useEffect, useState } from "react"
import { EncounterDetail } from "@/features/encounter/encounter.type"
import { PatientDetail } from "@/features/patient/patient.type"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

const GENDER_LABEL = {
  M: "Male",
  F: "Female",
}

const ENCOUNTER_TYPE_LABEL = {
  IPD: "Inpatient",
  OPD: "Outpatient",
  ER: "Emergency",
}

export default function PatientSummaryCard({
  patient,
  encounter,
}: {
  patient: PatientDetail
  encounter: EncounterDetail
}) {
  const [patientBirthDateUI, setPatientBirthDateUI] = useState("-")

  useEffect(() => {
    setPatientBirthDateUI(patient.birthDate ? format(patient.birthDate, "dd MMM yyyy") : "-")
  }, [patient.birthDate, setPatientBirthDateUI])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Summary</CardTitle>
        <CardDescription>Confirm patient and encounter context before submitting.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border p-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold">{patient.fullName}</p>
            <p className="text-muted-foreground">MRN-{patient.mrnNumber.toString().padStart(6, "0")}</p>
          </div>
          <Separator className="my-3" />
          <dl className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Date of Birth</dt>
              <dd className="font-medium">{patientBirthDateUI}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Sex</dt>
              <dd className="font-medium">{GENDER_LABEL[patient.sex]}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Encounter Type</dt>
              <dd className="font-medium">{ENCOUNTER_TYPE_LABEL[encounter.type]}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Department</dt>
              <dd className="font-medium">{encounter.unit.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Coverage</dt>
              <dd className="font-medium">{encounter.coverageType}</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">No Allergy Alert</Badge>
          <Badge variant="outline">No Special Restriction</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
