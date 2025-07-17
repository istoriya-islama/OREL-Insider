'use client'

import { supabase } from '@/utils/supabase'
import translate from 'google-translate-api-x'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Auth() {
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
  const [info, setInfo] = useState('')

  const validateEmail = (email: string) => {
    // Простая проверка email
    return /\S+@\S+\.\S+/.test(email)
  }

  const validatePassword = (password: string) => {
    // Минимум 8 символов, хотя можно и больше
    return password.length >= 8
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    const { email, password, passwordConfirm, name } = formData

    // Валидация
    if (!email || !password || !passwordConfirm || !name) {
      setError('Все поля обязательны')
      setLoading(false)
      return
    }
    if (!validateEmail(email)) {
      setError('Некорректный email')
      setLoading(false)
      return
    }
    if (!validatePassword(password)) {
      setError('Пароль должен быть не менее 8 символов')
      setLoading(false)
      return
    }
    if (password !== passwordConfirm) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    // 1. Регистрируем
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      const tr = await translate(signUpError.message, { to: 'ru' })
      setError(tr.text)
      setLoading(false)
      return
    }

    // 2. Вход (теперь у нас будет токен)
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (signInError) {
      const tr = await translate(signInError.message, { to: 'ru' })
      setError(tr.text)
      setLoading(false)
      return
    }

    const userId = signInData.user.id

    // 3. Теперь безопасно вставить профиль
    const { error: profileInsertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: name,
      })

    if (profileInsertError) {
      setError('Ошибка создания профиля: ' + profileInsertError.message)
      setLoading(false)
      return
    }

    // 4. Если включена email-подтверждение
    if (!signInData.user.confirmed_at) {
      setInfo('Регистрация прошла! Подтвердите email.')
      setLoading(false)
      return
    }

    // 5. Всё прошло успешно — переход на профиль
    setLoading(false)
    router.push('/pages/user')
  }

  return (
    <div className='w-full h-screen p-5 flex items-center justify-center bg-gradient-to-r from-blue-500 via-black to-blue-800 animate-gradient-x'>
      <main className='w-4/6 border border-gray-800 rounded-lg shadow-lg shadow-blue-800 text-white p-10 m-20 backdrop-blur-lg bg-gray-900/50'>
        <form
          className='flex flex-col gap-5'
          onSubmit={handleSubmit}
          noValidate
        >
          <h1 className='text-center text-2xl font-bold'>Регистрация</h1>

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
            placeholder='Имя ваше'
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
            {loading ? 'Регистрация...' : 'Отправить'}
          </button>

          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='text-white cursor-pointer transition-transform duration-300 hover:rotate-x-32 hover:scale-125 hover:translate-z-20 transform-gpu'
          >
            {showPassword ? 'Скрыть пароли' : 'Показать пароли'}
          </button>

          {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
          {info && <p className='text-green-400 text-center mt-2'>{info}</p>}

          <p className='text-center'>
            Уже есть аккаунт? <a href='auth/login'>Войти</a>
          </p>
        </form>
      </main>
    </div>
  )
}
