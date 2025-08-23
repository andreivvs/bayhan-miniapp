export async function POST(req: NextRequest, { params }) {
  const { action } = await req.json();
  const exchangeId = BigInt(params.id);

  const ex = await prisma.exchange.findUnique({ where: { id: exchangeId } });
  if (!ex) return NextResponse.json({ error: 'not found' }, { status: 404 });

  if (action === 'REJECT') {
    const updated = await prisma.exchange.update({
      where: { id: exchangeId },
      data: { status: 'REJECTED' }
    });
    return NextResponse.json(updated);
  }

  if (action === 'APPROVE') {
    const updated = await prisma.exchange.update({
      where: { id: exchangeId },
      data: { status: 'APPROVED' }
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: 'invalid action' }, { status: 400 });
}
