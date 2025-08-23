import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

async function main() {
  // create a demo user (will be overwritten on first login)
  const user = await prisma.user.upsert({
    where: { telegramId: 1n },
    update: {},
    create: {
      telegramId: 1n,
      username: 'demo_user',
      firstName: 'Demo',
      lastName: 'Owner'
    }
  })

  const prop = await prisma.property.create({
    data: {
      title: 'Villa Bayhan — Antalya',
      location: 'Antalya, Turkey',
      rooms: 4,
      areaM2: 180,
      gallery: [ 'https://picsum.photos/seed/bayhan/1200/800' ],
      coordinates: { lat: 36.8841, lng: 30.7056 }
    }
  })

  const share = await prisma.share.create({
    data: { propertyId: prop.id, ownerId: user.id, fraction: '1/8' }
  })

  // generate 8 weekly slots starting next Monday
  const start = dayjs().startOf('week').add(1, 'week') // next Monday
  const slots = []
  for (let i = 0; i < 8; i++) {
    const s = start.add(i, 'week')
    slots.push({
      propertyId: prop.id,
      startDate: s.toDate(),
      endDate: s.add(6, 'day').toDate(),
      type: i % 3 === 0 ? 'BLOCKED_HOLIDAY' : 'AVAILABLE',
      priority: i % 4 === 0
    } as any)
  }
  await prisma.calendarSlot.createMany({ data: slots })
  console.log('Seed completed:', { user: user.username, property: prop.title })
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
