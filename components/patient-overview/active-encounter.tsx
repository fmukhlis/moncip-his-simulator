import { Button } from "@/components/ui/button"
import { ExternalLink, Plus } from "lucide-react"
import { Card, CardTitle, CardFooter, CardHeader, CardContent } from "@/components/ui/card"

export function ActiveEncounter() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-semibold">Active Encounter</CardTitle>
      </CardHeader>
      {true ? (
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-start gap-1">
              <p className="flex gap-2 font-semibold">
                <span>No active encounter</span>
              </p>
              <p className="flex items-center gap-1">
                <span>This patient is not currently in care.</span>
              </p>
              <Button className="mt-2 flex items-center gap-2">
                <Plus className="size-4" /> Create New Encounter
              </Button>
            </div>
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
                <div className="flex flex-col gap-1">
                  <p className="flex gap-2">
                    <span className="w-[200px]">ENC-0326-00001</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="w-[200px]">Inpatient</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p>
                    <span className="w-[200px]">24 Mar 2026, 10:32</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="w-[200px]">Cardiology</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex gap-2 font-semibold">Reason for Visit</p>
                <p>Chest pain, shortness of breath</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex gap-2 font-semibold">Attending Physician</p>
                <p>Dr. John Smith</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button>
              <Plus />
              Order Lab For This Encounter
            </Button>
            <Button>
              <ExternalLink />
              View Details
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
