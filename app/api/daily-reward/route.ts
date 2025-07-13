import { type NextRequest, NextResponse } from "next/server"
import { claimDailyReward } from "@/lib/actions"

export async function POST(request: NextRequest) {
  const { userId } = await request.json()
  const result = await claimDailyReward(userId)
  if (result.success) {
    return NextResponse.json(result)
  }
  return NextResponse.json({ error: result.error, nextClaimTime: result.nextClaimTime }, { status: 400 })
}
