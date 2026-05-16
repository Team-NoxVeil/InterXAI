import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  return (
    <div className="glass-card p-8 bg-white/60">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold font-heading mb-2">Create an Account</h1>
        <p className="text-sm text-muted-foreground">Get started with InterXAI for free</p>
      </div>

      <form className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="John" className="bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="Doe" className="bg-white/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="bg-white/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="bg-white/50" />
          </div>
        </div>

        <Link href="/auth/verify" className="block">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 glow-effect h-12">
            Create Account
          </Button>
        </Link>
      </form>

      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white/60 text-muted-foreground backdrop-blur-sm rounded-full">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button variant="outline" className="bg-white/50">Google</Button>
        <Button variant="outline" className="bg-white/50">GitHub</Button>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-primary hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
