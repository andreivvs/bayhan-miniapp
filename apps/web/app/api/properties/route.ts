import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const props = await prisma.property.findMany({
    select: { id: true, title: true, location: true, rooms: true, areaM2: true, gallery: true }
  })
  return NextResponse.json(props.map(p => ({ ...p, gallery: (p.gallery as any[]) ?? [] })))
}
