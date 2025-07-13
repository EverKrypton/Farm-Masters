import { type NextRequest, NextResponse } from "next/server"
import { handleStakingAction, getUserStakingData } from "@/lib/actions"

const STAKING_APY = 0.12 // 12% APY
const MIN_STAKE = 1 // Minimum 1 TON

export async function POST(request: NextRequest) {
  const { userId, action, amount, positionId, txHash } = await request.json()
  const result = await handleStakingAction(userId, action, amount, positionId, txHash)
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
  const result = await getUserStakingData(userId)
  if (result.success) {
    return NextResponse.json(result)
  }
  return NextResponse.json({ error: result.error }, { status: 500 })
}
