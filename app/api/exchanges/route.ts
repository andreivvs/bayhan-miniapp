import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { fromBookingId, targetPropId, targetSlotId, message } = await req.json()

  // basic checks
  const fromBooking = await prisma.booking.findFirst({
    where: { id: fromBookingId, share: { ownerId: user.id } },
    include: { slot: true }
  })
  if (!fromBooking) return NextResponse.json({ error: 'booking not found' }, { status: 404 })

  const targetSlot = await prisma.calendarSlot.findFirst({ where: { id: targetSlotId, propertyId: targetPropId } })
  if (!targetSlot) return NextResponse.json({ error: 'target slot not found' }, { status: 404 })

  const ex = await prisma.exchange.create({
    data: {
      requesterId: user.id,
      fromBookingId,
      targetPropId,
      targetSlotId,
      message: message ?? null,
      status: 'PENDING'
    }
  })
  return NextResponse.json(ex, { status: 201 })
}
