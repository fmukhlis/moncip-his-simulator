import { type ClassValue, clsx } from "clsx"
import { differenceInDays, differenceInMonths, differenceInYears } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAge(birthDate: Date): string {
  const now = new Date()

  const years = differenceInYears(now, birthDate)

  if (years >= 1) {
    return `${years} yr`
  }

  const months = differenceInMonths(now, birthDate)

  if (months >= 1) {
    return `${months} mo`
  }

  const days = differenceInDays(now, birthDate)

  return `${days} d`
}

export function formatCurrencyFromDecimalString(value: string) {
  if (!value) return "-"

  const [integerPart, fractionPart] = value.split(".")

  const formattedInteger = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  if (!fractionPart || /^0+$/.test(fractionPart)) {
    return `Rp${formattedInteger}`
  }

  return `Rp${formattedInteger},${fractionPart}`
}
