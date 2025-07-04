'use client'

import { HeaderAdmin } from '@/Components/HeaderAdmin'
import { useEffect, useState } from 'react'

type User = {
  name: string
  email: string
  password?: string
} | null

export default function UserPage() {
  const [user, setUser] = useState<User>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [modalOpenN, setModalOpenN] = useState(false)
  const [newName, setNewName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      setUser(JSON.parse(userString))
    } else {
      window.location.href = 'auth'
    }
  }, [])

  const openModal = () => {
    setMessage('')
    setNewPassword('')
    setConfirmPassword('')
    setModalOpen(true)
  }
  const openModalN = () => {
    setMessage('')
    setNewName('')
    setModalOpenN(true)
  }

  const closeModal = () => setModalOpen(false)
  const closeModalN = () => setModalOpenN(false)

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      setMessage('Пароль должен быть не менее 6 символов')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Пароли не совпадают')
      return
    }

    if (user) {
      const updatedUser = { ...user, password: newPassword, name: newName }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setMessage('Пароль успешно обновлен')

      setTimeout(() => {
        closeModal()
      }, 1500)
    }
  }

  const handleChangeName = (e: React.FormEvent) => {
    e.preventDefault()

    if (newName.length < 1) {
      setMessage('Имя должен быть не менее 1 символов')
      return
    }

    if (user) {
      const updatedUser = { ...user, name: newName }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setMessage('Имя успешно обновлен')

      setTimeout(() => {
        closeModalN()
      }, 1500)
    }
  }
  if (!user) return null

  const handleDeleteAccount = () => {
    const userString = localStorage.getItem('user')
    const usersString = localStorage.getItem('users')

    if (!userString || !usersString) return

    const currentUser = JSON.parse(userString)
    const users = JSON.parse(usersString)

    // Удаляем пользователя из массива users по email
    const updatedUsers = users.filter((u: any) => u.email !== currentUser.email)

    // Сохраняем обновлённый массив пользователей
    localStorage.setItem('users', JSON.stringify(updatedUsers))

    // Удаляем текущего пользователя
    localStorage.removeItem('user')

    // Перенаправляем на /auth
    window.location.href = '/pages/auth'
  }

  const handleOutAccount = () => {
    window.location.href = '/'
  }

  return (
    <span>
      <HeaderAdmin user={user.name[0]} />
      <div className='border border-blue-900/50 backdrop-blur-7xl p-10 m-10 rounded-2xl bg-gray-950/40 shadow-2xl shadow-blue-950'>
        <h1 className='text-5xl mb-6 font-extrabold'>Ваш профиль:</h1>
        <div className='w-full mb-6'>
          <div className='float-left'>
            <p className=''>Имя: {user.name}</p>
          </div>
          <div className='float-right'>
            <button
              onClick={openModalN}
              className='mb-8 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition'
            >
              Сменить Имя
            </button>
          </div>
        </div>
        <br />
        <br />
        <p className='mb-2'>Эл. почта: {user.email}</p>

        <div className='w-full mb-6'>
          <div className='float-left'>
            <p className=''>Пароль: {'*'.repeat(user.password?.length || 0)}</p>
          </div>
          <div className='float-right'>
            <button
              onClick={openModal}
              className='mb-8 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition'
            >
              Сменить пароль
            </button>
          </div>
        </div>

        <button
            onClick={handleOutAccount}
            className='mt-10 bg-red-600/50 px-4 py-2 rounded hover:bg-red-700/50 transition float-right hover:scale-110 mr-4'
          >
            Выход аккаунт
          </button>
          <button
            onClick={handleDeleteAccount}
            className='mt-10 bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition hover:scale-110 float-right -mr-78'
          >
            Удалить аккаунт
          </button>
        <br />
        <br />

        {/* Модальное окно */}
        {modalOpen && (
          <div
            className='fixed inset-0 flex items-center justify-center bg-gray-950/20 backdrop-blur-3xl bg-opacity-70 z-50 text-white'
            onClick={closeModal}
          >
            <div
              className='bg-gray-900 rounded-lg p-6 w-full max-w-md'
              onClick={e => e.stopPropagation()} // Чтобы клик по модалке не закрывал
            >
              <h2 className='text-xl mb-4'>Сменить пароль</h2>
              <form
                onSubmit={handleChangePassword}
                className='flex flex-col gap-4'
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Новый пароль'
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0'
                  required
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Подтвердите новый пароль'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-white cursor-pointer transition-transform duration-300 hover:rotate-x-32 hover:scale-125 hover:translate-z-20 transform-gpu'
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
                      message.includes('успешно')
                        ? 'text-green-400'
                        : 'text-red-500'
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
        {modalOpenN && (
          <div
            className='fixed inset-0 flex items-center justify-center bg-gray-950/20 backdrop-blur-3xl bg-opacity-70 z-50 text-white'
            onClick={closeModalN}
          >
            <div
              className='bg-gray-900 rounded-lg p-6 w-full max-w-md'
              onClick={e => e.stopPropagation()} // Чтобы клик по модалке не закрывал
            >
              <h2 className='text-xl mb-4'>Сменить Имя</h2>
              <form onSubmit={handleChangeName} className='flex flex-col gap-4'>
                <input
                  type='text'
                  placeholder='Новое Имя'
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className='p-2 text-lg text-center shadow-xl shadow-blue-900/50 border border-gray-800 rounded-2xl outline-0'
                  required
                />
                <button
                  type='submit'
                  className='bg-blue-600 py-2 rounded text-white font-semibold'
                >
                  Обновить пароль
                </button>
                {message && (
                  <p
                    className={`mt-2 ${
                      message.includes('успешно')
                        ? 'text-green-400'
                        : 'text-red-500'
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
