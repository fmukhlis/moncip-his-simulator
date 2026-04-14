import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export default function EncounterLabOrdersCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Reserved for future encounter-based order workflow.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" disabled>
              Create Order
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground">Clinical orders and lab orders are not shown yet in this phase.</p>
      </CardContent>
    </Card>
  )
}
