import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"

export async function POST(request: NextRequest) {
  try {
    const { paymentId, transactionHash } = await request.json()

    if (!paymentId || !transactionHash) {
      return NextResponse.json({ error: "Missing payment ID or transaction hash" }, { status: 400 })
    }

    // In production, you'd retrieve this from your database
    // const payment = await getPaymentRecord(paymentId)

    // For demo, we'll simulate payment verification
    const isValid = await verifyEthereumTransaction(transactionHash, paymentId)

    if (isValid) {
      // Update payment status
      // await updatePaymentStatus(paymentId, 'completed')

      return NextResponse.json({
        success: true,
        data: {
          paymentId,
          status: "completed",
          transactionHash,
          verifiedAt: new Date().toISOString(),
        },
      })
    } else {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}

async function verifyEthereumTransaction(txHash: string, paymentId: string): Promise<boolean> {
  try {
    // Connect to Ethereum network (use Infura, Alchemy, etc. in production)
    const provider = new ethers.JsonRpcProvider(
      process.env.ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
    )

    // Get transaction details
    const tx = await provider.getTransaction(txHash)
    if (!tx) {
      return false
    }

    // Verify transaction is confirmed
    const receipt = await provider.getTransactionReceipt(txHash)
    if (!receipt || receipt.status !== 1) {
      return false
    }

    // In production, verify:
    // 1. Transaction is to the correct address
    // 2. Amount matches expected amount
    // 3. Transaction is recent enough
    // 4. Transaction hasn't been used for another payment

    return true
  } catch (error) {
    console.error("Transaction verification error:", error)
    return false
  }
}
