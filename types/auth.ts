export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  isAdmin: boolean
  createdAt: string
  lastLogin: string
  websites: Website[]
  domains: Domain[]
}

export interface Website {
  id: string
  name: string
  description: string
  language: string
  hostedUrl: string
  npxCommand: string
  createdAt: string
  lastModified: string
  deploymentStatus: "deployed" | "building" | "failed"
}

export interface Domain {
  id: string
  domain: string
  websiteId: string
  status: "pending" | "active" | "failed"
  dnsRecords: DNSRecord[]
  createdAt: string
  verifiedAt?: string
}

export interface DNSRecord {
  type: "CNAME" | "A" | "TXT"
  name: string
  value: string
  ttl: number
}

export interface PaymentRecord {
  id: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  tier: "pro" | "enterprise"
  createdAt: string
  completedAt?: string
  oxapayOrderId?: string
  oxapayTrackId?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}
