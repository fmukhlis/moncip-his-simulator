"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner"
import { signOutAction } from "@/features/authentication/actions/mutation"
import { LogOut, LogOutIcon } from "lucide-react"
import { AlertDialogMedia, AlertDialogTrigger } from "./ui/alert-dialog"
import {
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"

export function SignOutAlertDialogTrigger({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <AlertDialogTrigger asChild>
      <button {...props} className={cn("w-full", className)}>
        <LogOutIcon />
        Log out
      </button>
    </AlertDialogTrigger>
  )
}

export function SignOutAlertDialogContent() {
  const [state, dispatchAction, isPending] = React.useActionState(signOutAction, false)

  const handleClick = () => {
    React.startTransition(() => {
      dispatchAction()
    })
  }

  return (
    <AlertDialogContent size="sm">
      <AlertDialogHeader>
        <AlertDialogMedia className="bg-destructive/10 text-destructive">
          <LogOut />
        </AlertDialogMedia>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          Signing out here <span className="text-primary">only</span> ends your Moncip HIS-Simulator session. To{" "}
          <span className="text-primary">fully</span> protect your account, please also{" "}
          <span className="text-primary">sign out</span> of your <span className="text-primary">Google</span> account.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
        <Button variant={"destructive"} disabled={isPending} onClick={handleClick}>
          {isPending ? <Spinner className="size-5" /> : "Sign Out"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
