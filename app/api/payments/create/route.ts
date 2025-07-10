import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"

interface PaymentRequest {
  amount: number // Amount in USD
  service: "domain" | "github"
  projectId: string
  userId?: string
}

interface PaymentRecord {
  id: string
  address: string
  amount_usd: number
  amount_eth: string
  service: string
  projectId: string
  userId?: string
  status: "pending" | "completed" | "expired" | "failed"
  createdAt: Date
  expiresAt: Date
  transactionHash?: string
}

// In-memory storage for demo
const pendingPayments = new Map<string, PaymentRecord>()

function generatePaymentId(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generatePaymentAddress(): string {
  return process.env.MASTER_PAYOUT_ADDRESS || "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
}

async function getEthPrice(): Promise<number> {
  try {
    // In production, use a real price API like CoinGecko
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
    const data = await response.json()
    return data.ethereum.usd
  } catch (error) {
    console.error("Failed to fetch ETH price:", error)
    // Fallback price
    return 2000
  }
}

export async function POST(request: NextRequest) {
  try {
    const { amount, service, projectId, userId }: PaymentRequest = await request.json()

    if (!amount || !service || !projectId) {
      return NextResponse.json({ error: "Amount, service, and project ID are required" }, { status: 400 })
    }

    if (!["domain", "github"].includes(service)) {
      return NextResponse.json({ error: "Invalid service type" }, { status: 400 })
    }

    // Validate amount based on service
    const expectedAmount = service === "domain" ? 5 : 10
    if (amount !== expectedAmount) {
      return NextResponse.json(
        { error: `Invalid amount for ${service} service. Expected $${expectedAmount}` },
        { status: 400 },
      )
    }

    // Get current ETH price and calculate ETH amount
    const ethPrice = await getEthPrice()
    const ethAmount = (amount / ethPrice).toFixed(6)

    const paymentId = generatePaymentId()
    const paymentAddress = generatePaymentAddress()

    const payment: PaymentRecord = {
      id: paymentId,
      address: paymentAddress,
      amount_usd: amount,
      amount_eth: ethAmount,
      service,
      projectId,
      userId,
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    }

    pendingPayments.set(paymentId, payment)

    const qrCodeData = `ethereum:${paymentAddress}?value=${ethers.parseEther(ethAmount).toString()}`

    return NextResponse.json({
      success: true,
      data: {
        paymentId,
        address: paymentAddress,
        amount_usd: amount,
        amount_eth: ethAmount,
        service,
        expiresAt: payment.expiresAt.toISOString(),
        qrCode: qrCodeData,
        ethPrice,
      },
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("paymentId")

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 })
    }

    const payment = pendingPayments.get(paymentId)

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        address: payment.address,
        amount_usd: payment.amount_usd,
        amount_eth: payment.amount_eth,
        service: payment.service,
        projectId: payment.projectId,
        status: payment.status,
        createdAt: payment.createdAt.toISOString(),
        expiresAt: payment.expiresAt.toISOString(),
        transactionHash: payment.transactionHash,
      },
    })
  } catch (error) {
    console.error("Payment status error:", error)
    return NextResponse.json({ error: "Failed to get payment status" }, { status: 500 })
  }
}
