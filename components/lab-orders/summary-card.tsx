import { Card, CardContent } from "../ui/card"

export default function SummaryCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardContent>
        <div className="space-y-1.5">
          <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center border">{icon}</div>
          <p className="h-10">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
