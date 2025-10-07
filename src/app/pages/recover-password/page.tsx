'use client'

import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // 1. Проверяем email и username через RPC функцию
      const { data: isValid, error: checkError } = await supabase.rpc(
        'check_user_credentials',
        {
          user_email: email,
          user_name: username,
        }
      )

      if (checkError) {
        setError('Ошибка проверки данных')
        console.error(checkError)
        setLoading(false)
        return
      }

      // Если данные не совпадают
      if (!isValid) {
        setError('Email или имя указаны неверно')
        setLoading(false)
        return
      }

      // 2. Если всё ок - отправляем письмо для сброса пароля
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/pages/auth/update-password`,
        }
      )

      if (resetError) {
        setError('Ошибка отправки письма: ' + resetError.message)
        setLoading(false)
        return
      }

      setSuccess('Письмо для сброса пароля отправлено! Проверьте свою почту.')

      // Очищаем поля
      setEmail('')
      setUsername('')

      // Через 3 секунды перенаправляем на страницу входа
      setTimeout(() => {
        router.push('/pages/auth/login')
      }, 3000)
    } catch (err) {
      setError('Произошла ошибка. Попробуйте позже.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen p-5 flex items-center justify-center bg-gradient-to-r from-blue-500 via-black to-blue-800 animate-gradient-x'>
      <main className='w-4/6 border border-gray-800 rounded-lg shadow-lg shadow-blue-800 text-white p-10 m-20 backdrop-blur-lg bg-gray-900/50'>
        <form className='flex flex-col gap-5' onSubmit={handleResetPassword}>
          <h1 className='text-center text-2xl font-bold'>
            Восстановить Пароль
          </h1>

          <input
            type='email'
            name='email'
            placeholder='Email ваш'
            className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0 bg-gray-800/50'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type='text'
            name='username'
            placeholder='Ваше Имя'
            className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0 bg-gray-800/50'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <button
            type='submit'
            disabled={loading}
            className='flex items-center justify-center cursor-pointer border border-blue-800 w-3/6 rounded-3xl p-2 bg-gray-950 mx-auto hover:bg-blue-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Отправляется...' : 'Отправить'}
          </button>

          {error && (
            <p className='text-red-500 text-center mt-2 font-semibold'>
              {error}
            </p>
          )}
          {success && (
            <p className='text-green-500 text-center mt-2 font-semibold'>
              {success}
            </p>
          )}

          <div className='flex gap-10 justify-between text-sm'>
            <p>
              Нет аккаунта? <a href='/pages/auth'>Зарегистрироваться</a>
            </p>
            <p>
              У вас есть аккаунт? <a href='/pages/auth/login'>Войти</a>
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}
