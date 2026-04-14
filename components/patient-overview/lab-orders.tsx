import { ExternalLink, MoveDown, MoveRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../ui/badge"

export function LabOrders() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-semibold">Lab Orders</CardTitle>
        <CardAction>
          <div className="flex items-center gap-2">
            <Button variant="outline" size={"xs"}>
              <ExternalLink className="size-3.5" />
              View Details
            </Button>
            <Button size={"xs"} variant={"outline"}>
              <Plus />
              Order Lab
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      {true ? (
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-start gap-1">
              <p className="flex gap-2 font-semibold">
                <span>No lab orders for this encounter</span>
              </p>
              <p className="flex items-center gap-1">
                <span>Order labs to track diagnostics and results for this visit.</span>
              </p>
              <Button className="mt-2 flex items-center gap-2" disabled>
                <Plus className="size-4" /> Order First Lab
              </Button>
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="border-b pb-2 font-semibold">Pending (2)</p>
              <ul className="flex flex-col gap-1">
                <li className="flex items-center gap-1">
                  <div className="mr-5 min-w-0 truncate">CBC Panel</div>
                  <div className="ml-auto w-[100px] shrink-0">24 Mar 10:40</div>
                  <Badge className="w-[80px] shrink-0 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    Pending
                  </Badge>
                </li>
                <li className="flex items-center gap-1">
                  <div className="mr-5 min-w-0 truncate">Lipid Panel</div>
                  <div className="ml-auto w-[100px] shrink-0">24 Mar 10:42</div>
                  <Badge className="w-[80px] shrink-0 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    Pending
                  </Badge>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-1">
              <p className="border-b pb-2 font-semibold">Completed (2)</p>
              <ul className="flex flex-col gap-1">
                <li className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <div className="mr-5 min-w-0 truncate">Glucose Test</div>
                    <div className="ml-auto w-[100px] shrink-0">23 Mar 09:12</div>
                    <Badge className="w-[80px] shrink-0 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                      Completed
                    </Badge>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(175px,1fr))] gap-2">
                    <div className="flex items-center gap-2">
                      <MoveRight className="ml-2 size-3" />
                      <span>Result :</span>
                      <span className="w-[100px]">140 mg/dL</span>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <div className="w-[65px]"></div>
                      <span>(Normal: 100 - 150)</span>
                    </div>
                  </div>
                </li>
                <li className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <div className="mr-5 min-w-0 truncate">Hemoglobin</div>
                    <div className="ml-auto w-[100px] shrink-0">23 Mar 09:15</div>
                    <Badge className="w-[80px] shrink-0 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                      Completed
                    </Badge>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(175px,1fr))] gap-2">
                    <div className="flex items-center gap-2">
                      <MoveRight className="ml-2 size-3" />
                      <span>Result :</span>
                      <span className="w-[100px]">11.2 g/dL</span>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <Badge variant={"destructive"} className="w-[65px]">
                        <MoveDown className="size-3" />
                        <span>Low</span>
                      </Badge>
                      <span>(Normal: 13 - 17)</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
