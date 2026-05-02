"use client"

import { startTransition, useActionState } from "react"
import { FlipButton, FlipButtonBack, FlipButtonFront } from "@/components/animate-ui/components/buttons/flip"
import { signInWithGoogleAction } from "@/features/authentication/actions/mutation"
import { roboto } from "@/lib/fonts"
import GoogleIcon from "../ui/google-icon"
import { Spinner } from "../ui/spinner"

export default function SignInButton() {
  const [_state, dispatchAction, isPending] = useActionState(signInWithGoogleAction, false)

  const handleClick = () => {
    startTransition(() => {
      dispatchAction()
    })
  }
  return (
    <FlipButton onClick={handleClick} disabled={isPending} className="disabled:opacity-60">
      <FlipButtonFront className="w-full text-base font-bold" variant={"outline"} size={"google-spec"}>
        {isPending ? (
          <div className="flex items-center gap-2">
            <Spinner className="size-[25px]" />
            Loading...
          </div>
        ) : (
          "Get Started"
        )}
      </FlipButtonFront>
      <FlipButtonBack variant={"google-spec"} size={"google-spec"}>
        <div className="flex items-center">
          <div className="mr-[10px] h-[25px] w-[25px]">
            {isPending ? <Spinner className="size-[25px]" /> : <GoogleIcon />}
          </div>
          <span className={`${roboto.className}`}>Sign in with Google</span>
        </div>
      </FlipButtonBack>
    </FlipButton>
  )
}
