import React from "react"
import ThemeToggler from "@/components/theme-toggler"
import AppBreadcrumb from "@/components/app-breadcrumb"

import { notFound } from "next/navigation"
import { DataProps } from "@/lib/navigation-data"
import { Separator } from "@/components/ui/separator"
import { getQueryClient } from "@/app/get-query-client"
import { generateBreadcrumb } from "@/lib/generate-breadcrumb"
import { PatientContextSidebar } from "@/components/patient-context-sidebar"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getPatientOverviewActionOptions } from "@/features/patient-context/api/query"
import { LayoutGrid, NotepadText, ScrollText } from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

function generateSidebarData(patientId: string) {
  return {
    patientWorkspace: [
      { title: "Overview", url: `/auth/patients/${patientId}/overview`, icon: <LayoutGrid /> },
      { title: "Encounters", url: `/auth/patients/${patientId}/encounters`, icon: <ScrollText /> },
      { title: "Lab. Orders", url: `/auth/patients/${patientId}/lab-orders`, icon: <NotepadText /> },
    ],
  } as Record<"patientWorkspace", DataProps[]>
}

export default async function PatientContextLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ patientId: string }>
}) {
  const { patientId } = await params

  const DATA = generateSidebarData(patientId)
  const BREADCRUMB_DATA = Object.fromEntries(generateBreadcrumb(Object.values(DATA)))

  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery(getPatientOverviewActionOptions(patientId))
  } catch (error) {
    notFound()
  }

  return (
    <SidebarProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PatientContextSidebar DATA={DATA} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
              <AppBreadcrumb breadcrumbData={BREADCRUMB_DATA} />
              <ThemeToggler className="ml-auto" />
            </div>
          </header>
          {children}
        </SidebarInset>
      </HydrationBoundary>
    </SidebarProvider>
  )
}
