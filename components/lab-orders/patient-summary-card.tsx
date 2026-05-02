import { Mars } from "lucide-react"
import { PatientDetail } from "@/features/patient/patient.type"
import { formatAge } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

const GENDER_LABEL = {
  M: "Male",
  F: "Female",
}

export default function PatientSummaryCard({ patient }: { patient: PatientDetail }) {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle className="text-base">Patient Summary</CardTitle>
        <CardDescription>A brief summary of the patient in the current context.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center border">
              <Mars className="size-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-sm font-semibold">{patient.fullName}</div>
              <div>MRN-{patient.mrnNumber.toString().padStart(6, "0")}</div>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="tracking-[0.14em] uppercase">Sex</p>
              <p>{GENDER_LABEL[patient.sex]}</p>
            </div>
            <div>
              <p className="tracking-[0.14em] uppercase">Age</p>
              <p>{formatAge(new Date(patient.birthDate))}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
