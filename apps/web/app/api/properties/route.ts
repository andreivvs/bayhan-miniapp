import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Тип данных для Property
type Property = {
  id: string
  title: string
  location: string
  rooms: number
  areaM2: number
  gallery: string[]
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

    // Явно типизируем параметр p, gallery всегда массив
    const result = props.map((p: Property) => ({
      ...p,
      gallery: p.gallery ?? []
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.error('Error fetching properties:', err)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}
