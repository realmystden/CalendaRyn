import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
        <ForgotPasswordForm />
      </main>
      <Footer />
    </div>
  )
}
