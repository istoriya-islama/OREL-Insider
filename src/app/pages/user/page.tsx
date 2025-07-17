'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import ORELInsider from '@/Components/ORELInsider'
import { HeaderAdmin } from '@/Components/HeaderAdmin' // если путь корректный

type User = {
  id: string
  name: string
  email: string
} | null

export default function UserPage() {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser()

      const userInfo = sessionData?.user
      if (!userInfo) {
        window.location.href = '/pages/auth'
        return
      }

      const userId = userInfo.id

      // Получаем username из profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single()

      if (profileError || !profile) {
        console.error('Ошибка загрузки профиля:', profileError)
        return
      }

      setUser({
        id: userId,
        name: profile.username,
        email: userInfo.email || '',
      })

      setLoading(false)
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <p className='text-center pt-70 text-4xl font-bold bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent'>
        Загрузка...
      </p>
    )
  }

  if (!user) return null

  return (
    <span>
      <HeaderAdmin />
      <div className='border border-blue-900/50 backdrop-blur-7xl p-10 m-10 rounded-2xl bg-gray-950/40 shadow-2xl shadow-blue-950'>
        <h1 className='text-5xl mb-6 font-extrabold'>
          Добро пожаловать, {user.name}!
        </h1>

        <ORELInsider />
      </div>
    </span>
  )
}
