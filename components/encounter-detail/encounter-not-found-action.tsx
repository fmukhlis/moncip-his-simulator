"use client"

import { BookSearch } from "lucide-react"
import Link from "next/link"

import { useParams } from "next/navigation"
import { Button } from "../ui/button"

export default function EncounterNotFoundAction() {
  const { patientId } = useParams<{ patientId: string }>()

  return (
    <Button variant="outline" asChild>
      <Link href={`/auth/patients/${patientId}/encounters`} className="flex items-center">
        <BookSearch className="size-3.5" />
        Search encounters
      </Link>
    </Button>
  )
}
