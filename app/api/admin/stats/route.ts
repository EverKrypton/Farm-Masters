import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdminAuth(request)
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Mock data - replace with actual database queries
    const stats = {
      totalUsers: 15420,
      totalWebsites: 8934,
      totalRevenue: 45670,
      activeUsers: 3240,
      freeUsers: 12100,
      proUsers: 2890,
      enterpriseUsers: 430,
      websitesThisMonth: 1234,
      revenueThisMonth: 8950,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
