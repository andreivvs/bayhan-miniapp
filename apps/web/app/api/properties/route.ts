import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET() {
  const props = await prisma.property.findMany({
    select: { id: true, title: true, location: true, rooms: true, areaM2: true, gallery: true }
  })
  return NextResponse.json(props.map(p => ({ ...p, gallery: (p.gallery as any[]) ?? [] })))
}
const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
  const b = await tx.booking.create({
    data: { shareId: share.id, slotId: slot.id, status: 'PENDING' }
  })
  await tx.calendarSlot.update({ where: { id: slot.id }, data: { type: 'BOOKED' } })
  return b
})
