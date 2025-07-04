import { HeaderAdmin } from '@/Components/HeaderAdmin'
import type { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className='w-full h-200 bg-gradient-to-r from-blue-500 via-black to-blue-800 animate-gradient-x'>
      {children}
    </div>
  )
}
