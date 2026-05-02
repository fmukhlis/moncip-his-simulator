import { createStore } from "zustand/vanilla"

export type SearchPatientsState = {
  filters: {
    fullName: string
    birthDate: Date | undefined
    mrnNumber: string
    nationalId: string
  }
}

export type SearchPatientsActions = {
  setFilters: (filters: Partial<SearchPatientsState["filters"]>) => void
}

export type SearchPatientsStore = SearchPatientsState & SearchPatientsActions

export const defaultInitState: SearchPatientsState = {
  filters: { fullName: "", birthDate: undefined, mrnNumber: "", nationalId: "" },
}

export const createSearchPatientsStore = (initState: SearchPatientsState = defaultInitState) => {
  return createStore<SearchPatientsStore>()((set) => ({
    ...initState,
    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  }))
}
