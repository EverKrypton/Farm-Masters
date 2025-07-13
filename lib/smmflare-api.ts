interface SMMFlareService {
  service: number
  name: string
  type: string
  rate: string
  min: string
  max: string
  category: string
}

interface SMMFlareOrderRequest {
  key: string
  action: string
  service: number
  link: string
  quantity: number
}

interface SMMFlareOrderResponse {
  order?: number
  error?: string
}

interface SMMFlareStatusResponse {
  charge: string
  start_count: string
  status: string
  remains: string
  currency: string
}

export class SMMFlareAPI {
  private apiKey: string
  private baseUrl = "https://smmflare.com/api/v2"

  constructor() {
    this.apiKey = process.env.SMMFLARE_API_KEY || ""
    if (!this.apiKey) {
      throw new Error("SMMFLARE_API_KEY environment variable is required")
    }
  }

  async getServices(): Promise<SMMFlareService[]> {
    try {
      const formData = new FormData()
      formData.append("key", this.apiKey)
      formData.append("action", "services")

      const response = await fetch(this.baseUrl, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Error fetching SMMFlare services:", error)
      throw error
    }
  }

  async createOrder(params: {
    service: number
    link: string
    quantity: number
  }): Promise<SMMFlareOrderResponse> {
    try {
      const formData = new FormData()
      formData.append("key", this.apiKey)
      formData.append("action", "add")
      formData.append("service", params.service.toString())
      formData.append("link", params.link)
      formData.append("quantity", params.quantity.toString())

      const response = await fetch(this.baseUrl, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error creating SMMFlare order:", error)
      throw error
    }
  }

  async getOrderStatus(orderId: number): Promise<SMMFlareStatusResponse> {
    try {
      const formData = new FormData()
      formData.append("key", this.apiKey)
      formData.append("action", "status")
      formData.append("order", orderId.toString())

      const response = await fetch(this.baseUrl, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error getting SMMFlare order status:", error)
      throw error
    }
  }

  async getBalance(): Promise<{ balance: string; currency: string }> {
    try {
      const formData = new FormData()
      formData.append("key", this.apiKey)
      formData.append("action", "balance")

      const response = await fetch(this.baseUrl, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error getting SMMFlare balance:", error)
      throw error
    }
  }

  static calculatePrice(wholesalePrice: number, markup = 80): number {
    return Number.parseFloat((wholesalePrice * (1 + markup / 100)).toFixed(4))
  }

  static formatService(service: SMMFlareService, markup = 80) {
    return {
      id: service.service,
      name: service.name,
      category: service.category,
      type: service.type,
      wholesaleRate: Number.parseFloat(service.rate),
      rate: this.calculatePrice(Number.parseFloat(service.rate), markup),
      min: Number.parseInt(service.min),
      max: Number.parseInt(service.max),
      platform: this.extractPlatform(service.name),
    }
  }

  private static extractPlatform(serviceName: string): string {
    const name = serviceName.toLowerCase()
    if (name.includes("instagram")) return "instagram"
    if (name.includes("facebook")) return "facebook"
    if (name.includes("tiktok")) return "tiktok"
    if (name.includes("youtube")) return "youtube"
    if (name.includes("twitter")) return "twitter"
    if (name.includes("telegram")) return "telegram"
    return "other"
  }
}
