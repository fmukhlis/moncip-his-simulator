"use client"

import { useEffect, useState } from "react"
import { formatAge } from "@/lib/utils"

export default function ClientAgeText({ birthDate, placeholder = "—" }: { birthDate?: string; placeholder?: string }) {
  const [clientBirthDate, setClientBirthDate] = useState(placeholder)

  useEffect(() => {
    setClientBirthDate(birthDate ?? placeholder)
  }, [])

  return <>{clientBirthDate !== placeholder ? formatAge(new Date(clientBirthDate)) : clientBirthDate}</>
}
