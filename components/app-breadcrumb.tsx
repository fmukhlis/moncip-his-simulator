"use client"

import Link from "next/link"

import { useParams, usePathname } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
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
  const { patientId, encounterId, labOrderId } = useParams<{
    patientId: string
    encounterId: string
    labOrderId: string
  }>()

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
            { title: "New", url: `/auth/patients/${patientId}/encounters/new ` },
            { title: "Edit", url: `/auth/patients/${patientId}/encounters/${encounterId}/edit` },
            { title: "Details", url: `/auth/patients/${patientId}/encounters/${encounterId}` },
          ],
        },
        {
          title: "Lab. Orders",
          url: `/auth/patients/${patientId}/lab-orders`,
          icon: <></>,
          items: [
            { title: "New", url: `/auth/patients/${patientId}/lab-orders/new` },
            { title: "Edit", url: `/auth/patients/${patientId}/lab-orders/${labOrderId}/edit` },
            { title: "Details", url: `/auth/patients/${patientId}/lab-orders/${labOrderId}` },
          ],
        },
      ],
    ])
  )

  const [crumbs, setCrumbs] = useState<
    {
      url: string
      title: string
    }[]
  >([])

  useEffect(() => {
    setCrumbs(BREADCRUMB_DATA[pathname] ?? [])
  }, [setCrumbs, pathname])

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
