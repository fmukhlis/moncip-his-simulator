"use client"

import { type ReactNode, createContext, useState, useContext } from "react"
import { useStore } from "zustand"
import { type SearchPatientsStore, createSearchPatientsStore } from "@/stores/search-patients-store"

export type SearchPatientsStoreApi = ReturnType<typeof createSearchPatientsStore>

export const SearchPatientsStoreContext = createContext<SearchPatientsStoreApi | undefined>(undefined)

export interface SearchPatientsStoreProviderProps {
  children: ReactNode
}

export const SearchPatientsStoreProvider = ({ children }: SearchPatientsStoreProviderProps) => {
  const [store] = useState(() => createSearchPatientsStore())
  return <SearchPatientsStoreContext.Provider value={store}>{children}</SearchPatientsStoreContext.Provider>
}

export const useSearchPatientsStore = <T,>(selector: (store: SearchPatientsStore) => T): T => {
  const searchPatientsStoreContext = useContext(SearchPatientsStoreContext)
  if (!searchPatientsStoreContext) {
    throw new Error(`useSearchPatientsStore must be used within SearchPatientsStoreProvider`)
  }
  return useStore(searchPatientsStoreContext, selector)
}
