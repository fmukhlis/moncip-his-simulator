"use client"


import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { ExternalLink, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getGetActiveEncounterActionOptions } from "@/features/patient-context/api/query"

const ENCOUNTER_TYPE_LABEL = {
  ER: "Emergency",
  IPD: "Inpatient",
  OPD: "Outpatient",
}

export function ActiveEncounter({ patientId }: { patientId: string }) {
  const { data: activeEncounter } = useQuery(getGetActiveEncounterActionOptions({ patientId }))

  const [encounterDateTime, setEncounterDateTime] = useState<string>("—")

  useEffect(() => {
    setEncounterDateTime(activeEncounter?.dateTime ? format(activeEncounter.dateTime, "dd MMM yyyy, HH:mm") : "—")
  }, [activeEncounter?.dateTime])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-semibold">Active Encounter</CardTitle>
      </CardHeader>
      {!activeEncounter ? (
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-start gap-1">
              <p className="flex gap-2 font-semibold">
                <span>No active encounter</span>
              </p>
              <p className="flex items-center gap-1">
                <span>This patient is not currently in care.</span>
              </p>
              <Button className="mt-2 flex items-center gap-2" asChild>
                <Link href={`/auth/patients/${patientId}/encounters/create`}>
                  <Plus className="size-4" /> Create New Encounter
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
                <div className="flex flex-col gap-1">
                  <p className="flex gap-2">
                    <span className="w-[200px]">{activeEncounter.no}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="w-[200px]">{ENCOUNTER_TYPE_LABEL[activeEncounter.type]}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p>
                    <span className="w-[200px]">{encounterDateTime}</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="w-[200px]">{activeEncounter.unit.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex gap-2 font-semibold">Reason for Visit</p>
                <p>{activeEncounter.reason ?? "—"}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex gap-2 font-semibold">Attending Physician</p>
                <p>{activeEncounter.provider.name}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button disabled>
              <Plus />
              Order Lab For This Encounter
            </Button>
            <Button asChild>
              <Link href={`/auth/patients/${patientId}/encounters/${activeEncounter.id}`}>
                <ExternalLink />
                View Details
              </Link>
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
