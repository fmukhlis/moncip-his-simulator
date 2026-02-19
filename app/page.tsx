import Link from "next/link"
import GoogleIcon from "@/components/ui/google-icon"

import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { roboto } from "@/lib/fonts"
import { Spinner } from "@/components/ui/spinner"
import { Metadata } from "next"
import { HeaderLandingPage } from "@/components/landing-page/header-landing-page"
import { FlipButton, FlipButtonBack, FlipButtonFront } from "@/components/animate-ui/components/buttons/flip"

export const metadata: Metadata = {
  title: "Moncip HIS-Simulator",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://next-enterprise.vercel.app/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-logo.png",
      },
    ],
  },
}

export default function Web() {
  return (
    <section className="bg-background relative h-screen">
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
          <form
            action={async () => {
              "use server"
              await signIn("google")
            }}
          >
            <FlipButton type="submit" className="mr-3">
              <FlipButtonFront className="w-full text-base font-bold" variant={"outline"} size={"google-spec"}>
                Get Started
              </FlipButtonFront>
              <FlipButtonBack variant={"google-spec"} size={"google-spec"}>
                <div className="flex items-center">
                  <div className="mr-[10px] h-[25px] w-[25px]">
                    {false ? <Spinner className="size-[25px]" /> : <GoogleIcon />}
                  </div>
                  <span className={`${roboto.className}`}>Sign in with Google</span>
                </div>
              </FlipButtonBack>
            </FlipButton>
          </form>
        </div>
      </div>
    </section>
  )
}
