import AppBreadcrumb from "@/components/app-breadcrumb"
import { GlobalSidebar } from "@/components/global-sidebar"
import ThemeToggler from "@/components/theme-toggler"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <GlobalSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <AppBreadcrumb />
            <ThemeToggler className="ml-auto" />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
