import { type NextRequest, NextResponse } from "next/server"

interface OxaPayRequest {
  amount: number
  currency: string
  orderId: string
  callbackUrl: string
  returnUrl: string
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const { packageId, amount, currency = "USD" } = await request.json()

    if (!packageId || !amount) {
      return NextResponse.json({ error: "Package ID and amount are required" }, { status: 400 })
    }

    const orderId = `genui_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // OxaPay API integration
    const oxaPayRequest: OxaPayRequest = {
      amount,
      currency,
      orderId,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/oxapay/callback`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      description: `GenUI ${packageId} package`,
    }

    // Make request to OxaPay API
    const oxaPayResponse = await fetch("https://api.oxapay.com/merchants/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OXAPAY_API_KEY}`,
      },
      body: JSON.stringify(oxaPayRequest),
    })

    if (!oxaPayResponse.ok) {
      throw new Error("OxaPay API request failed")
    }

    const oxaPayData = await oxaPayResponse.json()

    // Store payment record in database
    const paymentRecord = {
      id: orderId,
      packageId,
      amount,
      currency,
      status: "pending",
      oxaPayId: oxaPayData.trackId,
      paymentUrl: oxaPayData.payLink,
      createdAt: new Date().toISOString(),
    }

    // Save to database (implement your database logic here)
    // await savePaymentRecord(paymentRecord)

    return NextResponse.json({
      success: true,
      paymentId: orderId,
      paymentUrl: oxaPayData.payLink,
      trackId: oxaPayData.trackId,
    })
  } catch (error) {
    console.error("OxaPay payment creation error:", error)
    return NextResponse.json(
      {
        error: "Failed to create payment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
