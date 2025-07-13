import { type NextRequest, NextResponse } from "next/server"
import { OxaPayService } from "@/lib/oxapay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trackId } = body

    if (!trackId) {
      return NextResponse.json({ error: "Track ID is required" }, { status: 400 })
    }

    const oxaPay = new OxaPayService()
    const response = await oxaPay.getInvoiceStatus(trackId)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error checking payment status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
