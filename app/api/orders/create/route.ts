import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import Order from "@/lib/models/Order"
import Referral from "@/lib/models/Referral"
import { getUserFromRequest } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = await getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { serviceId, serviceName, platform, link, quantity, cost } = await request.json()

    if (!serviceId || !serviceName || !platform || !link || !quantity || !cost) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.balance < cost) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    const orderId = `CB${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Create order with SMMFlare (mock for now)
    let smmFlareOrderId = null
    try {
      // const smmFlare = new SMMFlareAPI()
      // const smmFlareOrder = await smmFlare.createOrder({
      //   service: serviceId,
      //   link,
      //   quantity,
      // })
      // smmFlareOrderId = smmFlareOrder.order

      // Mock response for now
      smmFlareOrderId = Math.floor(Math.random() * 1000000)
    } catch (error) {
      console.error("SMMFlare order creation failed:", error)
    }

    const order = new Order({
      orderId,
      userId,
      serviceId,
      serviceName,
      platform,
      link,
      quantity,
      cost,
      smmFlareOrderId,
      status: "pending",
    })

    await order.save()

    // Deduct balance
    user.balance -= cost
    user.totalSpent += cost
    user.totalOrders += 1
    await user.save()

    // Handle referral commission
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy)
      if (referrer) {
        const commission = cost * 0.05 // 5% commission

        const referral = new Referral({
          referrerId: referrer._id,
          referredId: user._id,
          commission,
          orderId: order._id,
        })

        await referral.save()

        referrer.referralEarnings += commission
        referrer.balance += commission
        await referrer.save()
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.orderId,
        status: order.status,
        smmFlareOrderId: order.smmFlareOrderId,
      },
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
