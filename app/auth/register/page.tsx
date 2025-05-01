import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  )
}
