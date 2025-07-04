import ORELInsider from '@/Components/ORELInsider'

export default function Home() {
  return <div className='border border-blue-900/50 backdrop-blur-7xl p-10 m-10 rounded-2xl bg-gray-950/40 shadow-2xl shadow-blue-950'>
    <h1 className='text-4xl font-extrabold'>Добро пожаловать в OREL Insider!</h1>
    <ORELInsider />
    <button className='bg-blue-700 transition hover:bg-blue-800  px-4 py-2 rounded-2xl mx-140 mt-10 hover:scale-120'><a href='/pages/auth/login'>Войти</a></button>
  </div>
}
