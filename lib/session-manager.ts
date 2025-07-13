interface Session {
  id: string
  createdAt: number
  isPremium: boolean
  logoData?: any
}

export class SessionManager {
  private static readonly SESSION_KEY = "logomaker_session"
  private static readonly LOGO_DATA_KEY = "logomaker_logo_data"
  private static readonly PREMIUM_KEY = "logomaker_premium"

  static getOrCreateSession(): Session {
    if (typeof window === "undefined") {
      return { id: "server", createdAt: Date.now(), isPremium: false }
    }

    let session = this.getSession()

    if (!session) {
      session = {
        id: this.generateSessionId(),
        createdAt: Date.now(),
        isPremium: false,
      }
      this.saveSession(session)
    }

    return session
  }

  static getSession(): Session | null {
    if (typeof window === "undefined") return null

    const sessionData = localStorage.getItem(this.SESSION_KEY)
    return sessionData ? JSON.parse(sessionData) : null
  }

  static saveSession(session: Session): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
  }

  static saveLogoData(sessionId: string, logoData: any): void {
    if (typeof window === "undefined") return
    const key = `${this.LOGO_DATA_KEY}_${sessionId}`
    localStorage.setItem(key, JSON.stringify(logoData))
  }

  static getLogoData(sessionId: string): any | null {
    if (typeof window === "undefined") return null
    const key = `${this.LOGO_DATA_KEY}_${sessionId}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  static saveDocsData(sessionId: string, docsData: any): void {
    if (typeof window === "undefined") return
    const key = `${this.LOGO_DATA_KEY}_docs_${sessionId}`
    localStorage.setItem(key, JSON.stringify(docsData))
  }

  static getDocsData(sessionId: string): any | null {
    if (typeof window === "undefined") return null
    const key = `${this.LOGO_DATA_KEY}_docs_${sessionId}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  static isPremiumSession(sessionId: string): boolean {
    if (typeof window === "undefined") return false
    const key = `${this.PREMIUM_KEY}_${sessionId}`
    return localStorage.getItem(key) === "true"
  }

  static upgradeToPremium(sessionId: string): void {
    if (typeof window === "undefined") return
    const key = `${this.PREMIUM_KEY}_${sessionId}`
    localStorage.setItem(key, "true")

    // Update session
    const session = this.getSession()
    if (session) {
      session.isPremium = true
      this.saveSession(session)
    }
  }

  private static generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  static clearSession(): void {
    if (typeof window === "undefined") return
    const session = this.getSession()
    if (session) {
      localStorage.removeItem(this.SESSION_KEY)
      localStorage.removeItem(`${this.LOGO_DATA_KEY}_${session.id}`)
      localStorage.removeItem(`${this.PREMIUM_KEY}_${session.id}`)
    }
  }
}
