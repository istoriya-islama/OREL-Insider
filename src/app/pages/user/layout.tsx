import type { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className='w-full bg-gradient-to-r from-blue-500 via-black to-blue-800 animate-gradient-x pb-2 h-200'>
      {children}
    </div>
  )
}
