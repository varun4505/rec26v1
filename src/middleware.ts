import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const email = token?.email;

    const allowedEmails = [
      'lakshya.gupta2023b@vitstudent.ac.in',
      'varun.b2023@vitstudent.ac.in',
      'ayush.kumar2022a@vitstudent.ac.in',
      'ayush.kumar2022d@vitstudent.ac.in',
      'ajaythomas.k2023@vitstudent.ac.in'
    ];
    if (email && !(email.includes('2024') || email.includes('2025') || allowedEmails.includes(email))) {
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/quiz/:path*",
  ]
}
