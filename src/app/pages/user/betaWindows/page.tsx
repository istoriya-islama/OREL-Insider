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
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      setUser(JSON.parse(userString))
    } else {
      window.location.href = 'auth'
    }
  }, [])

  if (user) {
    const updatedUser = { ...user, password: newPassword }
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  if (!user) return null

  return (
    <span>
      <HeaderAdmin />
      <div className='border border-blue-900/50 backdrop-blur-7xl p-10 m-10 rounded-2xl bg-gray-950/40 shadow-2xl shadow-blue-950'>
        <h1 className='text-5xl mb-6 font-extrabold'>
          Beta версии программ для Windows:
        </h1>
        <div className='flex justify-center items-center gap-4'>
          <div className='bg-blue-950/20 backdrop-blur-3xl rounded-4xl p-5 shadow-2xl shadow-blue-500'>
            <img src='/code.ico' alt='OREL Code Editor' />
            <h1 className='text-xl font-bold'>OREL Editor Code</h1>
            <p className='text-md font-normal'>Версия: BETA</p>
            <p className='text-md font-normal'>
              Начало разработки: 3 июня 2024
            </p>
            <p className='text-md font-normal mb-2'>Конец разработки: ...</p>
            <a
              href='https://mega.nz/file/MqtjWASK#_gaEzJCII4C4eiYRxqkr6dico23vuqALnJJF4tWf0z4'
              className='text-center mx-25 mt-2 p-2 border border-blue-950/50 rounded-lg bg-gray-800 transition hover:bg-gray-900 shadow-xl shadow-blue-900 hover:scale-110'
            >
              Скачать
            </a>
          </div>
          <div className='bg-blue-950/20 backdrop-blur-3xl rounded-4xl p-5 shadow-2xl shadow-blue-500'>
            <img src='/paint.ico' alt='OREL Paint' />
            <h1 className='text-xl font-bold'>OREL Paint</h1>
            <p className='text-md font-normal'>Версия: BETA</p>
            <p className='text-md font-normal'>
              Начало разработки: 13 ноября 2023
            </p>
            <p className='text-md font-normal mb-2'>
              Конец разработки: 13 ноября 2023
            </p>
            <a
              href='https://mega.nz/file/wy1wzY5R#VtQqywDzbzTWN_mZ6gSKgC7vHahgujiadiKPvBut-vk'
              className='text-center mx-25 mt-2 p-2 border border-blue-950/50 rounded-lg bg-gray-800 transition hover:bg-gray-900 shadow-xl shadow-blue-900 hover:scale-110'
            >
              Скачать
            </a>
          </div>
          <div className='bg-blue-950/20 backdrop-blur-3xl rounded-4xl p-5 shadow-2xl shadow-blue-500'>
            <img src='/weather.ico' alt='OREL Погода' />
            <h1 className='text-xl font-bold'>OREL Weather 2.2</h1>
            <p className='text-md font-normal'>Версия: Beta</p>
            <p className='text-md font-normal'>
              Начало разработки: 4 августа 2025
            </p>
            <p className='text-md font-normal mb-2'>
              Конец разработки: 8 августа 2025
            </p>
            <a
              href='https://mega.nz/file/9n0nESRS#qOphmzqCx9YsAN3jdC_kF6bWjGTtWu48XRzrI2uRaQU'
              className='text-center mx-25 mt-2 p-2 border border-blue-950/50 rounded-lg bg-gray-800 transition hover:bg-gray-900 shadow-xl shadow-blue-900 hover:scale-110'
            >
              Скачать
            </a>
          </div>
        </div>
        <div className='flex justify-center items-center gap-4 mt-8'>
          <div className='bg-blue-950/20 backdrop-blur-3xl rounded-4xl p-5 shadow-2xl shadow-blue-500'>
            <img src='/weather.ico' alt='OREL Погода' />
            <h1 className='text-xl font-bold'>OREL Weather 2.2</h1>
            <p className='text-md font-normal'>Версия: Beta 2</p>
            <p className='text-md font-normal'>
              Начало разработки: 8 августа 2025
            </p>
            <p className='text-md font-normal mb-2'>
              Конец разработки: 11 августа 2025
            </p>
            <a
              href='https://mega.nz/file/o3NjDZyI#ZMdfI14qlO2xou0bV6Js2LbuZXAGQzMeRMW0otpxSq4'
              className='text-center mx-25 mt-2 p-2 border border-blue-950/50 rounded-lg bg-gray-800 transition hover:bg-gray-900 shadow-xl shadow-blue-900 hover:scale-110'
            >
              Скачать
            </a>
          </div>
          <div className='bg-blue-950/20 backdrop-blur-3xl rounded-4xl p-5 shadow-2xl shadow-blue-500'>
            <img src='/weather.ico' alt='OREL Погода' />
            <h1 className='text-xl font-bold'>OREL Weather 2.2</h1>
            <p className='text-md font-normal'>Версия: Beta 3</p>
            <p className='text-md font-normal'>
              Начало разработки: 11 августа 2025
            </p>
            <p className='text-md font-normal mb-2'>Конец разработки: 12 августа 2025</p>
            <a
              href='https://mega.nz/file/o3NjDZyI#ZMdfI14qlO2xou0bV6Js2LbuZXAGQzMeRMW0otpxSq4'
              className='text-center mx-25 mt-2 p-2 border border-blue-950/50 rounded-lg bg-gray-800 transition hover:bg-gray-900 shadow-xl shadow-blue-900 hover:scale-110'
            >
              Скачать
            </a>
          </div>
          <div className='bg-blue-950/20 backdrop-blur-3xl rounded-4xl p-5 shadow-2xl shadow-blue-500'>
            <img src='/clock.ico' alt='OREL Погода' />
            <h1 className='text-xl font-bold'>OREL Clock 1.1</h1>
            <p className='text-md font-normal'>Версия: Beta 3</p>
            <p className='text-md font-normal'>
              Начало разработки: 19 сентября 2025
            </p>
            <p className='text-md font-normal mb-2'>Конец разработки: ...</p>
            <a
              href='https://mega.nz/file/Bu0EDJKK#ctwDixJOouWBFF46R4M0F5txxMJ7Fal5UgOarjZm7UY'
              className='text-center mx-25 mt-2 p-2 border border-blue-950/50 rounded-lg bg-gray-800 transition hover:bg-gray-900 shadow-xl shadow-blue-900 hover:scale-110'
            >
              Скачать
            </a>
          </div>
        </div>
      </div>
    </span>
  )
}
