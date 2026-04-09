"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink, Plus } from "lucide-react"
import { getGetPatientOverviewActionOptions } from "@/features/patient-context/api/query"
import { Card, CardTitle, CardFooter, CardHeader, CardContent } from "@/components/ui/card"

const ENCOUNTER_TYPE_LABEL = {
  ER: "Emergency",
  IPD: "Inpatient",
  OPD: "Outpatient",
}

export function ActiveEncounter({ patientId }: { patientId: string }) {
  const { data } = useQuery(getGetPatientOverviewActionOptions(patientId))

  if (!data) {
    return <div>Data not found</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-semibold">Active Encounter</CardTitle>
      </CardHeader>
      {!data.activeEncounter ? (
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-start gap-1">
              <p className="flex gap-2 font-semibold">
                <span>No active encounter</span>
              </p>
              <p className="flex items-center gap-1">
                <span>This patient is not currently in care.</span>
              </p>
              <Button className="mt-2 flex items-center gap-2">
                <Plus className="size-4" /> Create New Encounter
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
                    <span className="w-[200px]">{data.activeEncounter.encounterNo}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="w-[200px]">{ENCOUNTER_TYPE_LABEL[data.activeEncounter.encounterType]}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p>
                    <span className="w-[200px]">
                      {format(data.activeEncounter.encounterDateTime, "dd MMM yyyy, HH:mm")}
                    </span>
                  </p>
                  <p className="flex gap-2">
                    <span className="w-[200px]">{data.activeEncounter.unit.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex gap-2 font-semibold">Reason for Visit</p>
                <p>{data.activeEncounter.reason ?? "—"}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex gap-2 font-semibold">Attending Physician</p>
                <p>{data.activeEncounter.provider.name}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button disabled>
              <Plus />
              Order Lab For This Encounter
            </Button>
            <Button asChild>
              <Link href={`/auth/patients/${patientId}/encounters/${data.activeEncounter.id}`}>
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
