export async function POST(req: NextRequest, { params }) {
  const { id } = params;
  
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }) {
  const id = params.id;

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
