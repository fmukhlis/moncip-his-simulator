import "@/styles/tailwind.css"

import Providers from "./providers"

import { Toaster } from "@/components/ui/sonner"
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
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
