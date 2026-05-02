"use server"

import { signIn, signOut } from "@/auth"

export async function signInWithGoogleAction() {
  await signIn("google", { redirectTo: "/auth/dashboard" })
  return true
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" })
  return true
}
