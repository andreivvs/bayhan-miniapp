import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } } // ← встроенный тип, без interface
) {
  const { action } = await req.json() // 'APPROVE' | 'REJECT'

  const exchangeId = BigInt(params.id)
  const ex = await prisma.exchange.findUnique({ where: { id: exchangeId } })

  if (!ex) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  if (action === 'REJECT') {
    const updated = await prisma.exchange.update({
      where: { id: exchangeId },
      data: { status: 'REJECTED' }
    })
    return NextResponse.json(updated)
  }

  if (action === 'APPROVE') {
    const updated = await prisma.exchange.update({
      where: { id: exchangeId },
      data: { status: 'AP
