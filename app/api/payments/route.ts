import { type NextRequest, NextResponse } from "next/server"

interface PaymentRequest {
  packageId: string
  walletAddress: string
  transactionHash: string
  paymentMethod?: string
}

export async function POST(request: NextRequest) {
  try {
    const { packageId, walletAddress, transactionHash, paymentMethod = "crypto" }: PaymentRequest = await request.json()

    if (!packageId || !walletAddress || !transactionHash) {
      return NextResponse.json({ error: "Missing required payment information" }, { status: 400 })
    }

    // Simulate payment verification process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Credit amounts for each package
    const creditAmounts = {
      starter: 15,
      pro: 40,
      enterprise: 100,
    }

    const packagePrices = {
      starter: { usd: 10, eth: "0.004" },
      pro: { usd: 25, eth: "0.010" },
      enterprise: { usd: 50, eth: "0.020" },
    }

    const credits = creditAmounts[packageId as keyof typeof creditAmounts]
    const price = packagePrices[packageId as keyof typeof packagePrices]

    if (!credits || !price) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 })
    }

    // Simulate blockchain verification
    const isValidTransaction = transactionHash.startsWith("0x") && transactionHash.length > 10

    if (!isValidTransaction) {
      return NextResponse.json({ error: "Invalid transaction hash" }, { status: 400 })
    }

    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      paymentId,
      credits,
      packageId,
      transactionHash,
      walletAddress,
      price: paymentMethod === "crypto" ? `${price.eth} ETH` : `$${price.usd}`,
      status: "confirmed",
      timestamp: new Date().toISOString(),
      message: `Successfully added $${credits} credits to your account`,
    })
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json(
      {
        error: "Failed to process payment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
