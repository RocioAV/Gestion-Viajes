import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface FormLayoutProps {
  children: ReactNode
  backTo: string
}

function FormLayout({ children, backTo }: FormLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors pb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
        {children}
      </div>
    </div>
  )
}

export default FormLayout
