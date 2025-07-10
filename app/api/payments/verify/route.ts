import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"

// Import the payments map from the create route
const pendingPayments = new Map<string, any>()

async function verifyEthereumTransaction(
  txHash: string,
  expectedAddress: string,
  expectedAmount: string,
): Promise<boolean> {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com")

    const tx = await provider.getTransaction(txHash)
    if (!tx) {
      return false
    }

    const receipt = await provider.getTransactionReceipt(txHash)
    if (!receipt || receipt.status !== 1) {
      return false
    }

    // Verify transaction details
    const isCorrectAddress = tx.to?.toLowerCase() === expectedAddress.toLowerCase()
    const isCorrectAmount = tx.value.toString() === ethers.parseEther(expectedAmount).toString()
    const isRecent = Date.now() - (tx.blockNumber || 0) * 12000 < 24 * 60 * 60 * 1000 // 24 hours

    return isCorrectAddress && isCorrectAmount && isRecent
  } catch (error) {
    console.error("Transaction verification error:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { paymentId, transactionHash } = await request.json()

    if (!paymentId || !transactionHash) {
      return NextResponse.json({ error: "Payment ID and transaction hash are required" }, { status: 400 })
    }

    const payment = pendingPayments.get(paymentId)

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    if (payment.status !== "pending") {
      return NextResponse.json({ error: "Payment is not pending" }, { status: 400 })
    }

    if (new Date() > payment.expiresAt) {
      payment.status = "expired"
      pendingPayments.set(paymentId, payment)
      return NextResponse.json({ error: "Payment has expired" }, { status: 400 })
    }

    // Verify the transaction
    const isValid = await verifyEthereumTransaction(transactionHash, payment.address, payment.amount_eth)

    if (isValid) {
      payment.status = "completed"
      payment.transactionHash = transactionHash
      pendingPayments.set(paymentId, payment)

      return NextResponse.json({
        success: true,
        data: {
          paymentId,
          status: "completed",
          transactionHash,
          service: payment.service,
          projectId: payment.projectId,
          verifiedAt: new Date().toISOString(),
        },
      })
    } else {
      return NextResponse.json({ error: "Transaction verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
