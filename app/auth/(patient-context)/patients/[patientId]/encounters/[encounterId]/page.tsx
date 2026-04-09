import { Suspense } from "react"
import { RedirectNotice } from "@/components/redirect-notice"

export default function EncounterDetails() {
  return (
    <div>
      <Suspense fallback={null}>
        <RedirectNotice />
      </Suspense>
      EncounterDetails
    </div>
  )
}
