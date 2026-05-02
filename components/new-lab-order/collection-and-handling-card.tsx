import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "../ui/field"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"

export default function CollectionAndHandlingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection & Handling</CardTitle>
        <CardDescription>Configure specimen collection and processing instructions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="collection-location">Collection Location</Label>
            <Select defaultValue="phlebotomy-room" disabled>
              <SelectTrigger id="collection-location" className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phlebotomy-room">Phlebotomy Room</SelectItem>
                <SelectItem value="er-bedside">ER Bedside</SelectItem>
                <SelectItem value="inpatient-ward">Inpatient Ward</SelectItem>
                <SelectItem value="outside-lab">Outside Laboratory</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="collector">Collector</Label>
            <Select defaultValue="nurse-1" disabled>
              <SelectTrigger id="collector" className="w-full">
                <SelectValue placeholder="Select collector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nurse-1">Nurse · Ward A</SelectItem>
                <SelectItem value="phleb-1">Phlebotomist · Main Lab</SelectItem>
                <SelectItem value="staff-1">Laboratory Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FieldLabel className="opacity-60">
            <Field orientation="horizontal">
              <Checkbox id="fasting-required" disabled />
              <FieldContent>
                <FieldTitle>Fasting Required</FieldTitle>
                <FieldDescription>Patient should fast before collection.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel className="opacity-60">
            <Field orientation="horizontal">
              <Checkbox id="fasting-required" disabled />
              <FieldContent>
                <FieldTitle>Isolation Precaution</FieldTitle>
                <FieldDescription>Use appropriate PPE during collection.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel className="opacity-60">
            <Field orientation="horizontal">
              <Checkbox id="fasting-required" disabled />
              <FieldContent>
                <FieldTitle>Repeat Order</FieldTitle>
                <FieldDescription>Mark as repeat collection or follow-up test.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel className="opacity-60">
            <Field orientation="horizontal">
              <Checkbox id="fasting-required" disabled />
              <FieldContent>
                <FieldTitle>Add-on Order</FieldTitle>
                <FieldDescription>Add test to an existing specimen if available.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        </div>
        <div className="space-y-2">
          <Label htmlFor="handling-instruction">Handling Instructions</Label>
          <Textarea
            id="handling-instruction"
            className="min-h-24 resize-y"
            disabled
            placeholder="e.g. Keep specimen refrigerated, transport immediately, protect from light..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
