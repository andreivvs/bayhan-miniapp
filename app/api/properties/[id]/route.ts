import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Опционально: POST-обработчик (если нужен)
export async function POST(req: NextRequest, { params }) {
  const { id } = params;

  // Пример: обновление свойства
  const body = await req.json();

  try {
    const updatedProperty = await prisma.property.update({
      where: { id: Number(id) },
      data: body,
    });
    return NextResponse.json(updatedProperty);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
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
