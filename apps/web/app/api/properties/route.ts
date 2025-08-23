import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // выбираем только реальные поля из схемы
  const props = await prisma.property.findMany({
    select: {
      id: true,
      title: true,
      location: true,   
      rooms: true,      
      areaM2: true,     
      gallery: true,   
    },
  })

  // приводим gallery к массиву и id к string если нужно
  const result = props.map(p => ({
    id: p.id.toString(),          
    location: p.location ?? '',
    rooms: p.rooms ?? 0,
    areaM2: p.areaM2 ?? 0,
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
  }))

  return NextResponse.json(result)
}


export async function GET(req: NextRequest) {
  try {
    // Получаем все свойства из базы
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

    } catch (err) {
    console.error('Error fetching properties:', err)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}
