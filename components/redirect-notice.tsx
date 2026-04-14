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

    if (notice === "existing-encounter") {
      toast.info("You were redirected to the existing encounter.")

      const params = new URLSearchParams(searchParams.toString())
      params.delete("notice")

      const nextQuery = params.toString()
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname

      router.replace(nextUrl)
    }
  }, [router, searchParams])

  return null
}
