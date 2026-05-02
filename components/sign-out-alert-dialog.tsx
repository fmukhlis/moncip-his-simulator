"use client"

import { LogOut, LogOutIcon } from "lucide-react"
import { startTransition, useActionState } from "react"
import { signOutAction } from "@/features/authentication/actions/mutation"
import { cn } from "@/lib/utils"
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner"

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
  const [_state, dispatchAction, isPending] = useActionState(signOutAction, false)

  const handleClick = () => {
    startTransition(() => {
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
