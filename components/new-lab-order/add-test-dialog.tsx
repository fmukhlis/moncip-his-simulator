"use client"

import { useQuery } from "@tanstack/react-query"
import { Clock3, Search } from "lucide-react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useDebounce } from "use-debounce"
import z from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CreateLabOrderActionSchema } from "@/features/lab-order/lab-order.validation"
import { getGetOrderableServicesActionOptions } from "@/features/orderable-service/orderable-service.api"
import { Checkbox } from "../ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "../ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Skeleton } from "../ui/skeleton"
import { Spinner } from "../ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

export function AddTestDialog() {
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  const [debouncedSearch, { isPending }] = useDebounce(search, 1000)

  const { control } = useFormContext<z.infer<typeof CreateLabOrderActionSchema>>()

  const { data: orderableServicesData, isFetching } = useQuery(
    getGetOrderableServicesActionOptions({ type: ["SINGLE"], search: debouncedSearch, categories, trashed: false })
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Add Test
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-3 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Laboratory Test</DialogTitle>
          <DialogDescription>Search and select individual laboratory tests to add to this order.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <InputGroup>
            <InputGroupInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              placeholder="Search by test id, name, or code..."
            />
            <InputGroupAddon>
              <Search className="text-muted-foreground" />
            </InputGroupAddon>
            {isPending() && (
              <InputGroupAddon align="inline-end">
                <Clock3 />
              </InputGroupAddon>
            )}
            {isFetching && (
              <InputGroupAddon align="inline-end">
                <Spinner />
              </InputGroupAddon>
            )}
          </InputGroup>
          <div className="flex flex-wrap gap-2">
            <ToggleGroup
              size="sm"
              type="multiple"
              value={categories}
              spacing={2}
              variant="default"
              onValueChange={(value) => {
                setCategories(value)
              }}
            >
              <ToggleGroupItem value="clinical chemistry" aria-label="Clinical Chemistry">
                Clinical Chemistry
              </ToggleGroupItem>
              <ToggleGroupItem value="hematology" aria-label="Hematology">
                Hematology
              </ToggleGroupItem>
              <ToggleGroupItem value="immunoserology" aria-label="Immunoserology">
                Immunoserology
              </ToggleGroupItem>
              <ToggleGroupItem value="microbiology & parasitology" aria-label="Microbiology & Parasitology">
                Microbiology & Parasitology
              </ToggleGroupItem>
              <ToggleGroupItem value="urinalysis" aria-label="Urinalysis">
                Urinalysis
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-[40dvh]">
          <div className="grid h-full gap-3 sm:grid-cols-2">
            {isFetching ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="border px-3 py-2.5">
                  <div className="flex flex-col gap-x-3 gap-y-2 sm:flex-row sm:justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <Skeleton className="h-4 w-10" />
                          <Skeleton className="h-4 w-5" />
                          <Skeleton className="h-4 w-7" />
                        </div>
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-5 w-10" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Controller
                name="orderableServiceIds"
                render={({ field: { onChange, value } }) => {
                  const set = new Set(value)
                  return (
                    <>
                      {orderableServicesData?.items.map((test) => (
                        <FieldLabel key={test.id}>
                          <Field orientation="horizontal" className="items-center">
                            <Checkbox
                              id={test.id}
                              name={test.id}
                              checked={set.has(test.id)}
                              onCheckedChange={(checked) => {
                                if (checked === true) {
                                  set.add(test.id)
                                } else {
                                  set.delete(test.id)
                                }
                                onChange(Array.from(set))
                              }}
                            />
                            <FieldContent className="flex flex-col gap-1">
                              <FieldTitle>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <p className="mb-0.5 font-medium">{test.name}</p>
                                  <Badge variant="outline">{test.code}</Badge>
                                  <Badge variant="secondary">{test.category}</Badge>
                                </div>
                              </FieldTitle>
                              <FieldDescription>{test.description}</FieldDescription>
                            </FieldContent>
                          </Field>
                        </FieldLabel>
                      ))}
                    </>
                  )
                }}
                control={control}
              />
            )}
          </div>
        </ScrollArea>
        <Separator />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
