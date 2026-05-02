import { Mars } from "lucide-react"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PatientDetail } from "@/features/patient/patient.type"
import { PatientActionsMenu } from "./patient-actions-menu"
import ClientAgeText from "../ui/client-age-text"
import ClientDateTimeText from "../ui/client-date-time-text"

const GENDER_LABEL = {
  M: "Male",
  F: "Female",
}

export function PatientSnapshot({
  patient,
  encountersCount,
  lastEncounterDateTime,
}: {
  patient: PatientDetail
  encountersCount: number
  lastEncounterDateTime?: string
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-semibold">Patient Snapshot</CardTitle>
        <CardAction>
          <PatientActionsMenu patientId={patient.id} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
            <div className="flex flex-col gap-1">
              <p className="flex gap-2">
                <span className="w-[200px]">{patient.fullName}</span>
              </p>
              <p className="flex items-center gap-1">
                <Mars className="size-3.5" />
                <span className="">{GENDER_LABEL[patient.sex]}</span>
                <span className="">,</span>
                <span className="w-[200px]">
                  <ClientAgeText birthDate={patient.birthDate} />
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="flex gap-2">
                <span className="w-[50px] shrink-0">MRN</span>
                <span className="w-[5px] shrink-0">:</span>
                <span className="w-[200px]">MRN-{patient.mrnNumber.toString().padStart(6, "0")}</span>
              </p>
              <p className="flex gap-2">
                <span className="w-[50px] shrink-0">NIK</span>
                <span className="w-[5px] shrink-0">:</span>
                <span className="w-[200px]">{patient.nationalId ?? "—"}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
              <p className="flex gap-2">
                <span className="w-[50px] shrink-0">Phone</span>
                <span className="w-[5px] shrink-0">:</span>
                <span className="w-[200px]">{patient.phone ?? "—"}</span>
              </p>
              <p className="flex gap-2">
                <span className="w-[50px] shrink-0">Email</span>
                <span className="w-[5px] shrink-0">:</span>
                <span className="w-[200px]">{patient.email ?? "—"}</span>
              </p>
            </div>
            <p className="flex gap-2">
              <span className="w-[50px] shrink-0">Address</span>
              <span className="w-[5px] shrink-0">:</span>
              <span>{patient.address ?? "—"}</span>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
          <p className="flex gap-2">
            <span className="w-[100px] shrink-0">Last Visit</span>
            <span className="w-[5px] shrink-0">:</span>
            <span className="w-[200px]">
              <ClientDateTimeText dateTime={lastEncounterDateTime} formatStr="dd MMM yyyy, HH.mm" />
            </span>
          </p>
          <p className="flex gap-2">
            <span className="w-[100px] shrink-0">Total Encounters</span>
            <span className="w-[5px] shrink-0">:</span>
            <span className="w-[200px]">{encountersCount}</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
