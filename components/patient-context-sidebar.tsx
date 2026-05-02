import { Contact } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { PatientDetail } from "@/features/patient/patient.type"
import { DataProps } from "@/lib/navigation-data"
import { NavUser } from "./nav-user"
import { PatientSidebarHeader } from "./patient-sidebar-header"
import { SideNav } from "./side-nav"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"

export function PatientContextSidebar({
  DATA,
  patient,
  ...props
}: React.ComponentProps<typeof Sidebar> & { DATA: Record<"patientWorkspace", DataProps[]>; patient: PatientDetail }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <PatientSidebarHeader />
        <Card className="mt-2 py-0 ring-0 group-data-[collapsible=icon]:hidden">
          <CardHeader className="gap-0.5 px-2">
            <CardTitle className="flex items-center gap-1.5">
              <Contact className="size-4" />
              <span className="text-[13px]/relaxed whitespace-nowrap">Patient</span>
            </CardTitle>
            <CardDescription className="whitespace-nowrap">{patient.fullName}</CardDescription>
          </CardHeader>
        </Card>
      </SidebarHeader>
      <SidebarContent>
        <SideNav data={DATA.patientWorkspace} label="Patient Workspace" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
