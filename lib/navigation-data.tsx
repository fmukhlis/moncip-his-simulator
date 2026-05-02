import { BookSearch, BriefcaseMedical, CalendarCog, LayoutDashboard, UserPlus } from "lucide-react"

export type DataProps = {
  title: string
  url: string
  icon: React.JSX.Element
  items?: {
    title: string
    url: string
  }[]
}

export const DATA = {
  main: [{ title: "Dashboard", url: "/auth/dashboard", icon: <LayoutDashboard /> }],
  operations: [
    { title: "Search Patients", url: "/auth/search-patients", icon: <BookSearch /> },
    { title: "Registration", url: "/auth/registration", icon: <UserPlus /> },
    { title: "Encounter Management", url: "/auth/encounter-management", icon: <CalendarCog /> },
    // {
    //   title: "Registration",
    //   url: "/auth/registration",
    //   icon: <FilePlus />,
    //   items: [
    //     { title: "Encounters", url: "/auth/patient-encounters" },
    //     { title: "Create Encounter", url: "/auth/patient-encounters/new" },
    //   ],
    // },
  ],
  masterData: [{ title: "Orderable Services", url: "/auth/orderable-services", icon: <BriefcaseMedical /> }],
} as Record<"main" | "operations" | "masterData", DataProps[]>
