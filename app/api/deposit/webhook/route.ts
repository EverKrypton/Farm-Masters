import { type NextRequest, NextResponse } from "next/server"
import { OxaPayAPI } from "@/lib/oxapay-api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const hmacHeader = request.headers.get("hmac")

    if (!hmacHeader) {
      return NextResponse.json({ error: "Missing HMAC signature" }, { status: 400 })
    }

    const oxaPay = new OxaPayAPI()
    const isValid = oxaPay.verifyWebhookSignature(body, hmacHeader)

    if (!isValid) {
      console.error("Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const { trackId, orderId, amount, currency, status, date, txID } = body

    console.log("Deposit webhook received:", {
      trackId,
      orderId,
      amount,
      currency,
      status,
      date,
      txID,
    })

    // Extract user ID from order ID
    const userId = orderId.split("_")[1]

    switch (status.toLowerCase()) {
      case "paid":
        await handleSuccessfulDeposit(userId, trackId, amount, currency, txID)
        break
      case "waiting":
        await handlePendingDeposit(userId, trackId)
        break
      case "expired":
        await handleExpiredDeposit(userId, trackId)
        break
      case "failed":
        await handleFailedDeposit(userId, trackId)
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing deposit webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleSuccessfulDeposit(
  userId: string,
  trackId: number,
  amount: number,
  currency: string,
  txID: string,
) {
  try {
    // Convert TRX to USD for user balance
    const usdAmount = amount * OxaPayAPI.getTRXRate()

    console.log("Deposit successful:", {
      userId,
      trackId,
      amount,
      currency,
      usdAmount,
      txID,
    })

    // TODO: Update user balance in database
    // await updateUserBalance(userId, usdAmount)
    // await updateDepositStatus(trackId, "completed", txID)

    // Send notification to user
    await sendDepositNotification(userId, usdAmount, "success")
  } catch (error) {
    console.error("Error handling successful deposit:", error)
  }
}

async function handlePendingDeposit(userId: string, trackId: number) {
  console.log("Deposit pending:", { userId, trackId })
  // TODO: Update deposit status to pending
}

async function handleExpiredDeposit(userId: string, trackId: number) {
  console.log("Deposit expired:", { userId, trackId })
  await sendDepositNotification(userId, 0, "expired")
}

async function handleFailedDeposit(userId: string, trackId: number) {
  console.log("Deposit failed:", { userId, trackId })
  await sendDepositNotification(userId, 0, "failed")
}

async function sendDepositNotification(userId: string, amount: number, status: string) {
  // TODO: Implement notification system (email, push, etc.)
  console.log(`Sending notification to user ${userId}: Deposit ${status} - $${amount}`)
}
