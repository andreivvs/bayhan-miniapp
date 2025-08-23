import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const properties = await prisma.property.findMany({
    include: { shares: true, slots: true },
  });

  const result = properties.map(p => ({
    id: p.id,
    title: p.title,
    location: p.location ?? '',
    rooms: p.rooms ?? 0,
    areaM2: p.areaM2 ?? 0,
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    coordinates: p.coordinates ?? null,
    shares: p.shares.map(s => ({
      id: s.id,
      ownerId: s.ownerId,
      fraction: s.fraction ?? null,
      bookings: s.bookings?.map(b => ({
        id: b.id,
        slotId: b.slotId,
        userId: b.userId,
        status: b.status,
        requestedAt: b.requestedAt.toISOString(),
      })) ?? []
    })),
    slots: p.slots.map(slot => ({
      id: slot.id,
      startDate: slot.startDate.toISOString(),
      endDate: slot.endDate.toISOString(),
      type: slot.type,
      priority: slot.priority,
    })),
  }));

  return NextResponse.json(result);
}
