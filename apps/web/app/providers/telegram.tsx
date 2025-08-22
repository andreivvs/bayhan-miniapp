'use client'
import { useEffect } from 'react'
import { init } from '@telegram-apps/sdk'

// Расширяем глобальный тип Window
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: Record<string, any>
        expand?: () => void
        BackButton?: { show?: () => void }
      }
    }
  }
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Инициализация Telegram Web App SDK
    init()

    // Получаем launch params
    const launchParams = window.Telegram?.WebApp?.initData || {}
    console.log('Telegram launch params:', launchParams)

    // expand to full height и показать back button
    window.Telegram?.WebApp?.expand?.()
    window.Telegram?.WebApp?.BackButton?.show?.()
  }, [])

  return <>{children}</>
}

function Initializer() {
  const lp = useLaunchParams()
  useEffect(() => {
    // expand to full height and show back button where supported
    const wa = (window as any)?.Telegram?.WebApp
    wa?.expand?.()
    wa?.BackButton?.show?.()
    // theme sync if needed: wa?.setHeaderColor?
  }, [lp])
  return null
}
