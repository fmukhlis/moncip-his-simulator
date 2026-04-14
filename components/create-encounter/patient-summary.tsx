"use client"

import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { getGetPatientDetailActionOptions } from "@/features/patient-context/api/query"
import { formatAge } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Field, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

const GENDER_LABEL = {
  M: "Male",
  F: "Female",
}

export default function PatientSummary({ patientId }: { patientId: string }) {
  const { data: patient } = useQuery(getGetPatientDetailActionOptions({ patientId }))

  const [patientAge, setPatientAge] = useState("")
  const [patientBirthDate, setPatientBirthDate] = useState("")

  useEffect(() => {
    const birthDate = patient?.birthDate ? new Date(patient.birthDate) : null
    setPatientAge(birthDate ? formatAge(birthDate) : "")
    setPatientBirthDate(birthDate ? format(birthDate, "dd MMM yyyy") : "")
  }, [setPatientBirthDate, patient?.birthDate, formatAge, format])

  if (!patient) {
    return <></>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">Patient Summary</CardTitle>
        <CardDescription>Encounter will be created for this patient.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Readonly</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input value={patient.fullName} readOnly />
          </Field>

          <Field>
            <FieldLabel>MRN</FieldLabel>
            <Input value={`MRN-${patient.mrnNumber.toString().padStart(6, "0")}`} readOnly />
          </Field>

          <Field>
            <FieldLabel>Sex</FieldLabel>
            <Input value={GENDER_LABEL[patient.sex]} readOnly />
          </Field>

          <Field>
            <FieldLabel>Birth Date</FieldLabel>
            <Input value={patientBirthDate} readOnly />
          </Field>

          <Field>
            <FieldLabel>Age</FieldLabel>
            <Input value={patientAge} readOnly />
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}
