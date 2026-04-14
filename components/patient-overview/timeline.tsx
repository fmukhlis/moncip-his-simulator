import { CircleSmall } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TimelineItem = {
  time: string
  title: string
  subtitle?: string
  meta?: string
  status?: string
  statusVariant: "ALERT" | "INFO" | "SUCCESS"
}

type TimelineGroup = {
  label: string
  items: TimelineItem[]
}

const data: TimelineGroup[] = [
  {
    label: "Today",
    items: [
      {
        time: "10:42",
        title: "Lab Ordered → Lipid Panel",
        subtitle: "Encounter: ENC-2026-001",
        status: "Pending",
        statusVariant: "INFO",
      },
      {
        time: "10:40",
        title: "Lab Ordered → CBC Panel",
        subtitle: "Encounter: ENC-2026-001",
        status: "Pending",
        statusVariant: "INFO",
      },
      {
        time: "10:32",
        title: "Encounter Created",
        status: "Created",
        statusVariant: "INFO",
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        time: "09:12",
        title: "Result → Hemoglobin (↓ Low)",
        subtitle: "Value: 11.2 g/dL",
        status: "Abnormal",
        statusVariant: "ALERT",
      },
      {
        time: "09:10",
        title: "Result → Glucose",
        subtitle: "Value: 140 mg/dL",
        status: "Completed",
        statusVariant: "SUCCESS",
      },
    ],
  },
]

const badgeClassVariant = {
  ALERT: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  INFO: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  SUCCESS: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
} as const

export function Timeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 || true ? (
          <section className="space-y-3">
            <div className="space-y-2">
              <div className="flex gap-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="leading-none font-semibold">No activity recorded</p>
                </div>
              </div>
              <p className="text-foreground">This patient has no encounters, orders, or results yet.</p>
            </div>
          </section>
        ) : (
          data.map((group) => (
            <section key={group.label} className="space-y-3">
              <h3 className="text-muted-foreground text-xs font-semibold tracking-[0.18em]">{group.label}</h3>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div key={`${group.label}-${item.time}-${item.title}`} className="flex gap-3">
                    <CircleSmall className="size-4" />
                    <div className="grow">
                      <div className="flex items-start justify-between gap-3">
                        <p className="leading-none font-semibold">{item.time}</p>
                        {item.status ? (
                          <Badge className={`w-[100px] shrink-0 ${badgeClassVariant[item.statusVariant]}`}>
                            {item.status}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-foreground">{item.title}</p>
                      {item.subtitle ? <p className={`text-muted-foreground`}>{item.subtitle}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </CardContent>
    </Card>
  )
}
