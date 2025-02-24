import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

const Header = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()

    await router.invalidate()

    await navigate({ to: '/login' })
  }

  return (
    <header className="fixed z-40 flex h-12 w-full justify-between border-b-1 border-[#eef0f1] bg-[#f4f5f6]">
      <div className="flex items-center gap-3 pl-4">
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="h-8" />
        </Link>
        <h1 className="text-xl font-semibold">TaskMate</h1>
      </div>
      <div className="center flex items-center gap-2 pr-4">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="flex min-h-7 cursor-pointer items-center rounded-sm bg-[#006fff] px-4 text-sm text-white hover:bg-[#338BFF] active:bg-[#0058CC]"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex min-h-7 cursor-pointer items-center rounded-sm px-4 text-sm text-[#676f79] hover:bg-[#2123270A]"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className="flex min-h-7 cursor-pointer items-center rounded-sm bg-[#006fff] px-4 text-sm text-white hover:bg-[#338BFF] active:bg-[#0058CC]"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="flex min-h-7 cursor-pointer items-center rounded-sm px-4 text-sm text-[#676f79] hover:bg-[#2123270A]"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
