import { Link } from '@tanstack/react-router'

import { useAuth } from '../hooks/useAuth'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col items-center justify-center gap-4 bg-[url(https://images.pexels.com/photos/796602/pexels-photo-796602.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=2160&w=3840)] bg-cover bg-center">
      <h1 className="font-shad text-4xl font-semibold">
        Welcome to{' '}
        <span className="font-bold underline decoration-[#006fff]">
          TaskMate
        </span>
      </h1>
      <Link
        to={isAuthenticated ? '/dashboard' : '/login'}
        className="flex min-h-7 cursor-pointer items-center rounded-sm bg-[#006fff] px-4 py-1 text-lg font-semibold text-white hover:bg-[#338BFF] active:bg-[#0058CC]"
      >
        Get Started
      </Link>
    </div>
  )
}

export default HomePage
