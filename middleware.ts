import NextAuth from "next-auth"
import authConfig from "./auth.config"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}

const { auth } = NextAuth({ ...authConfig })

export default auth((req) => {
  if (!req.auth) {
    if (req.nextUrl.pathname.startsWith("/auth")) {
      const signinUrl = new URL(`/?callbackUrl=${req.nextUrl.pathname}`, req.nextUrl.origin)
      return Response.redirect(signinUrl)
    }
  }
})
