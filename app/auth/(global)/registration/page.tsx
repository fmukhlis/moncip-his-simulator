import React from "react"
import RegisterPatientForm from "@/components/registration/register-patient-form"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Registration() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card className="relative w-full rounded-sm border py-4 shadow">
        <CardHeader className="px-4 sm:max-w-[calc(100%-250px)]">
          <CardTitle>
            <h1>Patient Registration</h1>
          </CardTitle>
          <CardDescription>
            Fill out the form below to register a new patient. All fields marked with{" "}
            <span className="text-destructive">*</span> are required.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4">
          <RegisterPatientForm />
        </CardContent>
      </Card>
    </div>
  )
}
