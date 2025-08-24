import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // если у тебя другой путь — оставь свой

type RouteParams = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const property = await prisma.property.findUnique({
    where: { id },
    include: { slots: true, shares: true }, // оставь те include, что нужны
  })

  return NextResponse.json(property)
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const data = await req.json() // тело запроса
  const updated = await prisma.property.update({
    where: { id },
    data,
  })

  return NextResponse.json(updated, { status: 200 })
}

// GET-обработчик
export async function GET(req: NextRequest, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
    });

    if (!property) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
