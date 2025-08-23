import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10) // переменную объявляем до Prisma-запроса

  const prop = await prisma.property.findUnique({
    where: { id },
  })

  if (!prop) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  return NextResponse.json({
    ...prop,
    gallery: (prop as any).gallery ?? [], // если gallery есть в схеме
  })
}
