import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const props = await prisma.property.findMany({
      include: { shares: { include: { bookings: true } }, slots: true },
    });

    // Преобразуем объекты в plain objects
    const result = props.map(p => ({
      id: String(p.id),
      title: p.title,
      location: p.location ?? '',
      rooms: p.rooms ?? 0,
      areaM2: p.areaM2 ?? 0,
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      coordinates: p.coordinates ?? null,
      shares: (p.shares ?? []).map(s => ({
        id: String(s.id),
        ownerId: String(s.ownerId),
        fraction: s.fraction ?? null,
        bookings: (s.bookings ?? []).map(b => ({
          id: String(b.id),
          slotId: b.slotId,
          userId: String(b.userId),
          status: b.status,
          requestedAt: b.requestedAt.toISOString(),
        })),
      })),
      slots: (p.slots ?? []).map(slot => ({
        id: slot.id,
        startDate: slot.startDate.toISOString(),
        endDate: slot.endDate.toISOString(),
        type: slot.type,
        priority: slot.priority,
      })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
