"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""

const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {stripePromise ? <Elements stripe={stripePromise}>{children}</Elements> : children}
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </>
  )
}
