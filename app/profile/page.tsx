import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { UserProfile } from "@/components/auth/user-profile"
import { UserNav } from "@/components/auth/user-nav"

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-2">
        <UserNav />
      </div>
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto">
        <UserProfile />
      </main>
      <Footer />
    </div>
  )
}
