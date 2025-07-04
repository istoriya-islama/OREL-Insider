type users = {
	user: string
}

export function HeaderAdmin({ user }: users) {
  return (
    <header className='w-full p-6 bg-gray-950 flex items-center justify-between'>
      <h1 className='text-2xl'>OREL Insider</h1>
      <nav className='flex gap-2 justify-end'>
        <a href='/pages/user' className='px-2.5 py-2.5 transition-transform hover:scale-110'>Главная</a>
        <a href='/pages/user/betaAndroid' className='px-2.5 py-2.5 transition-transform hover:scale-110'>Beta программ для Android</a>
        <a href='/pages/user/betaWindows' className='px-2.5 py-2.5 transition-transform hover:scale-110'>Beta программ для Windows</a>
        <a href='https://t.me/obr_orel_bot' className='px-2.5 py-2.5 transition-transform hover:scale-110'>Обратная связь с OREL</a>
        <a href='/pages/user/profile' className='py-2.5 px-4.5 border rounded-3xl shadow-2xl shadow-blue-900 bg-gray-950 transition-transform hover:scale-120'><p>{user}</p></a>
      </nav>
    </header>
  )
}
