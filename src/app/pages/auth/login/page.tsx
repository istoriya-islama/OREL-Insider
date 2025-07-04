'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const userString = localStorage.getItem('user');
    const savedUser = userString ? JSON.parse(userString) : null;

    if (
      savedUser &&
      savedUser.email === formData.email
      // В реальности ещё проверяется пароль
    ) {
      router.push('/pages/user');
    } else {
      setError('Неверный email или пользователь не зарегистрирован');
    }
  };

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
            Войти
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
            Нет аккаунта? <a href='../auth'>Зарегистрироваться</a>
          </p>
        </form>
      </main>
    </div>
  );
}
