import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const propertyId = parseInt(params.id, 10) // тоже объявляем заранее

  const slots = await prisma.calendarSlot.findMany({
    where: { propertyId },
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      type: true,
      priority: true,
    },
  })

  return NextResponse.json(slots)
}

