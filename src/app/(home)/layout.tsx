import type { PropsWithChildren } from 'react'
import { Header } from '@/Components/Header'

export default function Layout({ children }: PropsWithChildren<unknown>) {
	return <div className='w-full h-200 bg-gradient-to-r from-blue-500 via-black to-blue-800 animate-gradient-x'>
		<Header />
		{children}
	</div>
}
