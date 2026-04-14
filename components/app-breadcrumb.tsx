"use client"

import Link from "next/link"

import { useParams, usePathname } from "next/navigation"
import { Fragment } from "react"
import { generateBreadcrumb } from "@/lib/generate-breadcrumb"
import { DATA, DataProps } from "@/lib/navigation-data"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"

export default function AppBreadcrumb({ dynamicSidebarData }: { dynamicSidebarData?: DataProps[] }) {
  const { patientId, encounterId } = useParams<{ patientId: string; encounterId: string }>()

  const pathname = usePathname()

  const BREADCRUMB_DATA = Object.fromEntries(
    generateBreadcrumb([
      [
        ...Object.values(DATA).flat(9),
        ...(dynamicSidebarData ? dynamicSidebarData : []),

        { title: "Edit Patient", url: `/auth/patients/${patientId}/overview/edit`, icon: <></> },
        {
          title: "Encounters",
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
            <Fragment key={title}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href={url ?? ""}>{title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
