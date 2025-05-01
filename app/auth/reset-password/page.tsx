import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
        <ResetPasswordForm />
      </main>
      <Footer />
    </div>
  )
}
