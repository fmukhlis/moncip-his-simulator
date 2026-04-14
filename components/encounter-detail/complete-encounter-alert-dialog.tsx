"use client"

import { toast } from "sonner"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { getCompleteEncounterActionOptions } from "@/features/patient-context/api/mutation"
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

export default function MarkAsCompletedAlertDialog({
  patientId,
  encounterId,
}: {
  patientId: string
  encounterId: string
}) {
  const [open, setOpen] = useState(false)

  const mutation = useMutation(getCompleteEncounterActionOptions())

  const handleCompleteEncounter = async () => {
    try {
      await mutation.mutateAsync({ encounterId, patientId })
      setOpen(false)
      toast.success("Encounter marked as completed successfully")
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
        <Button variant="secondary" disabled={mutation.isPending}>
          Mark as Completed
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark encounter as completed?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will mark the encounter as completed. A completed encounter cannot be changed back to active.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Back</AlertDialogCancel>
          <Button onClick={handleCompleteEncounter} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <div className="flex items-center gap-1">
                <Spinner />
                Marking...
              </div>
            ) : (
              "Yes, mark as completed"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
