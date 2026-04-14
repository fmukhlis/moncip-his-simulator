"use client"

import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getCachedGetEncounterDetailActionOptions } from "@/features/patient-context/api/query"
import { EncounterStatus } from "@/generated/prisma/enums"
import CancelEncounterAlertDialog from "./cancel-encounter-alert-dialog"
import CompleteEncounterAlertDialog from "./complete-encounter-alert-dialog"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

function getStatusDescription(status: EncounterStatus) {
  switch (status) {
    case "ACTIVE":
      return "This encounter is currently active and can still be used for future clinical workflows."
    case "COMPLETED":
      return "This encounter has been completed and is no longer active for new actions."
    case "CANCELLED":
      return "This encounter has been cancelled and should not be used for clinical workflows."
  }
}

function getStatusBadgeVariant(status: EncounterStatus) {
  switch (status) {
    case "ACTIVE":
      return "default"
    case "COMPLETED":
      return "secondary"
    case "CANCELLED":
      return "destructive"
  }
}

function formatDateTime(date: Date | null) {
  if (!date) return "Encounter Date & Time"
  return format(date, "dd MMM yyyy, HH:mm")
}

const COVERAGE_TYPE_LABEL = {
  SELF_PAY: "Self Pay",
  BPJS: "BPJS",
  INSURANCE: "Insurance",
}

const ENCOUNTER_TYPE_LABEL = {
  OPD: "Outpatient",
  IPD: "Inpatient",
  ER: "Emergency",
}

export default function EncounterDetailHeader({ patientId, encounterId }: { patientId: string; encounterId: string }) {
  const { data } = useQuery(getCachedGetEncounterDetailActionOptions({ patientId, encounterId }))

  const [encounterDateTime, setEncounterDateTime] = useState<string | undefined>("")

  useEffect(() => {
    setEncounterDateTime(data?.dateTime)
  }, [data?.dateTime])

  if (!data) {
    return <></>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-xl">{data.no}</CardTitle>
              <Badge variant={getStatusBadgeVariant(data.status)}>{data.status}</Badge>
            </div>
            <CardDescription>
              {ENCOUNTER_TYPE_LABEL[data.type]} •{" "}
              {formatDateTime(encounterDateTime ? new Date(encounterDateTime) : null)}
            </CardDescription>
          </div>
          {data.status === "ACTIVE" && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href={`/auth/patients/${patientId}/encounters/${encounterId}/edit`}>Edit Encounter</Link>
              </Button>
              <CompleteEncounterAlertDialog patientId={patientId} encounterId={encounterId} />
              <CancelEncounterAlertDialog patientId={patientId} encounterId={encounterId} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 px-0.5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1">
            <p className="text-muted-foreground">Sequence</p>
            <div className="font-medium">{`#${data.sequence}`}</div>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Coverage Type</p>
            <div className="font-medium">{COVERAGE_TYPE_LABEL[data.coverageType]}</div>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Unit</p>
            <div className="font-medium">{data.unit.name}</div>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Provider</p>
            <div className="font-medium">{data.provider.name}</div>
          </div>
        </div>
        <div className="bg-muted/40 text-muted-foreground border px-3 py-2">{getStatusDescription(data.status)}</div>
      </CardContent>
    </Card>
  )
}
