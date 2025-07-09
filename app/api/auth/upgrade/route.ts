import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

// Mock database - replace with your actual database
const users = [
  {
    id: "1",
    email: "demo@0xhub.pro",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    name: "Demo User",
    tier: "pro",
    credits: 100,
    isAdmin: false,
    telegramId: "123456789",
    telegramUsername: "demouser",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    paymentHistory: [],
    upgradeStatus: "completed",
  },
]

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    // Find user
    const user = users.find((u) => u.id === decoded.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const { tier } = await request.json()

    if (!tier || !["pro", "enterprise"].includes(tier)) {
      return NextResponse.json({ message: "Invalid tier specified" }, { status: 400 })
    }

    // Check if user has pending payment
    const hasPendingPayment = user.paymentHistory.some(
      (payment: any) => payment.status === "pending" && payment.tier === tier,
    )

    if (hasPendingPayment) {
      return NextResponse.json(
        {
          message: "Payment verification in progress. Please wait for confirmation.",
          upgradeStatus: "pending",
        },
        { status: 202 },
      )
    }

    // Check if user has completed payment for this tier
    const hasCompletedPayment = user.paymentHistory.some(
      (payment: any) => payment.status === "completed" && payment.tier === tier,
    )

    if (!hasCompletedPayment) {
      // Create payment record and redirect to payment
      const paymentRecord = {
        id: Date.now().toString(),
        amount: tier === "pro" ? 5 : 25,
        currency: "USD",
        status: "pending",
        tier,
        createdAt: new Date().toISOString(),
        oxapayOrderId: `order_${Date.now()}`,
      }

      user.paymentHistory.push(paymentRecord)
      user.upgradeStatus = "pending"

      // Create OxaPay payment
      const paymentUrl = await createOxaPayPayment(paymentRecord, user)

      return NextResponse.json({
        message: "Payment required for upgrade",
        paymentUrl,
        paymentRecord,
        upgradeStatus: "pending",
      })
    }

    // Upgrade user if payment is completed
    user.tier = tier
    user.credits += tier === "pro" ? 100 : 500
    user.upgradeStatus = "completed"

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Upgrade successful",
    })
  } catch (error) {
    console.error("Upgrade error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

async function createOxaPayPayment(paymentRecord: any, user: any) {
  try {
    const oxapayResponse = await fetch("https://api.oxapay.com/merchants/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OXAPAY_API_KEY}`,
      },
      body: JSON.stringify({
        merchant: process.env.OXAPAY_MERCHANT_ID,
        amount: paymentRecord.amount,
        currency: paymentRecord.currency,
        lifeTime: 30, // 30 minutes
        feePaidByPayer: 1,
        underPaidCover: 2,
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/oxapay/callback`,
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?upgrade=success`,
        description: `GenUI ${paymentRecord.tier} upgrade for ${user.name}`,
        orderId: paymentRecord.oxapayOrderId,
        email: user.email,
      }),
    })

    if (!oxapayResponse.ok) {
      throw new Error("Failed to create OxaPay payment")
    }

    const oxapayData = await oxapayResponse.json()

    // Update payment record with OxaPay data
    paymentRecord.oxapayTrackId = oxapayData.trackId

    return oxapayData.payLink
  } catch (error) {
    console.error("OxaPay payment creation error:", error)
    throw error
  }
}
