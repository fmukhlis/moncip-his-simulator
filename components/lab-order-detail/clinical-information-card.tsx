import { LabOrderDetail } from "@/features/lab-order/lab-order.type"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export default function ClinicalInformationCard({ labOrder }: { labOrder: LabOrderDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Information</CardTitle>
        <CardDescription>Clinical context submitted with this laboratory order.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border p-3">
          <p className="text-muted-foreground text-xs">Collection Location</p>
          <p className="mt-2 font-medium">Phlebotomy Room</p>
        </div>
        <div className="border p-3">
          <p className="text-muted-foreground text-xs">Clinical Notes</p>
          <p className="mt-2 leading-6">{labOrder.clinicalNote || "No clinical notes provided."}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border p-3">
            <p className="text-muted-foreground text-xs">Fasting Required</p>
            <p className="mt-1 font-medium">No</p>
          </div>
          <div className="border p-3">
            <p className="text-muted-foreground text-xs">Isolation Precaution</p>
            <p className="mt-1 font-medium">No</p>
          </div>
          <div className="border p-3">
            <p className="text-muted-foreground text-xs">Repeat Order</p>
            <p className="mt-1 font-medium">No</p>
          </div>
          <div className="border p-3">
            <p className="text-muted-foreground text-xs">Add-on Order</p>
            <p className="mt-1 font-medium">No</p>
          </div>
        </div>
        <div className="border p-3">
          <p className="text-muted-foreground text-xs">Handling Instructions</p>
          <p className="mt-2 leading-6">{"No handling instructions provided."}</p>
        </div>
      </CardContent>
    </Card>
  )
}
