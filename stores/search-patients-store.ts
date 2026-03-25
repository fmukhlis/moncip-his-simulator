import { createStore } from "zustand/vanilla"

export type SearchPatientsState = {
  filters: {
    mrn: string
    fullName: string
    birthDate: Date | undefined
    nationalId: string
  }
}

export type SearchPatientsActions = {
  setFilters: (filters: Partial<SearchPatientsState["filters"]>) => void
}

export type SearchPatientsStore = SearchPatientsState & SearchPatientsActions

export const defaultInitState: SearchPatientsState = {
  filters: { mrn: "", fullName: "", birthDate: undefined, nationalId: "" },
}

export const createSearchPatientsStore = (initState: SearchPatientsState = defaultInitState) => {
  return createStore<SearchPatientsStore>()((set) => ({
    ...initState,
    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  }))
}
