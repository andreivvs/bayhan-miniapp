export const metadata = { title: 'Bayhan Mini‑App', description: 'Telegram WebApp' }
import './globals.css'
import { TelegramProvider } from './providers/telegram'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <QueryClientProvider client={queryClient}>
          <TelegramProvider>{children}</TelegramProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
