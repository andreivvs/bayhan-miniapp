'use client'
import { useEffect } from 'react'
import { init } from '@telegram-apps/sdk'

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Инициализация SDK Telegram Web App
    init()
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
