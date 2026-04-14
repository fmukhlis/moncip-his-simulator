import z from "zod"

export const requiredCuid2 = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} is required.` })
    .pipe(z.string().cuid2({ message: `${label} is invalid.` }))

export const requiredEnumString = <T extends readonly [string, ...string[]]>(values: T, label: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `${label} is required.` })
    .refine((value) => values.includes(value), {
      error: `Invalid ${label.toLowerCase()}.`,
    })
