import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { action } = await req.json() // 'APPROVE' | 'REJECT'

  const ex = await prisma.exchange.findUnique({ where: { id: params.id } })
  if (!ex) return NextResponse.json({ error: 'not found' }, { status: 404 })

  if (action === 'REJECT') {
    const upd = await prisma.exchange.update({ where: { id: ex.id }, data: { status: 'REJECTED' } })
    return NextResponse.json(upd)
  }

  if (action === 'APPROVE') {
    // For simplicity, we just mark APPROVED. Real swap of bookings/slots would be here in a transaction.
    const upd = await prisma.exchange.update({ where: { id: ex.id }, data: { status: 'APPROVED' } })
    return NextResponse.json(upd)
  }

  return NextResponse.json({ error: 'bad action' }, { status: 400 })
}
