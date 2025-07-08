"use client"

import { createContext, useContext, useRef, type ReactNode } from "react"

interface SoundContextType {
  playSound: (soundName: string) => void
  toggleMute: () => void
  isMuted: boolean
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: ReactNode }) {
  const isMuted = useRef(false)

  // Create simple beep sounds using Web Audio API
  const createBeep = (frequency: number, duration: number, type: OscillatorType = "sine") => {
    if (typeof window === "undefined" || isMuted.current) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      // Silently fail if Web Audio API is not supported
      console.warn("Web Audio API not supported")
    }
  }

  const playSound = (soundName: string) => {
    if (isMuted.current) return

    switch (soundName) {
      case "click":
        createBeep(800, 0.1)
        break
      case "success":
        createBeep(600, 0.2)
        setTimeout(() => createBeep(800, 0.2), 100)
        break
      case "error":
        createBeep(300, 0.3, "sawtooth")
        break
      case "battle":
        createBeep(400, 0.1, "square")
        setTimeout(() => createBeep(500, 0.1, "square"), 50)
        setTimeout(() => createBeep(600, 0.1, "square"), 100)
        break
      case "victory":
        createBeep(523, 0.2) // C
        setTimeout(() => createBeep(659, 0.2), 200) // E
        setTimeout(() => createBeep(784, 0.3), 400) // G
        break
      case "defeat":
        createBeep(400, 0.3, "sawtooth")
        setTimeout(() => createBeep(300, 0.3, "sawtooth"), 150)
        break
      case "harvest":
        createBeep(700, 0.1)
        setTimeout(() => createBeep(900, 0.1), 50)
        break
      case "mint":
        createBeep(1000, 0.2)
        setTimeout(() => createBeep(1200, 0.2), 100)
        setTimeout(() => createBeep(1400, 0.3), 200)
        break
      case "levelup":
        createBeep(523, 0.15) // C
        setTimeout(() => createBeep(659, 0.15), 100) // E
        setTimeout(() => createBeep(784, 0.15), 200) // G
        setTimeout(() => createBeep(1047, 0.3), 300) // C
        break
      case "notification":
        createBeep(800, 0.1)
        setTimeout(() => createBeep(1000, 0.1), 100)
        break
      default:
        createBeep(600, 0.1)
    }
  }

  const toggleMute = () => {
    isMuted.current = !isMuted.current
  }

  return (
    <SoundContext.Provider value={{ playSound, toggleMute, isMuted: isMuted.current }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}
