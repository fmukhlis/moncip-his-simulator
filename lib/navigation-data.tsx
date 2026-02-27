import React from "react"

import { BookUser, FilePlus, LayoutDashboard } from "lucide-react"

type DataProps = {
  title: string
  url: string
  icon: React.JSX.Element
  items?: {
    title: string
    url: string
  }[]
}

export const DATA = {
  navMain: [{ title: "Dashboard", url: "/auth/dashboard", icon: <LayoutDashboard /> }],
  navOperations: [
    {
      title: "Patient Registry",
      url: "/auth/patient-registry",
      icon: <BookUser />,
    },
    {
      title: "Patient Encounters",
      url: "/auth/patient-encounters",
      icon: <FilePlus />,
      items: [
        {
          title: "Encounters",
          url: "/auth/patient-encounters",
        },
        {
          title: "Create Encounter",
          url: "/auth/patient-encounters/create",
        },
      ],
    },
  ],
} as Record<"navMain" | "navOperations", DataProps[]>

function extractBreadcrumbData() {
  const map = new Map<string, { url: string; title: string }[]>()

  function walk(items: Omit<DataProps, "icon">[], parents: { url: string; title: string }[] = []) {
    for (const { url, title, items: subItems } of items) {
      const currentCrumbs = [...parents, { url, title }]

      if (!map.has(url)) {
        map.set(url, currentCrumbs)
      }

      if (subItems) {
        walk(subItems, currentCrumbs)
      }
    }
  }

  walk(DATA.navMain)
  walk(DATA.navOperations)

  return map
}

export const BREADCRUMB_DATA = Object.fromEntries(extractBreadcrumbData())
