"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EncounterDetail } from "@/features/encounter/encounter.type"
import { getCreateLabOrderActionOptions } from "@/features/lab-order/lab-order.api"
import { CreateLabOrderActionSchema } from "@/features/lab-order/lab-order.validation"
import { PatientDetail } from "@/features/patient/patient.type"
import CollectionAndHandlingCard from "./collection-and-handling-card"
import OrderInformationCard from "./order-information-card"
import OrderSummaryCard from "./order-summary-card"
import PatientSummaryCard from "./patient-summary-card"
import RequestedTestsCard from "./requested-tests-card"
import { Spinner } from "../ui/spinner"

export function NewLabOrderForm({ patient, encounter }: { patient: PatientDetail; encounter: EncounterDetail }) {
  const form = useForm<z.infer<typeof CreateLabOrderActionSchema>>({
    resolver: zodResolver(CreateLabOrderActionSchema),
    defaultValues: {
      unitId: "",
      priority: "ROUTINE",
      encounterId: encounter.id,
      clinicalNote: "",
      orderingProviderId: "",
      orderableServiceIds: [],
    },
  })

  const mutation = useMutation(getCreateLabOrderActionOptions())

  const router = useRouter()

  async function onSubmit(data: z.infer<typeof CreateLabOrderActionSchema>) {
    try {
      const res = await mutation.mutateAsync({
        ...data,
      })
      toast.success("Lab. order created successfully")
      router.replace(`/auth/patients/${patient.id}/lab-orders/${res.id}`)
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
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, console.log)}>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-4">
            <OrderInformationCard encounter={encounter} />
            <RequestedTestsCard />
            <CollectionAndHandlingCard />
          </div>
          <div className="space-y-4">
            <PatientSummaryCard patient={patient} encounter={encounter} />
            <OrderSummaryCard />
            <Card>
              <CardContent className="flex flex-col gap-2">
                <Button type="submit" disabled={!form.formState.isValid || mutation.isPending}>
                  {mutation.isPending ? (
                    <div className="flex items-center gap-1">
                      <Spinner />
                      Submitting...
                    </div>
                  ) : (
                    "Submit Lab Order"
                  )}
                </Button>
                <Button type="button" variant="secondary" disabled>
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                  }}
                >
                  Clear Form
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </FormProvider>
    // <Card className="w-full sm:max-w-md">
    //   <CardHeader>
    //     <CardTitle>Bug Report</CardTitle>
    //     <CardDescription>Help us improve by reporting bugs you encounter.</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
    //       <FieldGroup>
    //         <Controller
    //           name="title"
    //           control={form.control}
    //           render={({ field, fieldState }) => (
    //             <Field data-invalid={fieldState.invalid}>
    //               <FieldLabel htmlFor="form-rhf-demo-title">Bug Title</FieldLabel>
    //               <Input
    //                 {...field}
    //                 id="form-rhf-demo-title"
    //                 aria-invalid={fieldState.invalid}
    //                 placeholder="Login button not working on mobile"
    //                 autoComplete="off"
    //               />
    //               {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    //             </Field>
    //           )}
    //         />
    //         <Controller
    //           name="description"
    //           control={form.control}
    //           render={({ field, fieldState }) => (
    //             <Field data-invalid={fieldState.invalid}>
    //               <FieldLabel htmlFor="form-rhf-demo-description">Description</FieldLabel>
    //               <InputGroup>
    //                 <InputGroupTextarea
    //                   {...field}
    //                   id="form-rhf-demo-description"
    //                   placeholder="I'm having an issue with the login button on mobile."
    //                   rows={6}
    //                   className="min-h-24 resize-none"
    //                   aria-invalid={fieldState.invalid}
    //                 />
    //                 <InputGroupAddon align="block-end">
    //                   <InputGroupText className="tabular-nums">{field.value.length}/100 characters</InputGroupText>
    //                 </InputGroupAddon>
    //               </InputGroup>
    //               <FieldDescription>
    //                 Include steps to reproduce, expected behavior, and what actually happened.
    //               </FieldDescription>
    //               {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    //             </Field>
    //           )}
    //         />
    //       </FieldGroup>
    //     </form>
    //   </CardContent>
    //   <CardFooter>
    //     <Field orientation="horizontal">
    //       <Button type="button" variant="outline" onClick={() => form.reset()}>
    //         Reset
    //       </Button>
    //       <Button type="submit" form="form-rhf-demo">
    //         Submit
    //       </Button>
    //     </Field>
    //   </CardFooter>
    // </Card>
  )
}
