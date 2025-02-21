import { Link } from '@tanstack/react-router'

const Header = () => {
  return (
    <header className="fixed z-40 flex h-12 w-full justify-between border-b-1 border-[#eef0f1] bg-[#f4f5f6]">
      <div className="flex items-center gap-3 pl-4">
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="h-8" />
        </Link>
        <h1 className="text-xl font-semibold">Todo</h1>
      </div>
      <div className="center flex items-center gap-2 pr-4">
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
      </div>
    </header>
  )
}

export default Header
