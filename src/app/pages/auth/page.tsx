'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import translate from 'google-translate-api-x'

export default function Register() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { email, password, passwordConfirm, name } = formData

    // простая валидация
    if (!email || !password || !passwordConfirm || !name) {
      setError('Все поля обязательны')
      setLoading(false)
      return
    }
    if (password !== passwordConfirm) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    try {
      // регистрация
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { username: name } },
      })

      if (signUpError) {
        const tr = await translate(signUpError.message, { to: 'ru' }).catch(() => null)
        setError(tr?.text || signUpError.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Не удалось создать пользователя')
        setLoading(false)
        return
      }

      // если подтверждение email выключено → сразу логиним и редиректим
      if (data.user.email_confirmed_at) {
        router.push('/pages/user')
      } else {
        setError('Проверьте почту и подтвердите email')
      }

    } catch (err) {
      setError('Ошибка при регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen p-5 flex items-center justify-center bg-gradient-to-r from-blue-500 via-black to-blue-800 animate-gradient-x'>
      <main className='w-4/6 border border-gray-800 rounded-lg shadow-lg shadow-blue-800 text-white p-10 m-20 backdrop-blur-lg bg-gray-900/50'>
        <form className='flex flex-col gap-5' onSubmit={handleSubmit} noValidate>
          <h1 className='text-center text-2xl font-bold'>Регистрация</h1>

          <input
            type='email'
            name='email'
            placeholder='Email'
            className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0'
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            placeholder='Пароль'
            className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0'
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type={showPassword ? 'text' : 'password'}
            name='passwordConfirm'
            placeholder='Повторите пароль'
            className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0'
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />

          <input
            type='text'
            name='name'
            placeholder='Ваше имя'
            className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0'
            value={formData.name}
            onChange={handleChange}
            required
          />

          <button
            type='submit'
            disabled={loading}
            className='flex items-center justify-center cursor-pointer border border-blue-800 w-3/6 rounded-3xl p-2 bg-gray-950 mx-50 disabled:opacity-50'
          >
            {loading ? 'Регистрируем...' : 'Отправить'}
          </button>

          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='text-white cursor-pointer transition-transform duration-300 hover:rotate-x-32 hover:scale-125 hover:translate-z-20 transform-gpu'
          >
            {showPassword ? 'Скрыть пароли' : 'Показать пароли'}
          </button>

          {error && <p className='text-red-500 text-center mt-2'>{error}</p>}

          <p className='text-center'>
            Уже есть аккаунт? <a href='/pages/auth/login'>Войти</a>
          </p>
        </form>
      </main>
    </div>
  )
}
