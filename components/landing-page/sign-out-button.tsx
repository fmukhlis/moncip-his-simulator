"use client"

import { Button } from "../ui/button"
import { LogOut } from "lucide-react"
import { signOutAction } from "@/features/authentication/actions/mutation"
import { startTransition, useActionState } from "react"

export default function SignOutButton() {
  const [state, dispatchAction, isPending] = useActionState(signOutAction, false)

  const handleClick = () => {
    startTransition(() => {
      dispatchAction()
    })
  }

  return (
    <Button
      size={"lg"}
      type="submit"
      onClick={handleClick}
      variant={"destructive"}
      disabled={isPending}
      className="p-5"
    >
      <div className="flex items-center gap-2 text-base">
        <LogOut className="size-5" />
        Sign Out
      </div>
    </Button>
  )
}
