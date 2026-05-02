import { SearchX } from "lucide-react"

import LabOrderNotFoundAction from "@/components/lab-order-detail/lab-order-not-found-action"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export default function LabOrderNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-10">
            <SearchX className="size-6" />
          </EmptyMedia>
          <EmptyTitle>Lab order not found</EmptyTitle>
          <EmptyDescription>
            The lab order you are looking for does not exist or the ID may be incorrect.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <LabOrderNotFoundAction />
        </EmptyContent>
      </Empty>
    </div>
  )
}
