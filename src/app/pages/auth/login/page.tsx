'use client'

import { supabase } from '@/utils/supabase' // путь к твоему supabase.ts
import translate from 'google-translate-api-x'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Вход через Supabase
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        })

      if (signInError) {
        let tr = await translate(signInError.message, { to: 'ru' })
        setError(tr.text)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Не удалось войти: пользователь не найден')
        setLoading(false)
        return
      }

      // Проверяем, подтвержден ли email
      if (!data.user.email_confirmed_at) {
        setError('Пожалуйста, подтвердите email через ссылку в письме')
        setLoading(false)
        return
      }

      // Получаем профиль с именем
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        setError('Не удалось загрузить профиль')
        setLoading(false)
        return
      }

      // Сохраняем данные пользователя локально
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          username: profile?.username || '',
        })
      )

      // Переход на страницу пользователя
      if (formData.name === profile.username) {
        router.push('/pages/user')
      } else {
        return <p>Вы не зарегистрировались</p>
      }
    } catch (err) {
      setError('Произошла ошибка при входе')
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen p-5 flex items-center justify-center bg-gradient-to-r from-blue-500 via-black to-blue-800 animate-gradient-x'>
      <main className='w-4/6 border border-gray-800 rounded-lg shadow-lg shadow-blue-800 text-white p-10 m-20 backdrop-blur-lg bg-gray-900/50'>
        <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
          <h1 className='text-center text-2xl font-bold'>Вход</h1>
          <input
            type='email'
            name='email'
            placeholder='Email ваш'
            className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            placeholder='Пароль ваш'
            className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0'
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type='text'
            name='name'
            placeholder='Ваше Имя'
            className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0'
            value={formData.name}
            onChange={handleChange}
            required
          />
          <button
            type='submit'
            disabled={loading}
            className='flex items-center justify-center cursor-pointer border border-blue-800 w-3/6 rounded-3xl p-2 bg-gray-950 mx-50'
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='text-white cursor-pointer transition-transform duration-300 hover:rotate-x-32 hover:scale-125 hover:translate-z-20 transform-gpu'
          >
            {showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          </button>
          {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
          <div className='flex gap-70'>
            <p>
              Нет аккаунта? <a href='../auth'>Зарегистрироваться</a>
            </p>
            <p>
              Забыли пароль? <a href='../recover-password'>Восстановить</a>
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}
