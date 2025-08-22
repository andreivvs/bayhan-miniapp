'use client'
import { useParams } from 'next/navigation'
import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

type Property = {
  id: string
  title: string
  location: string
  rooms: number
  areaM2: number
  gallery: string[]
}

type Slot = {
  id: string
  startDate: string
  endDate: string
  type: 'AVAILABLE' | 'BLOCKED_HOLIDAY' | 'BOOKED'
  priority: boolean
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token') ?? ''
  const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error('request failed')
  return res.json()
}

export default function PropertyPage() {
  const { id } = useParams<{id: string}>()
  const qc = useQueryClient()

  const prop = useQuery({ queryKey: ['prop', id], queryFn: () => api<Property>(`/api/properties/${id}`) })
  const slots = useQuery({ queryKey: ['slots', id], queryFn: () => api<Slot[]>(`/api/properties/${id}/slots`) })

  const book = useMutation({
    mutationFn: (slotId: string) => api('/api/bookings', { method: 'POST', body: JSON.stringify({ propertyId: id, slotId }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['slots', id] }) }
  })

  if (prop.isLoading || slots.isLoading) return <div className='p-4'>Загрузка…</div>
  if (prop.isError || slots.isError) return <div className='p-4'>Ошибка загрузки</div>

  return (
    <main className='p-3 space-y-4'>
      <h1 className='text-xl font-semibold'>{prop.data!.title}</h1>
      <div className='text-sm opacity-80'>{prop.data!.location} • {prop.data!.rooms} комн • {prop.data!.areaM2} м²</div>

      <section className='space-y-2'>
        <div className='font-medium'>Доступные недели</div>
        <div className='grid gap-2'>
          {slots.data!.map(s => (
            <div key={s.id} className='flex items-center justify-between border rounded-lg p-2'>
              <div>
                <div className='font-medium'>{new Date(s.startDate).toLocaleDateString()} — {new Date(s.endDate).toLocaleDateString()}</div>
                <div className='text-xs opacity-70'>{s.type}{s.priority ? ' • приоритет' : ''}</div>
              </div>
              {s.type === 'AVAILABLE' ? (
                <button onClick={() => book.mutate(s.id)} className='px-3 py-1 rounded-md border'>
                  Забронировать
                </button>
              ) : (
                <span className='text-xs opacity-60'>Недоступно</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
