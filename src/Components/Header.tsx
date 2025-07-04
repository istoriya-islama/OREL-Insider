export function Header() {
	return <header className='w-full p-6 bg-gray-950 flex items-center justify-between'>
		<h1 className='text-2xl'>OREL Insider</h1>
		<nav className='flex gap-9 justify-end'>
			<a href='/' className='px-4 py-2'>Главная</a>
			<button className='bg-blue-700 transition-colors hover:bg-blue-800  px-4 py-2 rounded-2xl'><a href='/pages/auth/login'>Войти</a></button>
		</nav>
	</header>
}
