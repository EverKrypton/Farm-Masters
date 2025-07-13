interface OxaPayInvoiceRequest {
  amount: number
  currency: string
  lifeTime?: number
  feePaidByPayer?: number
  underPaidCover?: number
  callbackUrl?: string
  returnUrl?: string
  description?: string
  orderId?: string
  email?: string
}

interface OxaPayInvoiceResponse {
  result: number
  message: string
  trackId?: number
  payLink?: string
}

interface OxaPayWebhookData {
  trackId: number
  orderId: string
  amount: number
  currency: string
  status: string
  date: string
  txID: string
  hmac: string
}

export class OxaPayService {
  private apiKey: string
  private baseUrl = "https://api.oxapay.com"

  constructor() {
    this.apiKey = process.env.OXAPAY_API_KEY || ""
    if (!this.apiKey) {
      throw new Error("OXAPAY_API_KEY environment variable is required")
    }
  }

  async createInvoice(params: OxaPayInvoiceRequest): Promise<OxaPayInvoiceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/merchants/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchant: this.apiKey,
          ...params,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error creating OxaPay invoice:", error)
      throw error
    }
  }

  async getInvoiceStatus(trackId: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/merchants/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchant: this.apiKey,
          trackId: trackId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error getting OxaPay invoice status:", error)
      throw error
    }
  }

  verifyWebhookSignature(data: OxaPayWebhookData, receivedHmac: string): boolean {
    const crypto = require("crypto")
    const message = `${data.trackId}:${data.orderId}:${data.amount}:${data.currency}:${data.status}:${data.date}:${data.txID}`
    const expectedHmac = crypto.createHmac("sha512", this.apiKey).update(message).digest("hex")

    return expectedHmac === receivedHmac
  }

  static formatCryptoAmount(amount: number, currency: string): string {
    const rates = {
      BTC: 0.000025,
      ETH: 0.0004,
      USDT: 1.0,
      LTC: 0.02,
      BCH: 0.003,
    }

    const rate = rates[currency as keyof typeof rates] || 1
    return (amount * rate).toFixed(8)
  }
}
