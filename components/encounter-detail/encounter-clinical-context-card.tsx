import { EncounterDetail } from "@/features/encounter/encounter.type"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function EncounterClinicalContextCard({ encounter }: { encounter: EncounterDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-muted-foreground">Reason</p>
          <p className="leading-6">{encounter.reason || "No reason recorded"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
