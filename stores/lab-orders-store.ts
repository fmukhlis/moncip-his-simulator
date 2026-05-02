import { LabOrderPriority, LabOrderStatus } from "@/generated/prisma/enums"
import { createStore } from "zustand"

export type LabOrdersState = {
  filters: {
    search: string
    status: LabOrderStatus[]
    priority: LabOrderPriority[]
  }
}

export type LabOrdersActions = {
  setFilters: (filters: Partial<LabOrdersState["filters"]>) => void
}

export type LabOrdersStore = LabOrdersState & LabOrdersActions

export const defaultInitState: LabOrdersState = {
  filters: {
    search: "",
    status: ["SUBMITTED", "PARTIALLY_RESULTED", "RESULTED", "CANCELLED"],
    priority: ["ROUTINE", "STAT"],
  },
}

export const createLabOrdersStore = (initState: LabOrdersState = defaultInitState) => {
  return createStore<LabOrdersStore>()((set) => ({
    ...initState,
    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  }))
}
