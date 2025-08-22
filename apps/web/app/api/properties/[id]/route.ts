import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const propertyId = parseInt(params.id, 10)  // преобразуем string → number

  if (isNaN(propertyId)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 })
  }

  const prop = await prisma.property.findUnique({
    where: { id: propertyId },
  })

  if (!prop) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...prop,
    gallery: (prop.gallery as any[]) ?? [],
  })
}
