import { type NextRequest, NextResponse } from "next/server"
import { OxaPayService } from "@/lib/oxapay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const hmacHeader = request.headers.get("hmac")

    if (!hmacHeader) {
      return NextResponse.json({ error: "Missing HMAC signature" }, { status: 400 })
    }

    const oxaPay = new OxaPayService()

    // Verify webhook signature
    const isValid = oxaPay.verifyWebhookSignature(body, hmacHeader)

    if (!isValid) {
      console.error("Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Process the payment based on status
    const { trackId, orderId, amount, currency, status, date, txID } = body

    console.log("Payment webhook received:", {
      trackId,
      orderId,
      amount,
      currency,
      status,
      date,
      txID,
    })

    switch (status) {
      case "Paid":
        // Payment successful - upgrade user to premium
        await handleSuccessfulPayment(orderId, trackId, amount, currency)
        break

      case "Waiting":
        // Payment pending
        await handlePendingPayment(orderId, trackId)
        break

      case "Expired":
        // Payment expired
        await handleExpiredPayment(orderId, trackId)
        break

      case "Failed":
        // Payment failed
        await handleFailedPayment(orderId, trackId)
        break

      default:
        console.log("Unknown payment status:", status)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleSuccessfulPayment(orderId: string, trackId: number, amount: number, currency: string) {
  try {
    // Extract session ID from order ID if it follows our format
    const sessionId = orderId.replace("order_", "").split("_")[0]

    // Here you would typically:
    // 1. Update user's premium status in database
    // 2. Send confirmation email
    // 3. Log the transaction

    console.log("Payment successful:", {
      sessionId,
      orderId,
      trackId,
      amount,
      currency,
    })

    // For now, we'll just log it since we're using localStorage
    // In a real app, you'd update a database
  } catch (error) {
    console.error("Error handling successful payment:", error)
  }
}

async function handlePendingPayment(orderId: string, trackId: number) {
  console.log("Payment pending:", { orderId, trackId })
  // Handle pending payment logic
}

async function handleExpiredPayment(orderId: string, trackId: number) {
  console.log("Payment expired:", { orderId, trackId })
  // Handle expired payment logic
}

async function handleFailedPayment(orderId: string, trackId: number) {
  console.log("Payment failed:", { orderId, trackId })
  // Handle failed payment logic
}
