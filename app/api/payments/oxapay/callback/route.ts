import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Mock database - replace with your actual database
const users = [
  {
    id: "1",
    email: "demo@0xhub.pro",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    name: "Demo User",
    tier: "free",
    credits: 5,
    isAdmin: false,
    telegramId: "123456789",
    telegramUsername: "demouser",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    paymentHistory: [],
    upgradeStatus: "none",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get("signature")

    // Verify OxaPay signature for security
    if (!verifyOxaPaySignature(body, signature)) {
      console.error("Invalid OxaPay signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const { trackId, status, orderId, amount, currency, date } = body

    console.log("OxaPay callback received:", { trackId, status, orderId, amount })

    if (status === "Paid") {
      // Payment successful - process upgrade
      await processSuccessfulPayment(orderId, amount, currency, trackId, date)

      // Send notification to admin
      await notifyAdmin("payment_success", { orderId, amount, currency })

      return NextResponse.json({ success: true, message: "Payment processed successfully" })
    } else if (status === "Failed" || status === "Cancelled") {
      // Payment failed - update records
      await processFailedPayment(orderId, status, trackId)

      // Send notification to admin
      await notifyAdmin("payment_failed", { orderId, status })

      return NextResponse.json({ success: true, message: "Payment failure recorded" })
    }

    return NextResponse.json({ success: true, message: "Callback processed" })
  } catch (error) {
    console.error("OxaPay callback error:", error)

    // Send error notification to admin
    await notifyAdmin("callback_error", { error: error instanceof Error ? error.message : "Unknown error" })

    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 })
  }
}

function verifyOxaPaySignature(body: any, signature: string | null): boolean {
  if (!signature || !process.env.OXAPAY_API_KEY) {
    return false
  }

  try {
    // Create expected signature
    const payload = JSON.stringify(body)
    const expectedSignature = crypto.createHmac("sha256", process.env.OXAPAY_API_KEY).update(payload).digest("hex")

    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"))
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

async function processSuccessfulPayment(
  orderId: string,
  amount: number,
  currency: string,
  trackId: string,
  date: string,
) {
  try {
    // Find user by payment record
    const user = users.find((u) => u.paymentHistory.some((p: any) => p.oxapayOrderId === orderId))

    if (!user) {
      console.error("User not found for order:", orderId)
      return
    }

    // Find and update payment record
    const paymentRecord = user.paymentHistory.find((p: any) => p.oxapayOrderId === orderId)
    if (!paymentRecord) {
      console.error("Payment record not found for order:", orderId)
      return
    }

    // Update payment record
    paymentRecord.status = "completed"
    paymentRecord.completedAt = date
    paymentRecord.oxapayTrackId = trackId

    // Upgrade user tier and add credits
    const tier = paymentRecord.tier
    user.tier = tier
    user.upgradeStatus = "completed"

    // Add credits based on tier
    if (tier === "pro") {
      user.credits += 100
    } else if (tier === "enterprise") {
      user.credits += 500
    }

    console.log(`User ${user.id} upgraded to ${tier} with ${user.credits} credits`)

    // Send confirmation email/notification (implement as needed)
    await sendUpgradeConfirmation(user, tier)
  } catch (error) {
    console.error("Payment processing error:", error)
    throw error
  }
}

async function processFailedPayment(orderId: string, status: string, trackId: string) {
  try {
    // Find user by payment record
    const user = users.find((u) => u.paymentHistory.some((p: any) => p.oxapayOrderId === orderId))

    if (!user) {
      console.error("User not found for failed payment:", orderId)
      return
    }

    // Find and update payment record
    const paymentRecord = user.paymentHistory.find((p: any) => p.oxapayOrderId === orderId)
    if (paymentRecord) {
      paymentRecord.status = "failed"
      paymentRecord.oxapayTrackId = trackId
      user.upgradeStatus = "failed"
    }

    console.log(`Payment failed for user ${user.id}, order ${orderId}, status: ${status}`)
  } catch (error) {
    console.error("Failed payment processing error:", error)
  }
}

async function sendUpgradeConfirmation(user: any, tier: string) {
  // Implement email/notification sending
  console.log(`Sending upgrade confirmation to ${user.email} for ${tier} tier`)

  // You can integrate with your email service here
  // Example: SendGrid, Resend, etc.
}

async function notifyAdmin(type: string, data: any) {
  try {
    // Send notification to Telegram admin
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID) {
      const message = formatAdminMessage(type, data)

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      })
    }
  } catch (error) {
    console.error("Admin notification error:", error)
  }
}

function formatAdminMessage(type: string, data: any): string {
  const timestamp = new Date().toISOString()

  switch (type) {
    case "payment_success":
      return `🎉 <b>Payment Successful</b>
📅 ${timestamp}
💰 Amount: ${data.amount} ${data.currency}
📋 Order: ${data.orderId}`

    case "payment_failed":
      return `❌ <b>Payment Failed</b>
📅 ${timestamp}
📋 Order: ${data.orderId}
❗ Status: ${data.status}`

    case "callback_error":
      return `🚨 <b>Callback Error</b>
📅 ${timestamp}
❗ Error: ${data.error}`

    default:
      return `📊 <b>System Notification</b>
📅 ${timestamp}
📋 Type: ${type}
📄 Data: ${JSON.stringify(data)}`
  }
}
