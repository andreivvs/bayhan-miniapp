import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // Получаем свойства из базы
  const props = await prisma.property.findMany({
    select: {
      id: true,
      title: true,
      gallery: true,
      // Если у тебя есть другие поля, например location, rooms, areaM2
      location: true,
      rooms: true,
      areaM2: true,
    },
  })

  // Преобразуем поля к plain objects
  const result = props.map(p => ({
    id: p.id.toString(),               // если id число или BigInt
    title: p.title,
    location: p.location ?? '',
    rooms: p.rooms ?? 0,
    areaM2: p.areaM2 ?? 0,
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
  }))

  return NextResponse.json(result)
}
