import { mutationOptions, queryOptions } from "@tanstack/react-query"
import z from "zod"
import {
  CreatePatientActionSchema,
  DeletePatientActionSchema,
  GetPatientDetailActionSchema,
  GetPatientsActionSchema,
  UpdatePatientActionSchema,
} from "./patient.validation"
import {
  cachedGetPatientDetailAction,
  createPatientAction,
  deletePatientAction,
  getPatientsAction,
  updatePatientAction,
} from "./patient.action"
import { getQueryClient } from "@/app/get-query-client"

export const getGetPatientDetailActionOptions = (params: z.infer<typeof GetPatientDetailActionSchema>) =>
  queryOptions({
    queryKey: ["patient", "detail", params],
    queryFn: async () => {
      const response = await cachedGetPatientDetailAction(params)
      return response.data
    },
  })

export const getGetPatientsActionOptions = (
  params: z.input<typeof GetPatientsActionSchema>,
  enabled: boolean | undefined = true
) =>
  queryOptions({
    queryKey: ["patient", "list", params],
    queryFn: async () => {
      const response = await getPatientsAction(params)
      return response.data
    },
    enabled,
  })

export const getCreatePatientActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof CreatePatientActionSchema>) => {
      const response = await createPatientAction(params)
      return response.data
    },
    onSuccess: async () => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["patient", "list"],
        }),
      ])
    },
  })

export const getUpdatePatientActionOptions = () =>
  mutationOptions({
    mutationFn: async (params: z.infer<typeof UpdatePatientActionSchema>) => {
      const response = await updatePatientAction(params)
      return response.data
    },
    onSuccess: async ({ id }) => {
      Promise.all([
        getQueryClient().invalidateQueries({
          queryKey: ["patient", "list"],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patient", "detail", { patientId: id }],
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
          queryKey: ["patient", "list"],
        }),
        getQueryClient().invalidateQueries({
          queryKey: ["patient", "detail", { patientId: id }],
        }),
      ])
    },
  })
