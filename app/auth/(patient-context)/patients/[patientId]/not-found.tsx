import { BookSearch, SearchX } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export default function PatientNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-10">
            <SearchX className="size-6" />
          </EmptyMedia>
          <EmptyTitle>Patient not found</EmptyTitle>
          <EmptyDescription>
            The patient you are looking for does not exist or the ID may be incorrect.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/auth/search-patients" className="flex items-center">
              <BookSearch className="size-3.5" />
              Search patients
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
