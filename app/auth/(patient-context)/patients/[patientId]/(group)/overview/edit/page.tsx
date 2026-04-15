import EditPatientForm from "@/components/edit-patient/edit-patient-form"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Edit({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card className="relative w-full py-4 shadow">
        <CardHeader className="px-4 sm:max-w-[calc(100%-250px)]">
          <CardTitle>
            <h1>Edit Patient</h1>
          </CardTitle>
          <CardDescription>
            Update patient demographic, identity, and contact information. All fields marked with{" "}
            <span className="text-destructive">*</span> are required.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4">
          <EditPatientForm patientId={patientId} />
        </CardContent>
      </Card>
    </div>
  )
}
