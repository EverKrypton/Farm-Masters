import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type { TelegramUser } from "@/types/auth"

// Mock database - replace with your actual database
const users: any[] = [
  {
    id: "1",
    email: "demo@0xhub.pro",
    name: "Demo User",
    tier: "pro",
    credits: 100,
    isAdmin: false,
    telegramId: "123456789",
    telegramUsername: "demouser",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    paymentHistory: [],
    upgradeStatus: "completed",
  },
]

export async function POST(request: NextRequest) {
  try {
    const telegramData: TelegramUser = await request.json()

    // Verify Telegram authentication
    if (!verifyTelegramAuth(telegramData)) {
      return NextResponse.json({ message: "Invalid Telegram authentication" }, { status: 401 })
    }

    // Find or create user
    let user = users.find((u) => u.telegramId === telegramData.id.toString())

    if (!user) {
      // Create new user from Telegram data
      user = {
        id: Date.now().toString(),
        email: `${telegramData.username || telegramData.id}@telegram.user`,
        name: `${telegramData.first_name} ${telegramData.last_name || ""}`.trim(),
        tier: "free",
        credits: 5, // Welcome credits
        isAdmin: false,
        telegramId: telegramData.id.toString(),
        telegramUsername: telegramData.username,
        avatar: telegramData.photo_url,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        paymentHistory: [],
        upgradeStatus: "none",
      }
      users.push(user)
    } else {
      // Update last login
      user.lastLogin = new Date().toISOString()
      // Update profile info from Telegram
      user.name = `${telegramData.first_name} ${telegramData.last_name || ""}`.trim()
      user.avatar = telegramData.photo_url
      user.telegramUsername = telegramData.username
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        telegramId: user.telegramId,
        email: user.email,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" },
    )

    // Set secure cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    const { ...userWithoutSensitiveData } = user

    return NextResponse.json({
      user: userWithoutSensitiveData,
      token,
    })
  } catch (error) {
    console.error("Telegram auth error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

function verifyTelegramAuth(data: TelegramUser): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN not configured")
    return false
  }

  // Create verification string
  const { hash, ...authData } = data
  const dataCheckString = Object.keys(authData)
    .sort()
    .map((key) => `${key}=${authData[key as keyof typeof authData]}`)
    .join("\n")

  // Create secret key
  const secretKey = crypto.createHash("sha256").update(botToken).digest()

  // Create hash
  const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex")

  // Verify hash
  const isValid = calculatedHash === hash

  // Check auth date (should be within 24 hours)
  const authDate = new Date(data.auth_date * 1000)
  const now = new Date()
  const timeDiff = now.getTime() - authDate.getTime()
  const isRecent = timeDiff < 24 * 60 * 60 * 1000 // 24 hours

  return isValid && isRecent
}
