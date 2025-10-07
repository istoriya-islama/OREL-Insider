'use client'

import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UpdatePassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const router = useRouter()

  // Проверяем есть ли валидный токен при загрузке страницы
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setIsValidToken(true)
      } else {
        setError(
          'Недействительная или устаревшая ссылка. Запросите новую ссылку для сброса пароля.'
        )
      }
    }

    checkSession()
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Проверка что пароли совпадают
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают!')
      return
    }

    // Проверка длины пароля
    if (newPassword.length < 8) {
      setError('Пароль должен быть минимум 8 символов')
      return
    }

    // Проверка на сложность пароля (опционально)
    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasLowerCase = /[a-z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError(
        'Пароль должен содержать: заглавные буквы, строчные буквы и цифры'
      )
      return
    }

    setLoading(true)

    try {
      // Обновляем пароль
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError('Ошибка обновления пароля: ' + updateError.message)
        setLoading(false)
        return
      }

      setSuccess('Пароль успешно изменён! Перенаправление...')

      // Очищаем поля
      setNewPassword('')
      setConfirmPassword('')

      // Через 2 секунды выходим и перенаправляем на страницу входа
      setTimeout(async () => {
        await supabase.auth.signOut()
        router.push('/pages/auth/login')
      }, 2000)
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
        {!isValidToken ? (
          <div className='flex flex-col gap-5 text-center'>
            <h1 className='text-2xl font-bold text-red-500'>Ошибка</h1>
            <p>{error}</p>
            <a
              href='/pages/auth/reset-password'
              className='text-blue-400 hover:underline'
            >
              Запросить новую ссылку
            </a>
          </div>
        ) : (
          <form className='flex flex-col gap-5' onSubmit={handleUpdatePassword}>
            <h1 className='text-center text-2xl font-bold'>Новый Пароль</h1>

            <input
              type={showPassword ? 'text' : 'password'}
              name='newPassword'
              placeholder='Введите новый пароль'
              className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0 bg-gray-800/50'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={6}
            />

            <input
              type={showPassword ? 'text' : 'password'}
              name='confirmPassword'
              placeholder='Повторите пароль'
              className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0 bg-gray-800/50'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />

            <div className='text-xs text-gray-400 bg-gray-800/30 p-3 rounded-lg'>
              <p className='font-semibold mb-1'>Требования к паролю:</p>
              <ul className='list-disc list-inside space-y-1'>
                <li>Минимум 8 символов</li>
                <li>Содержит заглавные буквы (A-Z)</li>
                <li>Содержит строчные буквы (a-z)</li>
                <li>Содержит цифры (0-9)</li>
              </ul>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='flex items-center justify-center cursor-pointer border border-blue-800 w-3/6 rounded-3xl p-2 bg-gray-950 mx-auto hover:bg-blue-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Обновляется...' : 'Изменить пароль'}
            </button>

            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='text-white cursor-pointer transition-transform duration-300 hover:rotate-x-32 hover:scale-125 hover:translate-z-20 transform-gpu'
            >
              {showPassword ? 'Скрыть пароли' : 'Показать пароли'}
            </button>

            {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
            {success && (
              <p className='text-green-500 text-center mt-2'>{success}</p>
            )}

            <div className='text-center text-sm'>
              <a
                href='/pages/auth/login'
                className='text-white cursor-pointer transition-transform duration-300 hover:rotate-x-32 hover:scale-125 hover:translate-z-20 transform-gpu'
              >
                ← Вернуться к входу
              </a>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
