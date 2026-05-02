"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export function RedirectNotice() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const notice = searchParams.get("notice")

    if (notice) {
      switch (notice) {
        case "no-active-encounter":
          toast.info(
            "An active encounter is required before creating a lab order. Please select an active encounter or create a new one first."
          )
          break
        case "existing-encounter":
          toast.info("You were redirected to the existing encounter.")
          break
      }
      const params = new URLSearchParams(searchParams.toString())
      params.delete("notice")

      const nextQuery = params.toString()
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname

      router.replace(nextUrl)
    }
  }, [router, searchParams, pathname])

  return null
}
