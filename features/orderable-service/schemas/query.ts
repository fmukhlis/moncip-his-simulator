import z from "zod"

export const GetOrderableServiceByIdActionSchema = z.strictObject({
  id: z.string(),
})

export const GetOrderableServiceByIdSchema = GetOrderableServiceByIdActionSchema
