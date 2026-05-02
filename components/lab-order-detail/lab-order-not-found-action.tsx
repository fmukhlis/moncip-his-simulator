"use client"

import { BookSearch } from "lucide-react"
import Link from "next/link"

import { useParams } from "next/navigation"
import { Button } from "../ui/button"

export default function LabOrderNotFoundAction() {
  const { patientId } = useParams<{ patientId: string }>()

  return (
    <Button variant="outline" asChild>
      <Link href={`/auth/patients/${patientId}/lab-orders`} className="flex items-center">
        <BookSearch className="size-3.5" />
        Search lab orders
      </Link>
    </Button>
  )
}
