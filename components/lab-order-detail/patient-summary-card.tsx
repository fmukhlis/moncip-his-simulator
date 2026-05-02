import { LabOrderDetail } from "@/features/lab-order/lab-order.type"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import ClientDateTimeText from "../ui/client-date-time-text"
import { Separator } from "../ui/separator"

const GENDER_LABEL = {
  M: "Male",
  F: "Female",
}

const ENCOUNTER_TYPE_LABEL = {
  IPD: "Inpatient",
  OPD: "Outpatient",
  ER: "Emergency",
}

export default function PatientSummaryCard({ labOrder }: { labOrder: LabOrderDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Summary</CardTitle>
        <CardDescription>Patient and encounter context linked to this order.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border p-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold">{labOrder.patient.fullName}</p>
            <p className="text-muted-foreground">MRN-{labOrder.patient.mrnNumber.toString().padStart(6, "0")}</p>
          </div>
          <Separator className="my-3" />
          <dl className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Date of Birth</dt>
              <dd className="font-medium">
                <ClientDateTimeText dateTime={labOrder.patient.birthDate} formatStr={"dd MMM yyyy"} placeholder="—" />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Sex</dt>
              <dd className="font-medium">{GENDER_LABEL[labOrder.patient.sex]}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Encounter Type</dt>
              <dd className="font-medium">{ENCOUNTER_TYPE_LABEL[labOrder.encounter.type]}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Department</dt>
              <dd className="font-medium">{labOrder.encounter.unit.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Coverage</dt>
              <dd className="font-medium">{labOrder.encounter.coverageType}</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">No Allergy Alert</Badge>
          <Badge variant="outline">No Special Restriction</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
