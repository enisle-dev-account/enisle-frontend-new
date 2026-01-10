import Link from "next/link"
import { ArrowRight, Users, Activity, Shield, BarChart3, Zap, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icon } from "@/components/icon"
import Image from "next/image"
import img1 from "@/public/landing-page/toon-lambrechts-Q5_FD3buG3U-unsplash.jpg"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-secondary backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Icon name="logo" size={42} className="scale-230" />
            {/* <span className="text-xl font-semibold text-white">Enisle</span> */}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-secondary/30 bg-gradient-to-b from-secondary via-secondary to-secondary/90 min-h-[600px] flex items-center">
  {/* The Content Container */}
  <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 w-full">
    <div className="grid gap-12 lg:grid-cols-2 items-center">
      
      {/* Left Content */}
      <div className="space-y-8 lg:max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-sm font-medium text-white/90">Healthcare Management Platform</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-pretty text-white lg:text-6xl">
            Streamline Your Hospital Operations
          </h1>
          <p className="text-xl text-white/70 text-pretty">
            Enisle is a comprehensive Electronic Health Records system designed to simplify healthcare management.
            From patient care to billing, manage every aspect in one unified platform.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/auth/register" className="flex-1 sm:flex-none">
            <Button size="lg" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white">
              Set up your hospital
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/auth/login" className="flex-1 sm:flex-none">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 bg-transparent">
              Sign in
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center gap-8 border-t border-white/10 pt-8">
          <div>
            <p className="text-sm font-medium text-white">200+</p>
            <p className="text-xs text-white/60">Facilities</p>
          </div>
          <div>
            <p className="text-sm font-medium text-white">50K+</p>
            <p className="text-xs text-white/60">Daily Users</p>
          </div>
          <div>
            <p className="text-sm font-medium text-white">99.9%</p>
            <p className="text-xs text-white/60">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* The Slanted Image Container */}
  <div 
    className="hidden lg:block absolute inset-y-0 right-0 w-1/2"
    style={{
      clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)',
    }}
  >
    <div className="relative h-full w-full">
      {/* Overlay to help text legibility if needed */}
      <div className="absolute inset-0 bg-blue-900/10 z-10" />
      <Image
        src={img1}
        alt="Hospital Dashboard"
        fill
        className="object-cover object-left"
        priority
      />
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="border-b py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-pretty">
              Everything you need to manage your hospital
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Built for modern healthcare organizations of all sizes
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="p-6 border">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Patient Management</h3>
                <p className="text-muted-foreground text-sm">
                  Complete patient records, medical history, and care coordination in one place
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 border">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Financial Management</h3>
                <p className="text-muted-foreground text-sm">
                  Streamlined billing, invoicing, and financial reporting for complete transparency
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 border">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Quick Operations</h3>
                <p className="text-muted-foreground text-sm">
                  Fast-track appointment scheduling, bed management, and surgical bookings
                </p>
              </div>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 border">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">HIPAA Compliant</h3>
                <p className="text-muted-foreground text-sm">
                  Enterprise-grade security and compliance with healthcare data regulations
                </p>
              </div>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 border">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">24/7 Access</h3>
                <p className="text-muted-foreground text-sm">
                  Access patient records and hospital data anytime, anywhere with cloud-based system
                </p>
              </div>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 border">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Real-time Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  Comprehensive dashboards and reports to track hospital performance and outcomes
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="border-b py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-pretty">Designed for every hospital role</h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Role-based dashboards tailored to each department's specific needs
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Doctors", desc: "Patient care and clinical decisions" },
              { name: "Nurses", desc: "Care coordination and vital signs" },
              { name: "Pharmacy", desc: "Medication management and dispensing" },
              { name: "Radiology", desc: "Imaging order management" },
              { name: "Laboratory", desc: "Test ordering and results tracking" },
              { name: "Reception", desc: "Patient check-in and appointments" },
              { name: "Cashier", desc: "Billing and payment processing" },
              { name: "Surgery", desc: "Operating room scheduling" },
              { name: "Admin", desc: "System-wide management and reports" },
            ].map((dept) => (
              <Card key={dept.name} className="p-4 border">
                <p className="font-semibold">{dept.name}</p>
                <p className="text-sm text-muted-foreground">{dept.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-pretty mb-4">Ready to transform your hospital?</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Set up your hospital in minutes and start managing patient care more efficiently
          </p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Link href="/auth/register" className="flex-1 sm:flex-none">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                Set up your hospital
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="logo" size={42} className="scale-230" />
                {/* <span className="font-semibold">Enisle</span> */}
              </div>
              <p className="text-sm text-muted-foreground">Healthcare management reimagined</p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Product</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Legal</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8">
            <p className="text-center text-sm text-muted-foreground">© 2026 Enisle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
