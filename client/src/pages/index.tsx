import { Link } from '@tanstack/react-router'

import { useAuth } from '../hooks/useAuth'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex h-[calc(100vh-48px)] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-semibold">
        Welcome to{' '}
        <span className="font-bold text-[#006fff] underline">TaskMate</span>
      </h1>
      <Link
        to={isAuthenticated ? '/dashboard' : '/register'}
        className="flex min-h-7 cursor-pointer items-center rounded-sm bg-[#006fff] px-4 py-1 text-xl text-white hover:bg-[#338BFF] active:bg-[#0058CC]"
      >
        Get Started
      </Link>
    </div>
  )
}

export default HomePage
