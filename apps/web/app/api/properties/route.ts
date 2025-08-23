import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Получаем все свойства из базы
    const props = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        location: true,  // если есть в схеме
        rooms: true,     // если есть в схеме
        areaM2: true,    // если есть в схеме
        gallery: true,   // Json | null
      },
    })

    // Приводим gallery к массиву и id к string
    const result = props.map(p => ({
      id: p.id.toString(),
      title: p.title,
      location: p.location ?? '',
      rooms: p.rooms ?? 0,
      areaM2: p.areaM2 ?? 0,
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.error('Error in /api/properties:', err)
    return NextResponse.json({ error: 'internal server error' }, { status: 500 })
  }
}
