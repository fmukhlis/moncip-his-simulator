export class ActiveEncounterExistsError extends Error {
  constructor(public readonly encounterId: string) {
    super("Patient already has an active encounter.")
    this.name = "ActiveEncounterExistsError"
  }
}
