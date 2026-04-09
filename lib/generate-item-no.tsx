export function buildEncounterPeriod(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}${month}`
}

export function buildEncounterNo(period: string, sequence: number) {
  return `ENC-${period}-${String(sequence).padStart(5, "0")}`
}
