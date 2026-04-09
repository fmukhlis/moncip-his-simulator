"use client"

import { z } from "zod"
import { Input } from "../ui/input"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Calendar } from "../ui/calendar"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, startOfDay } from "date-fns"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { UpdatePatientFormSchema } from "@/features/patient-context/schema"
import { getUpdatePatientActionOptions } from "@/features/patient-context/api/mutation"
import { getGetPatientOverviewActionOptions } from "@/features/patient-context/api/query"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export default function EditPatientForm({ patientId }: { patientId: string }) {
  const { data } = useQuery(getGetPatientOverviewActionOptions(patientId))

  // Already checked in the layout (see app/auth/(patient-context)/patients/[patientId]/layout.tsx).
  // If patient is not found, it will redirect to 404 even before this component is rendered.
  if (!data) {
    return <div>Data not found</div>
  }

  const { patient } = data

  const mutation = useMutation(getUpdatePatientActionOptions())

  const form = useForm({
    resolver: zodResolver(UpdatePatientFormSchema),
    defaultValues: {
      patientId,
      fullName: patient.fullName,
      sex: patient.sex,
      address: patient.address ?? "",
      birthDate: null,
      email: patient.email ?? "",
      nationalId: patient.nationalId ?? "",
      phone: patient.phone ?? "",
    },
  })

  const { control, handleSubmit, setValue } = form

  const router = useRouter()

  const [birthDateCalendarOpen, setBirthDateCalendarOpen] = useState(false)

  const onSubmit = async (data: z.infer<typeof UpdatePatientFormSchema>) => {
    try {
      await mutation.mutateAsync(data)
      toast.success("Patient updated successfully")
      router.replace(`/auth/patients/${patientId}/overview`)
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

  useEffect(() => {
    setValue("birthDate", startOfDay(patient.birthDate))
  }, [setValue, patient.birthDate])

  return (
    <form id="edit-patient-form" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-3">
        <FieldSet>
          <FieldLegend variant="label" className="font-semibold">
            Basic Information
          </FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
              <Controller
                name="fullName"
                render={({ field: { value, onChange }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-span-1 gap-2">
                    <FieldLabel htmlFor="edit-patient-full-name">
                      Full Name<span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="edit-patient-full-name"
                      value={value}
                      required
                      onChange={(e) => onChange(e.target.value)}
                      placeholder="Enter patient's full name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
                control={control}
              />
              <div className="col-span-1 grid grid-cols-[repeat(auto-fit,minmax(30px,1fr))] gap-3">
                <Controller
                  name="sex"
                  render={({ field: { value, onChange }, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-2 gap-2">
                      <FieldLabel htmlFor="edit-patient-sex">
                        Sex<span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger
                          id="edit-patient-sex"
                          className="w-full max-w-48"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select sex..." />
                        </SelectTrigger>
                        <SelectContent position="popper" className="w-full" align="center">
                          <SelectGroup>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                  control={control}
                />
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field: { value, onChange }, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-3 gap-2">
                      <FieldLabel htmlFor="edit-patient-birth-date">
                        Birth Date<span className="text-destructive">*</span>
                      </FieldLabel>
                      <Popover open={birthDateCalendarOpen} onOpenChange={setBirthDateCalendarOpen}>
                        <PopoverTrigger aria-invalid={fieldState.invalid} asChild>
                          <Button
                            type="button"
                            variant="outline"
                            id="edit-patient-birth-date"
                            className="justify-start font-normal"
                          >
                            {value instanceof Date ? format(value, "d MMMM yyyy") : "Select date..."}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0">
                          <Calendar
                            mode="single"
                            selected={value instanceof Date ? value : undefined}
                            defaultMonth={value instanceof Date ? value : undefined}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              onChange(date)
                              setBirthDateCalendarOpen(false)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </div>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label" className="font-semibold">
            Identity
          </FieldLegend>
          <FieldGroup>
            <Controller
              name="nationalId"
              control={control}
              render={({ field: { value, onChange }, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation="responsive" className="!items-start gap-x-3">
                  <FieldLabel htmlFor="edit-patient-national-id" className="mt-0 !grow-0 @md/field-group:mt-2">
                    National ID (NIK)
                  </FieldLabel>
                  <div className="flex grow flex-col gap-2">
                    <Input
                      id="edit-patient-national-id"
                      value={(value as string | undefined) ?? ""}
                      onChange={(e) => onChange(e.target.value)}
                      className="grow"
                      placeholder="16 digit national ID"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label" className="font-semibold">
            Contact
          </FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
              <Controller
                name="phone"
                control={control}
                render={({ field: { value, onChange }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation="responsive" className="!items-start gap-x-3">
                    <FieldLabel htmlFor="edit-patient-phone" className="mt-0 !grow-0 @md/field-group:mt-2">
                      Phone
                    </FieldLabel>
                    <div className="flex grow flex-col gap-2">
                      <Input
                        id="edit-patient-phone"
                        value={(value as string | undefined) ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                        className="grow"
                        placeholder="08123456789"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field: { value, onChange }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation="responsive" className="!items-start gap-x-3">
                    <FieldLabel htmlFor="edit-patient-email" className="mt-0 !grow-0 @md/field-group:mt-2">
                      Email
                    </FieldLabel>
                    <div className="flex grow flex-col gap-2">
                      <Input
                        id="edit-patient-email"
                        value={(value as string | undefined) ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                        className="grow"
                        placeholder="patient@email.com"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label" className="font-semibold">
            Address
          </FieldLegend>
          <FieldGroup>
            <Controller
              name="address"
              control={control}
              render={({ field: { value, onChange }, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation="responsive" className="!items-start gap-x-3">
                  <FieldLabel htmlFor="edit-patient-address" className="mt-0 !grow-0 @md/field-group:mt-2">
                    Address
                  </FieldLabel>
                  <div className="flex grow flex-col gap-2">
                    <Input
                      id="edit-patient-address"
                      value={(value as string | undefined) ?? ""}
                      onChange={(e) => onChange(e.target.value)}
                      className="grow"
                      placeholder="Enter patient's address"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
        <Field className="col-span-1">
          <div className="flex flex-col justify-end gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="sm:w-[150px]"
              onClick={() => router.push(`/auth/patients/${patientId}/overview`)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="sm:w-[150px]">
              {mutation.isPending ? <Spinner className="size-5" /> : "Save Changes"}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}
