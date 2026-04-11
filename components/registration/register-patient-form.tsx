"use client"

import React from "react"

import { z } from "zod"
import { Input } from "../ui/input"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Calendar } from "../ui/calendar"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, startOfDay } from "date-fns"
import { Controller, useForm } from "react-hook-form"
import { CreatePatientFormSchema } from "@/features/registration/schema"
import { getCreatePatientActionOptions } from "@/features/registration/api/mutation"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export default function RegisterPatientForm() {
  const mutation = useMutation(getCreatePatientActionOptions())

  const form = useForm({
    resolver: zodResolver(CreatePatientFormSchema),
    defaultValues: {
      fullName: "",
      sex: "M",
      address: "",
      birthDate: startOfDay(new Date()),
      email: "",
      nationalId: "",
      phone: "",
    },
  })

  const { control, handleSubmit } = form

  const router = useRouter()

  const [birthDateCalendarOpen, setBirthDateCalendarOpen] = React.useState(false)

  const onSubmit = async (data: z.infer<typeof CreatePatientFormSchema>) => {
    try {
      const res = await mutation.mutateAsync(data)
      form.reset()
      toast.success("Patient created successfully")
      router.replace(`/auth/patients/${res.id}/overview`)
    } catch (err) {
      if (err instanceof Error) {
        toast.error("Something went wrong", { description: err.message })
      } else {
        toast.error("Something went wrong", { description: "An unexpected error occurred." })
      }
    }
  }

  return (
    <form id="create-patient-form" onSubmit={handleSubmit(onSubmit)}>
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
                    <FieldLabel htmlFor="create-patient-full-name">
                      Full Name<span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="create-patient-full-name"
                      value={value}
                      required
                      onChange={(e) => {
                        onChange(e.target.value)
                      }}
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
                      <FieldLabel htmlFor="add-patient-manual-sex">
                        Sex<span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger
                          id="add-patient-manual-sex"
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
                  render={({ field: { value, onChange }, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-3 gap-2">
                      <FieldLabel htmlFor="create-patient-birth-date">
                        Birth Date<span className="text-destructive">*</span>
                      </FieldLabel>
                      <Popover open={birthDateCalendarOpen} onOpenChange={setBirthDateCalendarOpen}>
                        <PopoverTrigger aria-invalid={fieldState.invalid} asChild>
                          <Button variant="outline" id="date" className="justify-start font-normal">
                            {value instanceof Date ? format(value, "dd MMMM yyyy") : "Select date..."}
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
                  control={control}
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
              render={({ field: { value, onChange }, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation={"responsive"} className="!items-start gap-x-3">
                  <FieldLabel htmlFor="create-patient-national-id" className="mt-0 !grow-0 @md/field-group:mt-2">
                    National ID (NIK)
                  </FieldLabel>
                  <div className="flex grow flex-col gap-2">
                    <Input
                      id="create-patient-national-id"
                      value={(value as string | undefined) ?? ""}
                      onChange={(e) => {
                        onChange(e.target.value)
                      }}
                      className="grow"
                      placeholder="16 digit national ID"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                </Field>
              )}
              control={control}
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
                render={({ field: { value, onChange }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation={"responsive"} className="!items-start gap-x-3">
                    <FieldLabel htmlFor="create-patient-phone" className="mt-0 !grow-0 @md/field-group:mt-2">
                      Phone
                    </FieldLabel>
                    <div className="flex grow flex-col gap-2">
                      <Input
                        id="create-patient-phone"
                        value={(value as string | undefined) ?? ""}
                        onChange={(e) => {
                          onChange(e.target.value)
                        }}
                        className="grow"
                        placeholder="08123456789"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  </Field>
                )}
                control={control}
              />
              <Controller
                name="email"
                render={({ field: { value, onChange }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation={"responsive"} className="!items-start gap-x-3">
                    <FieldLabel htmlFor="create-patient-email" className="mt-0 !grow-0 @md/field-group:mt-2">
                      Email
                    </FieldLabel>
                    <div className="flex grow flex-col gap-2">
                      <Input
                        id="create-patient-email"
                        value={(value as string | undefined) ?? ""}
                        onChange={(e) => {
                          onChange(e.target.value)
                        }}
                        className="grow"
                        placeholder="patient@email.com"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  </Field>
                )}
                control={control}
              />
            </div>
          </FieldGroup>
        </FieldSet>
        <Field className="col-span-1">
          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending} className="sm:w-[150px]">
              {mutation.isPending ? <Spinner className="size-5" /> : "Register Patient"}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}
