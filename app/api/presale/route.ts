import { type NextRequest, NextResponse } from "next/server"
import { handlePresalePurchase, getUserPresaleInvestments } from "@/lib/actions"

const PRESALE_RATE = 1000 // 1000 tokens per 1 TON
const MIN_PURCHASE = 0.1 // Minimum 0.1 TON

export async function POST(request: NextRequest) {
  const { userId, tonAmount, txHash } = await request.json()
  const result = await handlePresalePurchase(userId, tonAmount, txHash)
  if (result.success) {
    return NextResponse.json(result)
  }
  return NextResponse.json({ error: result.error }, { status: 400 })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }
  const result = await getUserPresaleInvestments(userId)
  if (result.success) {
    return NextResponse.json(result)
  }
  return NextResponse.json({ error: result.error }, { status: 500 })
}
