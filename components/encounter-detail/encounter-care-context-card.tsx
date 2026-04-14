"use client"

import { useQuery } from "@tanstack/react-query"
import { getCachedGetEncounterDetailActionOptions } from "@/features/patient-context/api/query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export default function EncounterCareContextCard({
  patientId,
  encounterId,
}: {
  patientId: string
  encounterId: string
}) {
  const { data } = useQuery(getCachedGetEncounterDetailActionOptions({ patientId, encounterId }))

  if (!data) {
    return <></>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Care Context</CardTitle>
        <CardDescription>Unit and provider attached to this encounter.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-muted-foreground">Unit Code</p>
          <div className="font-medium">{data.unit.code}</div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Unit Name</p>
          <div className="font-medium">{data.unit.name}</div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Provider Code</p>
          <div className="font-medium">{data.provider.code}</div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Provider Name</p>
          <div className="font-medium">{data.provider.name}</div>
        </div>
      </CardContent>
    </Card>
  )
}
