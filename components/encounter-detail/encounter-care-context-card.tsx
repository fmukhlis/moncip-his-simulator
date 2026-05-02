import { EncounterDetail } from "@/features/encounter/encounter.type"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export default function EncounterCareContextCard({ encounter }: { encounter: EncounterDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Care Context</CardTitle>
        <CardDescription>Unit and provider attached to this encounter.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-muted-foreground">Unit Code</p>
          <div className="font-medium">{encounter.unit.code}</div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Unit Name</p>
          <div className="font-medium">{encounter.unit.name}</div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Provider Code</p>
          <div className="font-medium">{encounter.provider.code}</div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Provider Name</p>
          <div className="font-medium">{encounter.provider.name}</div>
        </div>
      </CardContent>
    </Card>
  )
}
