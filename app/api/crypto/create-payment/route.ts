import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"

interface PaymentRequest {
  amount: string // Amount in ETH
  description: string
  userId: string
  projectId?: string
  currency?: "ETH" | "USDC" | "USDT"
}

interface PaymentRecord {
  id: string
  address: string
  amount: string
  currency: string
  description: string
  userId: string
  projectId?: string
  status: "pending" | "completed" | "expired" | "failed"
  createdAt: Date
  expiresAt: Date
  transactionHash?: string
  blockNumber?: number
  confirmations?: number
}

// In-memory storage for demo (use Redis or database in production)
const pendingPayments = new Map<string, PaymentRecord>()

function generatePaymentAddress(): string {
  // In production, generate unique addresses or use payment processors
  return process.env.MASTER_PAYOUT_ADDRESS || "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
}

function generatePaymentId(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function validateEthereumAddress(address: string): boolean {
  try {
    return ethers.isAddress(address)
  } catch {
    return false
  }
}

function validateAmount(amount: string): boolean {
  try {
    const num = Number.parseFloat(amount)
    return !isNaN(num) && num > 0 && num <= 10 // Max 10 ETH
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { amount, description, userId, projectId, currency = "ETH" }: PaymentRequest = await request.json()

    // Validation
    if (!amount || !description || !userId) {
      return NextResponse.json({ error: "Amount, description, and user ID are required" }, { status: 400 })
    }

    if (!validateAmount(amount)) {
      return NextResponse.json({ error: "Invalid amount. Must be between 0 and 10 ETH." }, { status: 400 })
    }

    if (description.length > 200) {
      return NextResponse.json({ error: "Description too long. Maximum 200 characters." }, { status: 400 })
    }

    if (!["ETH", "USDC", "USDT"].includes(currency)) {
      return NextResponse.json({ error: "Unsupported currency. Use ETH, USDC, or USDT." }, { status: 400 })
    }

    // Generate payment details
    const paymentId = generatePaymentId()
    const paymentAddress = generatePaymentAddress()

    if (!validateEthereumAddress(paymentAddress)) {
      return NextResponse.json({ error: "Invalid payment address configuration" }, { status: 500 })
    }

    // Create payment record
    const payment: PaymentRecord = {
      id: paymentId,
      address: paymentAddress,
      amount,
      currency,
      description,
      userId,
      projectId,
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    }

    pendingPayments.set(paymentId, payment)

    // Generate QR code data
    const qrCodeData =
      currency === "ETH"
        ? `ethereum:${paymentAddress}?value=${ethers.parseEther(amount).toString()}`
        : `ethereum:${paymentAddress}?value=${amount}&token=${currency}`

    // In production, save to database and set up monitoring
    // await savePaymentRecord(payment)
    // await schedulePaymentMonitoring(paymentId)

    return NextResponse.json({
      success: true,
      data: {
        paymentId,
        address: paymentAddress,
        amount,
        currency,
        description,
        expiresAt: payment.expiresAt.toISOString(),
        qrCode: qrCodeData,
        estimatedConfirmationTime: "2-5 minutes",
        networkFee: "~$2-10 (varies with network congestion)",
      },
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Failed to create payment. Please try again." }, { status: 500 })
  }
}

// Get payment status
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
        amount: payment.amount,
        currency: payment.currency,
        description: payment.description,
        userId: payment.userId,
        projectId: payment.projectId,
        status: payment.status,
        createdAt: payment.createdAt.toISOString(),
        expiresAt: payment.expiresAt.toISOString(),
        transactionHash: payment.transactionHash,
        blockNumber: payment.blockNumber,
        confirmations: payment.confirmations,
      },
    })
  } catch (error) {
    console.error("Payment status retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve payment status. Please try again." }, { status: 500 })
  }
}
