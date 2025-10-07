import type { PropsWithChildren } from 'react'
import "@/style/auth.css"

export default function Layout({ children }: PropsWithChildren<unknown>) {
	return <div>{children}</div>
}
