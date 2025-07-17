'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { HeaderAdmin } from '@/Components/HeaderAdmin'

type User = {
  id: string
  name: string
  email: string
  password?: string
} | null

export default function UserPage() {
  const [user, setUser] = useState<User>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenN, setModalOpenN] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  // Загрузка пользователя и имени из Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        window.location.href = '/auth'
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        window.location.href = '/auth'
        return
      }

      setUser({
        id: profile.id,
        name: profile.username,
        email: user.email || '',
      })
    }

    fetchUser()
  }, [])

  const openModal = () => {
    setMessage('')
    setNewPassword('')
    setConfirmPassword('')
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const openModalN = () => {
    setMessage('')
    setNewName('')
    setModalOpenN(true)
  }

  const closeModalN = () => setModalOpenN(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (newPassword.length < 8) {
      setMessage('Пароль должен быть не менее 8 символов')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Пароли не совпадают')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setMessage('Ошибка обновления пароля: ' + error.message)
    } else {
      setMessage('Пароль успешно обновлён')
      setTimeout(closeModal, 1500)
    }
  }

  const handleChangeName = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const trimmedName = newName.trim()

    if (trimmedName.length < 1) {
      setMessage('Имя должно быть не менее 1 символа')
      return
    }

    if (!user?.id) {
      setMessage('Пользователь не найден')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({ username: trimmedName })
      .eq('id', user.id)

    if (error) {
      setMessage('Ошибка обновления имени: ' + error.message)
      return
    }

    setUser({ ...user, name: trimmedName })
    setMessage('Имя успешно обновлено')
    setTimeout(closeModalN, 1500)
  }

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      alert('Пользователь не найден')
      return
    }

    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    if (deleteError) {
      alert('Ошибка при удалении профиля: ' + deleteError.message)
      return
    }

    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      alert('Ошибка при выходе: ' + signOutError.message)
      return
    }

    window.location.href = '/pages/auth'
  }

  const handleOutAccount = () => {
    supabase.auth.signOut().then(() => {
      window.location.href = '/'
    })
  }

  if (!user) return null

  return (
    <span>
      <HeaderAdmin />
      <div className='border border-blue-900/50 backdrop-blur-7xl p-10 m-10 rounded-2xl bg-gray-950/40 shadow-2xl shadow-blue-950'>
        <h1 className='text-5xl mb-6 font-extrabold'>Ваш профиль:</h1>

        <div className='w-full mb-6 flex justify-between items-center'>
          <p>Имя: {user.name}</p>
          <button
            onClick={openModalN}
            className='bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition'
          >
            Сменить Имя
          </button>
        </div>

        <p className='mb-2'>Эл. почта: {user.email}</p>

        <div className='w-full mb-6 flex justify-between items-center'>
          <p>Пароль: {'*'.repeat(user.password?.length || 8)}</p>
          <button
            onClick={openModal}
            className='bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition'
          >
            Сменить пароль
          </button>
        </div>

        <div className='flex justify-end gap-4 mt-10'>
          <button
            onClick={handleOutAccount}
            className='bg-red-600/50 px-4 py-2 rounded hover:bg-red-700/50 transition hover:scale-110'
          >
            Выйти
          </button>
          <button
            onClick={handleDeleteAccount}
            className='bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition hover:scale-110'
          >
            Удалить аккаунт
          </button>
        </div>

        {/* Модалка смены пароля */}
        {modalOpen && (
          <div
            className='fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 text-white'
            onClick={closeModal}
          >
            <div
              className='bg-gray-900 rounded-lg p-6 w-full max-w-md'
              onClick={e => e.stopPropagation()}
            >
              <h2 className='text-xl mb-4'>Сменить пароль</h2>
              <form onSubmit={handleChangePassword} className='flex flex-col gap-4'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Новый пароль'
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className='p-2 text-lg text-center border border-gray-800 rounded-2xl outline-none'
                  required
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Подтвердите новый пароль'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className='p-2 text-lg text-center border border-gray-800 rounded-2xl outline-none'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-white text-sm underline'
                >
                  {showPassword ? 'Скрыть пароли' : 'Показать пароли'}
                </button>
                <button
                  type='submit'
                  className='bg-blue-600 py-2 rounded text-white font-semibold'
                >
                  Обновить пароль
                </button>
                {message && (
                  <p
                    className={`mt-2 ${
                      message.includes('успешно') ? 'text-green-400' : 'text-red-500'
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>
              <button
                onClick={closeModal}
                className='mt-4 text-gray-400 hover:text-gray-200 text-sm'
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Модалка смены имени */}
        {modalOpenN && (
          <div
            className='fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 text-white'
            onClick={closeModalN}
          >
            <div
              className='bg-gray-900 rounded-lg p-6 w-full max-w-md'
              onClick={e => e.stopPropagation()}
            >
              <h2 className='text-xl mb-4'>Сменить Имя</h2>
              <form onSubmit={handleChangeName} className='flex flex-col gap-4'>
                <input
                  type='text'
                  placeholder='Новое Имя'
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className='p-2 text-lg text-center border border-gray-800 rounded-2xl outline-none'
                  required
                />
                <button
                  type='submit'
                  className='bg-blue-600 py-2 rounded text-white font-semibold'
                >
                  Обновить имя
                </button>
                {message && (
                  <p
                    className={`mt-2 ${
                      message.includes('успешно') ? 'text-green-400' : 'text-red-500'
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>
              <button
                onClick={closeModalN}
                className='mt-4 text-gray-400 hover:text-gray-200 text-sm'
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </span>
  )
}
