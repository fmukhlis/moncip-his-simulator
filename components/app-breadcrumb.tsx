"use client"

import Link from "next/link"
import React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import { generateBreadcrumb } from "@/lib/generate-breadcrumb"
import { useParams, usePathname } from "next/navigation"
import { LayoutGrid, NotepadText, ScrollText } from "lucide-react"

export default function AppBreadcrumb() {
  const { patientId, encounterId } = useParams<{ patientId: string; encounterId: string }>()

  const pathname = usePathname()

  const BREADCRUMB_DATA = Object.fromEntries(
    generateBreadcrumb([
      [
        { title: "Overview", url: `/auth/patients/${patientId}/overview`, icon: <LayoutGrid /> },
        {
          title: "Encounters",
          url: `/auth/patients/${patientId}/encounters`,
          icon: <ScrollText />,
        },
        { title: "Lab. Orders", url: `/auth/patients/${patientId}/lab-orders`, icon: <NotepadText /> },
        { title: "Edit Patient", url: `/auth/patients/${patientId}/overview/edit`, icon: <></> },
        {
          title: "List",
          url: `/auth/patients/${patientId}/encounters`,
          icon: <></>,
          items: [
            { title: "Details", url: `/auth/patients/${patientId}/encounters/${encounterId}` },
            { title: "Create Encounter", url: `/auth/patients/${patientId}/encounters/create` },
          ],
        },
      ],
    ])
  )

  const crumbs = BREADCRUMB_DATA[pathname] ?? []

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map(({ title, url }, index) => {
          const isLast = index === crumbs.length - 1
          return isLast ? (
            <BreadcrumbItem key={title} className="hidden md:block">
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <React.Fragment key={title}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href={url ?? ""}>{title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
