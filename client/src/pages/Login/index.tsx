import LoginForm from '../../components/LoginForm'

const LoginPage = () => {
  return (
    <main className="flex h-[calc(100vh-48px)] items-center justify-center bg-[url(https://images.pexels.com/photos/796602/pexels-photo-796602.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=2160&w=3840)] bg-cover bg-center">
      <div className="w-full px-4 py-2">
        <LoginForm />
      </div>
    </main>
  )
}

export default LoginPage
