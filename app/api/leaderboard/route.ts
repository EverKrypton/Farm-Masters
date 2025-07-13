import { type NextRequest, NextResponse } from "next/server"
import { getLeaderboard } from "@/lib/actions"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const result = await getLeaderboard(userId || undefined)
  if (result.success) {
    return NextResponse.json({ leaderboard: result.leaderboard, userRank: result.userRank })
  }
  return NextResponse.json({ error: result.error }, { status: 500 })
}
