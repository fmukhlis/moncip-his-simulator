"use client"

import { useQuery } from "@tanstack/react-query"
import { getGetEncounterDetailActionOptions } from "@/features/encounter/encounter.api"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import ClientDateTimeText from "../ui/client-date-time-text"

export default function EncounterMetadataCard({ patientId, encounterId }: { patientId: string; encounterId: string }) {
  const { data: encounter } = useQuery(getGetEncounterDetailActionOptions({ patientId, id: encounterId }))

  if (!encounter) {
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
          <div className="font-medium">{encounter.id}</div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Created At</p>
          <div className="font-medium">
            <ClientDateTimeText formatStr="dd MMM yyyy, HH:mm" dateTime={encounter.createdAt} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Updated At</p>
          <div className="font-medium">
            <ClientDateTimeText formatStr="dd MMM yyyy, HH:mm" dateTime={encounter.updatedAt} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
