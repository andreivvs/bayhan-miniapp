import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { requireAuth } from '@/lib/auth'

// GET: получаем все свойства (properties)
export async function GET(req: NextRequest) {
  const props = await prisma.property.findMany({
    select: { 
      id: true, 
      title: true, 
      location: true, 
      rooms: true, 
      areaM2: true, 
      gallery: true 
    }
  })

  // Явно типизируем gallery и убираем any
  const result = props.map(p => ({
    ...p,
    gallery: p.gallery ?? []  // gallery всегда массив
  }))

  return NextResponse.json(result)
}

// POST: создаём бронирование
export async function POST(req: NextRequest) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { slotId, propertyId } = await req.json()

  // Находим share пользователя для этого property
  const share = await prisma.share.findFirst({ where: { ownerId: user.id, propertyId } })
  if (!share) return NextResponse.json({ error: 'no share for property' }, { status: 403 })

  // Проверяем доступность слота
  const slot = await prisma.calendarSlot.findUnique({ where: { id: slotId } })
  if (!slot || slot.propertyId !== propertyId) return NextResponse.json({ error: 'slot not found' }, { status: 404 })
  if (slot.type !== 'AVAILABLE') return NextResponse.json({ error: 'slot not available' }, { status: 409 })

  // Создаём бронирование и помечаем слот как BOOKED
  const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const b = await tx.booking.create({
      data: { shareId: share.id, slotId: slot.id, status: 'PENDING' }
    })
    await tx.calendarSlot.update({ where: { id: slot.id }, data: { type: 'BOOKED' } })
    return b
  })

  return NextResponse.json(booking, { status: 201 })
}
