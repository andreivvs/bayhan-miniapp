import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Парсер initData из Telegram WebApp (query string формат)
function parseTelegramInitData(initData: string) {
  const obj: Record<string, string> = {};
  initData.split('&').forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) obj[key] = decodeURIComponent(value);
  });
  return obj;
}

// POST: авторизация через Telegram initData
export async function POST(req: Request) {
  const { initData } = await req.json();

  if (!initData) {
    return NextResponse.json({ error: 'initData is required' }, { status: 400 });
  }

  const tgData = parseTelegramInitData(initData);
  if (!tgData.id) {
    return NextResponse.json({ error: 'Invalid initData' }, { status: 401 });
  }

  // Найти или создать пользователя
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

  // Генерируем JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );

  return NextResponse.json({ token });
}

// GET: получить данные пользователя
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
    include: {
      shares: {
        include: {
          bookings: true
        }
      }
    }
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Сериализация всех полей для Client Components
  const result = {
    id: user.id,
    telegramId: user.telegramId.toString(),
    username: user.username ?? null,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    role: user.role,
    shares: user.shares.map(s => ({
      id: s.id,
      propertyId: s.propertyId,
      fraction: s.fraction ?? null,
      bookings: s.bookings.map(b => ({
        id: b.id,
        slotId: b.slotId,
        status: b.status,
        requestedAt: b.requestedAt.toISOString(),
      }))
    }))
  };

  return NextResponse.json(result);
}
