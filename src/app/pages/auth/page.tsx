'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
  })

  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ...existing code...
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (formData.password !== formData.passwordConfirm) {
      setError('Пароли не совпадают')
      return
    }

    if (!formData.email || !formData.password || !formData.name) {
      setError('Все поля обязательны')
      return
    }

    // Получаем всех пользователей из localStorage (и гарантируем массив!)
    let users = []
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
      users = Array.isArray(storedUsers) ? storedUsers : []
    } catch (err) {
      users = [] // если JSON.parse сломался — начинаем с пустого массива
    }

    // Проверка на дубликат
    const userExists = users.some((user: any) => user.email === formData.email)
    if (userExists) {
      setError('Этот email уже зарегистрирован')
      return
    }

    // Добавляем нового пользователя
    users.push({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })
    localStorage.setItem('users', JSON.stringify(users))

    // Сохраняем текущего пользователя
    localStorage.setItem(
      'user',
      JSON.stringify({
        name: formData.name,
        email: formData.email,
      })
    )

    // Переход на /pages/user
    router.push('/pages/user')
  }

  // ...existing code...

  return (
    <div className='w-full h-screen p-5 flex items-center justify-center bg-gradient-to-r from-blue-500 via-black to-blue-800 animate-gradient-x'>
      <main className='w-4/6 border border-gray-800 rounded-lg shadow-lg shadow-blue-800 text-white p-10 m-20 backdrop-blur-lg bg-gray-900/50'>
        <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
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
            className='flex items-center justify-center cursor-pointer border border-blue-800 w-3/6 rounded-3xl p-2 bg-gray-950 mx-50'
          >
            Отправить
          </button>
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='text-white cursor-pointer transition-transform duration-300 hover:rotate-x-32 hover:scale-125 hover:translate-z-20 transform-gpu'
          >
            {showPassword ? 'Скрыть пароли' : 'Показать пароли'}
          </button>
          {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
          <p>
            Уже есть аккаунт? <a href='auth/login'>Войти</a>
          </p>
        </form>
      </main>
    </div>
  )
}
