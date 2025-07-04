'use client'

import { HeaderAdmin } from '@/Components/HeaderAdmin'
import ORELInsider from '@/Components/ORELInsider'
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

  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      setUser(JSON.parse(userString))
    } else {
      window.location.href = '/pages/auth'
    }
  }, [])

  const openModal = () => {
    setMessage('')
    setNewPassword('')
    setConfirmPassword('')
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

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
      const updatedUser = { ...user, password: newPassword }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setMessage('Пароль успешно обновлен')

      setTimeout(() => {
        closeModal()
      }, 1500)
    }
  }

  if (!user) return null

  return (
    <span>
      <HeaderAdmin user={user.name[0]} />
      <div className='border border-blue-900/50 backdrop-blur-7xl p-10 m-10 rounded-2xl bg-gray-950/40 shadow-2xl shadow-blue-950'>
        <h1 className='text-5xl mb-6 font-extrabold'>
          Добро пожаловать, {user.name}!
        </h1>

        <ORELInsider />
      </div>
    </span>
  )
}
