import "@/styles/tailwind.css"

import { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: {
    default: process.env.APP_NAME ?? "Moncip HIS-Simulator",
    template: `%s | ${process.env.APP_NAME ?? "Moncip HIS-Simulator"}`,
  },
  description: "Laboratory Information System Software",
  openGraph: {
    title: {
      default: process.env.APP_NAME ?? "Moncip HIS-Simulator",
      template: `%s | ${process.env.APP_NAME ?? "Moncip HIS-Simulator"}`,
    },
    description: "Hospital Information System Simulator Software",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
