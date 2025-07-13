import { type NextRequest, NextResponse } from "next/server"
import { OxaPayService } from "@/lib/oxapay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, planName, email, orderId } = body

    if (!amount || !currency || !planName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const oxaPay = new OxaPayService()

    const invoiceData = {
      amount: Number.parseFloat(amount),
      currency: currency.toUpperCase(),
      lifeTime: 30, // 30 minutes
      feePaidByPayer: 1,
      underPaidCover: 5,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      description: `Payment for ${planName} plan`,
      orderId: orderId || `order_${Date.now()}`,
      email: email,
    }

    const response = await oxaPay.createInvoice(invoiceData)

    if (response.result === 100) {
      return NextResponse.json({
        success: true,
        trackId: response.trackId,
        payLink: response.payLink,
        message: response.message,
      })
    } else {
      return NextResponse.json({ error: response.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
