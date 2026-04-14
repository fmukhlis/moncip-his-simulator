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
