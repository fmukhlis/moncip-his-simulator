import SearchPatientsResult from "@/components/search-patients/search-patients-result"
import SearchPatientsFilters from "@/components/search-patients/search-patients-filters"

import { SearchPatientsStoreProvider } from "@/providers/search-patients-store-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SearchPatients() {
  return (
    <SearchPatientsStoreProvider>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="relative w-full rounded-sm border py-4 shadow">
          <CardHeader className="px-4">
            <CardTitle>
              <h1>Find Patient</h1>
            </CardTitle>
            <CardDescription>
              Find an existing patient using their name, national ID, medical record number, or date of birth.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <SearchPatientsFilters />
          </CardContent>
        </Card>
        <Card className="relative w-full rounded-sm border py-4 shadow">
          <CardContent className="px-4">
            <SearchPatientsResult />
          </CardContent>
        </Card>
      </div>
    </SearchPatientsStoreProvider>
  )
}
