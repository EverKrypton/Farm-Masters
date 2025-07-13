import { type NextRequest, NextResponse } from "next/server"
import { initializeUser, updateUserWallet } from "@/lib/actions"

export async function POST(request: NextRequest) {
  try {
    const { telegramData, referralCode } = await request.json()
    const result = await initializeUser(telegramData.initDataUnsafe.user, referralCode)
    if (result.success) {
      return NextResponse.json({ user: result.user })
    }
    return NextResponse.json({ error: result.error }, { status: 500 })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, walletAddress } = await request.json()
    const result = await updateUserWallet(userId, walletAddress)
    if (result.success) {
      return NextResponse.json({ user: result.user })
    }
    return NextResponse.json({ error: result.error }, { status: 500 })
  } catch (error) {
    console.error("User update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
