"use client"

import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { getCachedGetEncounterDetailActionOptions } from "@/features/patient-context/api/query"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

function formatDateTime(date: Date | null) {
  if (!date) return "Encounter Date & Time"
  return format(date, "dd MMM yyyy, HH:mm")
}

export default function EncounterMetadataCard({ patientId, encounterId }: { patientId: string; encounterId: string }) {
  const { data } = useQuery(getCachedGetEncounterDetailActionOptions({ patientId, encounterId }))

  const [encounterCreatedAt, setEncounterCreatedAt] = useState<string | undefined>("")
  const [encounterUpdatedAt, setEncounterUpdatedAt] = useState<string | undefined>("")

  useEffect(() => {
    setEncounterCreatedAt(data?.createdAt)
    setEncounterUpdatedAt(data?.updatedAt)
  }, [data?.createdAt, data?.updatedAt])

  if (!data) {
    return <></>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-1">
          <p className="text-muted-foreground">Encounter ID</p>
          <div className="font-medium">{data.id}</div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Created At</p>
          <div className="font-medium">{formatDateTime(encounterCreatedAt ? new Date(encounterCreatedAt) : null)}</div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Updated At</p>
          <div className="font-medium">{formatDateTime(encounterUpdatedAt ? new Date(encounterUpdatedAt) : null)}</div>
        </div>
      </CardContent>
    </Card>
  )
}
