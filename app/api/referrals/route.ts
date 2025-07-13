import { type NextRequest, NextResponse } from "next/server"
import { getReferralStats } from "@/lib/actions"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }
  const result = await getReferralStats(userId)
  if (result.success) {
    return NextResponse.json(result)
  }
  return NextResponse.json({ error: result.error }, { status: 500 })
}
