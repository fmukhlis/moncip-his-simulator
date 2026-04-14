"use client"

import { toast } from "sonner"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { getCancelEncounterActionOptions } from "@/features/patient-context/api/mutation"
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "../ui/alert-dialog"

export default function CancelEncounterAlertDialog({
  patientId,
  encounterId,
}: {
  patientId: string
  encounterId: string
}) {
  const [open, setOpen] = useState(false)

  const mutation = useMutation(getCancelEncounterActionOptions())

  const handleCancelEncounter = async () => {
    try {
      await mutation.mutateAsync({ encounterId, patientId })
      setOpen(false)
      toast.success("Encounter cancelled successfully")
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={mutation.isPending}>
          Cancel Encounter
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel encounter?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will cancel the encounter. A cancelled encounter cannot be changed back to active or marked as
            completed later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Back</AlertDialogCancel>
          <Button onClick={handleCancelEncounter} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <div className="flex items-center gap-1">
                <Spinner />
                Cancelling...
              </div>
            ) : (
              "Yes, cancel encounter"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
