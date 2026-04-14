"use client"

import { useMutation } from "@tanstack/react-query"
import { Ellipsis, Pencil, Trash } from "lucide-react"
import Link from "next/link"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getDeletePatientActionOptions } from "@/features/patient-context/api/mutation"
import { Spinner } from "../ui/spinner"

type PatientActionsMenuProps = {
  patientId: string
}

export function PatientActionsMenu({ patientId }: PatientActionsMenuProps) {
  const mutation = useMutation(getDeletePatientActionOptions())

  const [deleteOpen, setDeleteOpen] = useState(false)

  const router = useRouter()

  const handleDeletePatient = async () => {
    try {
      await mutation.mutateAsync({ patientId })
      setDeleteOpen(false)
      toast.success("Patient removed successfully")
      router.replace("/auth/search-patients")
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
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"icon-xs"}>
            <Ellipsis className="size-3.5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href={`/auth/patients/${patientId}/overview/edit`}>
              <Pencil className="size-3" />
              Edit patient
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault()
              setDeleteOpen(true)
            }}
          >
            <Trash className="size-3" />
            Remove patient
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove patient ?</AlertDialogTitle>
            <AlertDialogDescription>
              {`This action will remove the patient from active records. Patients with encounter history cannot be removed.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              onClick={async () => {
                try {
                  await handleDeletePatient()
                  setDeleteOpen(false)
                } catch {}
              }}
              variant="destructive"
              disabled={mutation.isPending}
              className="sm:w-[100px]"
            >
              {mutation.isPending ? <Spinner className="size-5" /> : "Remove"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
