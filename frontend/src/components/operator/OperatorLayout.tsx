import type { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface OperatorLayoutProps {
  children: ReactNode
}

function OperatorLayout({ children }: OperatorLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}

export default OperatorLayout
