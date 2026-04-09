"use client"

import z from "zod"
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "../ui/spinner"
import { Textarea } from "../ui/textarea"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CreateEncounterActionSchema } from "@/features/patient-context/schema"
import { getCreateEncounterActionOptions } from "@/features/patient-context/api/mutation"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { getGetCreateEncounterPageDataActionOptions } from "@/features/patient-context/api/query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/field"

const encounterTypeOptions = [
  { value: "OPD", label: "Outpatient" },
  { value: "IPD", label: "Inpatient" },
  { value: "ER", label: "Emergency" },
]

const coverageTypeOptions = [
  { value: "SELF_PAY", label: "Self Pay" },
  { value: "BPJS", label: "BPJS" },
  { value: "INSURANCE", label: "Insurance" },
]

export function CreateEncounterForm({ patientId }: { patientId: string }) {
  const { data } = useQuery(getGetCreateEncounterPageDataActionOptions(patientId))

  const mutation = useMutation(getCreateEncounterActionOptions())

  const form = useForm({
    resolver: zodResolver(CreateEncounterActionSchema),
    defaultValues: {
      reason: "",
      unitId: "",
      patientId,
      providerId: "",
      coverageType: "",
      encounterType: "",
    },
  })

  const { control, handleSubmit } = form

  const router = useRouter()

  async function onSubmit(data: z.infer<typeof CreateEncounterActionSchema>) {
    try {
      await mutation.mutateAsync({
        ...data,
      })
      toast.success("Encounter created successfully")
      router.replace(`/auth/patients/${patientId}/encounters`)
    } catch (err) {
      if (err instanceof Error) {
        toast.error("Something went wrong", { description: err.message })
      } else {
        toast.error("Something went wrong", {
          description: "An unexpected error occurred.",
        })
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">Create Encounter</CardTitle>
        <CardDescription>
          All fields marked with <span className="text-destructive">*</span> are required for encounter creation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, console.log)}>
          <FieldGroup>
            {mutation.isError && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Unable to create encounter</AlertTitle>
                <AlertDescription>{mutation.error.message}</AlertDescription>
              </Alert>
            )}

            <FieldSet>
              <FieldLegend variant="label">Encounter Basics</FieldLegend>
              <FieldDescription>Core encounter information.</FieldDescription>
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="encounterType"
                  render={({ field: { onChange, value }, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="encounter-type">
                        Encounter Type<span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger id="encounter-type">
                          <SelectValue placeholder="Select encounter type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {encounterTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                  control={control}
                />
                <Field>
                  <FieldLabel htmlFor="encounter-status">Status</FieldLabel>
                  <Input id="encounter-status" value="ACTIVE" readOnly />
                </Field>
                <Field>
                  <FieldLabel htmlFor="encounter-datetime">Encounter Date &amp; Time</FieldLabel>
                  <Input id="encounter-datetime" value="Automatically assigned on create" readOnly />
                </Field>
                <Field>
                  <FieldLabel htmlFor="encounter-number">Encounter Number</FieldLabel>
                  <Input id="encounter-number" value="Automatically generated after save" readOnly />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend variant="label">Care Context</FieldLegend>
              <FieldDescription>Basic care location and provider assignment.</FieldDescription>
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <Controller
                  name={"unitId"}
                  render={({ field: { onChange, value }, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="unit">
                        Unit<span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                  control={control}
                />

                <Controller
                  name="providerId"
                  render={({ field: { onChange, value }, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="provider">
                        Provider / Doctor<span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger id="provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.providers.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                  control={control}
                />

                <Controller
                  name="coverageType"
                  render={({ field: { onChange, value }, fieldState }) => (
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor="coverage-type">
                        Coverage Type<span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger id="coverage-type">
                          <SelectValue placeholder="Select coverage type" />
                        </SelectTrigger>
                        <SelectContent>
                          {coverageTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                  control={control}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend variant="label">Clinical Context</FieldLegend>
              <FieldDescription>Keep this short. This is not a diagnosis workflow.</FieldDescription>

              <FieldGroup>
                <Controller
                  name="reason"
                  render={({ field: { onChange, value }, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="reason">Reason</FieldLabel>
                      <Textarea
                        id="reason"
                        value={value}
                        onChange={onChange}
                        className="min-h-28"
                        placeholder="Example: Fever for 3 days and clinician requests further evaluation."
                      />
                      <FieldDescription>Enter a short reason for this encounter.</FieldDescription>
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                  control={control}
                />
              </FieldGroup>
            </FieldSet>

            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" asChild>
                <Link href={`/auth/patients/${patientId}/encounters`}>Cancel</Link>
              </Button>
              <Button type="submit" className="sm:w-[150px]">
                {mutation.isPending ? <Spinner className="size-5" /> : "Create Encounter"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
