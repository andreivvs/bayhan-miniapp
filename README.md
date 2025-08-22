# Bayhan Mini‑App (Telegram WebApp)

Monorepo:
- `apps/web` — Next.js + API routes + Prisma (PostgreSQL)
- `apps/bot` — Telegraf bot (notifications + entry button)

## Quick start

```bash
# 1) Install PNPM if needed
corepack enable

# 2) Install deps
pnpm i

# 3) Set env
cp apps/web/.env.example apps/web/.env
# edit DATABASE_URL, BOT_TOKEN, JWT_SECRET, WEBAPP_URL

# 4) Generate DB + seed
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 5) Run web
pnpm dev:web
# expose https with cloudflared/ngrok OR deploy to Vercel

# 6) Run the bot (long polling in dev)
pnpm dev:bot
```
