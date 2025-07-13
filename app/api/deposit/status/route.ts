import { type NextRequest, NextResponse } from "next/server"
import { OxaPayAPI } from "@/lib/oxapay-api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trackId } = body

    if (!trackId) {
      return NextResponse.json({ error: "Track ID is required" }, { status: 400 })
    }

    const oxaPay = new OxaPayAPI()
    const response = await oxaPay.getInvoiceStatus(trackId)

    return NextResponse.json({
      success: true,
      status: response.status?.toLowerCase() || "unknown",
      amount: response.amount,
      currency: response.currency,
      txId: response.txID,
    })
  } catch (error) {
    console.error("Error checking deposit status:", error)
    return NextResponse.json({ error: "Failed to check deposit status" }, { status: 500 })
  }
}
