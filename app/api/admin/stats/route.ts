import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import Order from "@/lib/models/Order"
import Deposit from "@/lib/models/Deposit"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = await getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findById(userId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const [totalUsers, totalOrders, totalRevenue, totalDeposits, pendingOrders, completedOrders, activeUsers] =
      await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: "$cost" } } }]),
        Deposit.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
        Order.countDocuments({ status: { $in: ["pending", "processing"] } }),
        Order.countDocuments({ status: "completed" }),
        User.countDocuments({ isActive: true }),
      ])

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalDeposits: totalDeposits[0]?.total || 0,
        pendingOrders,
        completedOrders,
        activeUsers,
      },
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
