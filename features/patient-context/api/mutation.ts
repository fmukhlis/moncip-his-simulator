import z from "zod"

import { getQueryClient } from "@/app/get-query-client"
import { mutationOptions } from "@tanstack/react-query"
import {
  deletePatientAction,
  updatePatientAction,
  cancelEncounterAction,
  createEncounterAction,
  updateEncounterAction,
  completeEncounterAction,
} from "../actions/mutation"
import {
  DeletePatientActionSchema,
  UpdatePatientActionSchema,
  CancelEncounterActionSchema,
  CreateEncounterActionSchema,
  UpdateEncounterActionSchema,
  CompleteEncounterActionSchema,
} from "../schema"

export const getUpdatePatientActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof UpdatePatientActionSchema>) => {
      const response = await updatePatientAction(params)
      return response.data
    },
    onSuccess: async ({ id }) => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["patient-search"],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patient-detail", id],
        }),
      ])
    },
  })

export const getDeletePatientActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof DeletePatientActionSchema>) => {
      const response = await deletePatientAction(params)
      return response.data
    },
    onSuccess: async ({ id }) => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["patient-search"],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patient-detail", id],
        }),
      ])
    },
  })

export const getCreateEncounterActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof CreateEncounterActionSchema>) => {
      const response = await createEncounterAction(params)
      return response.data
    },
    onSuccess: async ({ patientId }) => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["patient-active-encounter", patientId],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patient-encounters-count", patientId],
        }),
      ])
    },
  })

export const getCompleteEncounterActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof CompleteEncounterActionSchema>) => {
      const response = await completeEncounterAction(params)
      return response.data
    },
    onSuccess: async ({ id, patient: { id: patientId } }) => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["patient-active-encounter", patientId],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patient-last-encounter", patientId],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patient-encounters-count", patientId],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patient-encounters", patientId],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["encounter-detail", id],
        }),
      ])
    },
  })

export const getCancelEncounterActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof CancelEncounterActionSchema>) => {
      const response = await cancelEncounterAction(params)
      return response.data
    },
    onSuccess: async ({ id, patient: { id: patientId } }) => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["patient-active-encounter", patientId],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patient-last-encounter", patientId],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patient-encounters-count", patientId],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patient-encounters", patientId],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["encounter-detail", id],
        }),
      ])
    },
  })

export const getUpdateEncounterActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof UpdateEncounterActionSchema>) => {
      const response = await updateEncounterAction(params)
      return response.data
    },
    onSuccess: async ({ id, patient: { id: patientId } }) => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["patient-encounters", patientId],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["encounter-detail", id],
        }),
      ])
    },
  })
