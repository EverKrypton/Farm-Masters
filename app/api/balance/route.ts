import { NextResponse } from "next/server"
import { SMMFlareAPI } from "@/lib/smmflare-api"

export async function GET() {
  try {
    const smmFlare = new SMMFlareAPI()
    const balance = await smmFlare.getBalance()

    return NextResponse.json({
      success: true,
      balance: balance.balance,
      currency: balance.currency,
    })
  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}
