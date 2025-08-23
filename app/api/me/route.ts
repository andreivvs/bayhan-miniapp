import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

async function verifyTelegramInitData(initData: string) {
  // Можно добавить полноценную проверку Telegram WebApp initData,
  // например через HMAC, но здесь пример простого парсинга JSON
  try {
    return JSON.parse(Buffer.from(initData, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const { initData } = await req.json();

  if (!initData) {
    return NextResponse.json({ error: 'initData is required' }, { status: 400 });
  }

  const tgData = await verifyTelegramInitData(initData);
  if (!tgData?.id) {
    return NextResponse.json({ error: 'Invalid initData' }, { status: 401 });
  }

  // Ищем или создаём пользователя в базе
  let user = await prisma.user.findUnique({
    where: { telegramId: BigInt(tgData.id) },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegramId: BigInt(tgData.id),
        username: tgData.username ?? null,
        firstName: tgData.first_name ?? null,
        lastName: tgData.last_name ?? null,
      },
    });
  }

  // Генерируем JWT для фронтенда
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );

  return NextResponse.json({ token });
}

// GET запрос для получения данных пользователя
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let payload: any;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { shares: { include: { bookings: true } } },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Сериализация BigInt и Date
  const result = {
    id: user.id,
    telegramId: String(user.telegramId),
    username: user.username ?? null,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    role: user.role,
    shares: user.shares.map((s) => ({
      id: s.id,
      propertyId: s.propertyId,
      fraction: s.fraction ?? null,
      bookings: s.bookings.map((b) => ({
        id: b.id,
        slotId: b.slotId,
        status: b.status,
        requestedAt: b.requestedAt.toISOString(),
      })),
    })),
  };

  return NextResponse.json(result);
}
