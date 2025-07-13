import { type NextRequest, NextResponse } from "next/server"
import { SMMFlareAPI } from "@/lib/smmflare-api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, smmFlareOrderId } = body

    if (!smmFlareOrderId) {
      return NextResponse.json({ error: "SMMFlare order ID is required" }, { status: 400 })
    }

    const smmFlare = new SMMFlareAPI()
    const status = await smmFlare.getOrderStatus(smmFlareOrderId)

    // Map SMMFlare status to our status
    const mappedStatus = mapSMMFlareStatus(status.status)

    // Here you would update the order status in your database
    // await updateOrderStatus(orderId, mappedStatus, status)

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        status: mappedStatus,
        charge: status.charge,
        startCount: status.start_count,
        remains: status.remains,
        currency: status.currency,
      },
    })
  } catch (error) {
    console.error("Error getting order status:", error)
    return NextResponse.json({ error: "Failed to get order status" }, { status: 500 })
  }
}

function mapSMMFlareStatus(smmFlareStatus: string): string {
  switch (smmFlareStatus.toLowerCase()) {
    case "pending":
      return "pending"
    case "in progress":
      return "processing"
    case "completed":
      return "completed"
    case "partial":
      return "partial"
    case "canceled":
      return "cancelled"
    default:
      return "unknown"
  }
}
