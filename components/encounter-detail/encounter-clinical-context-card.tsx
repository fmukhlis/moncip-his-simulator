"use client"

import { useQuery } from "@tanstack/react-query"
import { getCachedGetEncounterDetailActionOptions } from "@/features/patient-context/api/query"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function EncounterClinicalContextCard({
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
        <CardTitle>Clinical Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-muted-foreground">Reason</p>
          <p className="leading-6">{data.reason || "No reason recorded"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
