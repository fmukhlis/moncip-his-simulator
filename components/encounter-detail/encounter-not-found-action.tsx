"use client"

import Link from "next/link"

import { Button } from "../ui/button"
import { useParams } from "next/navigation"
import { BookSearch } from "lucide-react"

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
