"use client"

import React from "react"

import { Button } from "../ui/button"
import { LogOut } from "lucide-react"
import { signOutAction } from "@/features/authentication/actions/mutation"

export default function SignOutButton() {
  const [state, dispatchAction, isPending] = React.useActionState(signOutAction, false)

  const handleClick = () => {
    React.startTransition(() => {
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
