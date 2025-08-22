import { NextRequest, NextResponse } from 'next/server'
import { isInitDataValid, userFromInitData, tokenForUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { initData } = await req.json()
  if (!initData || !isInitDataValid(initData)) {
    return NextResponse.json({ error: 'invalid initData' }, { status: 401 })
  }
  const user = await userFromInitData(initData)
  if (!user) return NextResponse.json({ error: 'no user' }, { status: 401 })
  const token = tokenForUser(user)
  return NextResponse.json({ token })
}
