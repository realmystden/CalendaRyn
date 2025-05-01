import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}
