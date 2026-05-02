import { PatientDetail } from "@/features/patient/patient.type"
import { Badge } from "../ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import ClientAgeText from "../ui/client-age-text"
import ClientDateTimeText from "../ui/client-date-time-text"
import { Item, ItemContent, ItemDescription, ItemTitle } from "../ui/item"

const GENDER_LABEL = {
  M: "Male",
  F: "Female",
}

export default function PatientSummary({ patient }: { patient: PatientDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">Patient Summary</CardTitle>
        <CardDescription>Encounter will be created for this patient.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Readonly</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Name</ItemTitle>
              <ItemDescription>{patient.fullName}</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>MRN</ItemTitle>
              <ItemDescription>MRN-{patient.mrnNumber.toString().padStart(6, "0")}</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Sex</ItemTitle>
              <ItemDescription>{GENDER_LABEL[patient.sex]}</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Birth Date</ItemTitle>
              <ItemDescription>
                <ClientDateTimeText formatStr="dd MMM yyyy" dateTime={patient.birthDate} />
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Age</ItemTitle>
              <ItemDescription>
                <ClientAgeText birthDate={patient.birthDate} />
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>
      </CardContent>
    </Card>
  )
}
