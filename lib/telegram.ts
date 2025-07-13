interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
    start_param?: string
  }
  ready: () => void
  expand: () => void
  close: () => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    onClick: (callback: () => void) => void
  }
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy") => void
    notificationOccurred: (type: "error" | "success" | "warning") => void
    selectionChanged: () => void
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export const useTelegram = () => {
  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null

  const user = tg?.initDataUnsafe?.user
  const startParam = tg?.initDataUnsafe?.start_param

  return {
    tg,
    user,
    startParam,
    ready: () => tg?.ready(),
    expand: () => tg?.expand(),
    close: () => tg?.close(),
    haptic: tg?.HapticFeedback,
  }
}

export const validateTelegramWebAppData = (initData: string): boolean => {
  // In production, implement proper validation using bot token
  // For now, we'll do basic validation
  return initData.length > 0
}
