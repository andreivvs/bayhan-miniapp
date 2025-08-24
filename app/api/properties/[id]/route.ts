import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const property = await prisma.property.findUnique({
    where: { id },
    include: { slots: true, shares: true },
  });

  return NextResponse.json(property);
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const data = await req.json();

  const updated = await prisma.property.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated, { status: 200 });
}
