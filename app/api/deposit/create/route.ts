import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import Deposit from "@/lib/models/Deposit"
import { getUserFromRequest } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = await getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate TRX amount (example rate: 1 USD = 10 TRX)
    const trxAmount = amount * 10

    const depositId = `DEP_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Create OxaPay invoice (mock for now since no merchant key)
    const mockOxaPayResponse = {
      result: 100,
      trackId: Math.floor(Math.random() * 1000000),
      payLink: `https://pay.oxapay.com/gateway?trackId=${Math.floor(Math.random() * 1000000)}`,
    }

    const deposit = new Deposit({
      depositId,
      userId,
      amount,
      trxAmount,
      trackId: mockOxaPayResponse.trackId,
      payLink: mockOxaPayResponse.payLink,
      status: "pending",
    })

    await deposit.save()

    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit.depositId,
        trackId: deposit.trackId,
        payLink: deposit.payLink,
        amount: deposit.trxAmount,
        currency: "TRX",
        status: deposit.status,
      },
    })
  } catch (error) {
    console.error("Error creating deposit:", error)
    return NextResponse.json({ error: "Failed to create deposit" }, { status: 500 })
  }
}
