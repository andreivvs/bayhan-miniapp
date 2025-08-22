import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  id: string
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { action } = await req.json() // 'APPROVE' | 'REJECT'

  const exchangeId = BigInt(params.id) // <-- преобразуем в BigInt
  const ex = await prisma.exchange.findUnique({ where: { id: exchangeId } })
  if (!ex) return NextResponse.json({ error: 'not found' }, { status: 404 })

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
      data: { status: 'APPROVED' }
    })
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: 'invalid action' }, { status: 400 })
}
