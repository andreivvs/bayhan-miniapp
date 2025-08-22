'use client'
import { TelegramWebAppProvider, useLaunchParams } from '@telegram-apps/sdk-react'
import React, { useEffect } from 'react'

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  return (
    <TelegramWebAppProvider>
      <Initializer />
      {children}
    </TelegramWebAppProvider>
  )
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
