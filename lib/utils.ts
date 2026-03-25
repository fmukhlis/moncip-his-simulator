import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"
import { differenceInYears, differenceInMonths, differenceInDays } from "date-fns"

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
