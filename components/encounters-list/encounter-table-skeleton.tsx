import { Separator } from "../ui/separator"
import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

export default function EncounterTableSkeleton() {
  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <Table className="w-full caption-bottom text-xs">
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 150 }}>Encounter No</TableHead>
              <TableHead style={{ width: 150 }}>
                <div className="text-center">Encounter Type</div>
              </TableHead>
              <TableHead style={{ flex: 1, width: 999 }} className="text-center">
                Unit
              </TableHead>
              <TableHead style={{ flex: 1, width: 999 }}>Provider</TableHead>
              <TableHead style={{ flex: 1, width: 999 }}>Encounter Date</TableHead>
              <TableHead style={{ width: 100 }}>
                <div className="text-center">Status</div>
              </TableHead>
              <TableHead style={{ width: 100 }} className="text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-28 rounded-none" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Skeleton className="h-5 w-20 rounded-none" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-none" />
                    <Skeleton className="h-4 w-28 rounded-none" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-none" />
                    <Skeleton className="h-4 w-24 rounded-none" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-none" />
                    <Skeleton className="h-4 w-24 rounded-none" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Skeleton className="h-5 w-[85px] rounded-none" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Skeleton className="h-8 w-8 rounded-none" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Separator />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </>
  )
}
