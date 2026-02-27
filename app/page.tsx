import Link from "next/link"
import SignInButton from "@/components/landing-page/sign-in-button"
import SignOutButton from "@/components/landing-page/sign-out-button"

import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { MoveRight } from "lucide-react"
import { HeaderLandingPage } from "@/components/landing-page/header-landing-page"

export default async function Web() {
  const session = await auth()

  return (
    <section className="bg-background relative mx-auto h-screen max-w-6xl">
      <HeaderLandingPage />
      <div className="m-auto grid h-[calc(100%-56px)] max-w-(--breakpoint-xl) px-4 py-8 text-center lg:py-16">
        <div className="mx-auto place-self-center">
          <h1 className="mb-6 max-w-2xl text-4xl leading-none font-extrabold tracking-tight md:text-5xl xl:text-6xl dark:text-white">
            Moncip HIS-Simulator
          </h1>
          <p className="mb-6 max-w-2xl font-light text-gray-500 md:text-lg lg:mb-8 lg:text-xl dark:text-gray-400">
            An app for simulating communication between <span className="font-semibold">HIS</span> and{" "}
            <span className="font-semibold">LIS</span> using webhooks. This app is build with{" "}
            <Link
              href="https://github.com/Blazity/next-enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary p-0 text-base font-medium underline-offset-4 hover:underline md:text-lg lg:text-xl"
            >
              next-enterprise
            </Link>{" "}
            boilerplate.
          </p>
          {session?.user ? (
            <div className="flex flex-col items-center">
              <Button
                type="submit"
                size={"lg"}
                variant={"outline"}
                className="mb-3 flex items-center gap-2 p-5 text-base"
                asChild
              >
                <Link href={"/auth/dashboard"}>
                  Go to Dashboard <MoveRight className="size-5" />
                </Link>
              </Button>
              <SignOutButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </section>
  )
}
