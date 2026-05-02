"use client"

import { type ReactNode, createContext, useContext, useState } from "react"
import { useStore } from "zustand"
import { createLabOrdersStore, type LabOrdersStore } from "@/stores/lab-orders-store"

export type LabOrdersStoreApi = ReturnType<typeof createLabOrdersStore>

export const LabOrdersStoreContext = createContext<LabOrdersStoreApi | undefined>(undefined)

export interface LabOrdersStoreProviderProps {
  children: ReactNode
  patientId?: string
}

export const LabOrdersStoreProvider = ({ children }: LabOrdersStoreProviderProps) => {
  const [store] = useState(() => createLabOrdersStore())
  return <LabOrdersStoreContext.Provider value={store}>{children}</LabOrdersStoreContext.Provider>
}

export const useLabOrdersStore = <T,>(selector: (store: LabOrdersStore) => T): T => {
  const labOrdersStoreContext = useContext(LabOrdersStoreContext)
  if (!labOrdersStoreContext) {
    throw new Error(`useLabOrdersStore must be used within LabOrdersStoreProvider`)
  }
  return useStore(labOrdersStoreContext, selector)
}
