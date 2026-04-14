import { redirect } from "next/navigation"

export default async function RedirectToOverviewPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params

  redirect(`/auth/patients/${patientId}/overview`)
}
