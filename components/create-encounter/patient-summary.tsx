"use client"

import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { formatAge } from "@/lib/utils"
import { Field, FieldLabel } from "../ui/field"
import { getGetCreateEncounterPageDataActionOptions } from "@/features/patient-context/api/query"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export default function PatientSummary({ patientId }: { patientId: string }) {
  const { data } = useQuery(getGetCreateEncounterPageDataActionOptions(patientId))

  if (!data) {
    return <div>Data not found</div>
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
            <Input value={data.patient.fullName} readOnly />
          </Field>

          <Field>
            <FieldLabel>MRN</FieldLabel>
            <Input value={`MRN-${data.patient.mrnNumber.toString().padStart(6, "0")}`} readOnly />
          </Field>

          <Field>
            <FieldLabel>Sex</FieldLabel>
            <Input value={data.patient.sex === "M" ? "Male" : "Female"} readOnly />
          </Field>

          <Field>
            <FieldLabel>Birth Date</FieldLabel>
            <Input value={format(new Date(data.patient.birthDate), "dd MMM yyyy")} readOnly />
          </Field>

          <Field>
            <FieldLabel>Age</FieldLabel>
            <Input value={formatAge(new Date(data.patient.birthDate))} readOnly />
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}
