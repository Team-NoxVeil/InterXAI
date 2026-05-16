import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  return (
    <div className="glass-card p-8 bg-white/60">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold font-heading mb-2">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
      </div>

      <form className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="bg-white/50" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" className="bg-white/50" />
          </div>
        </div>

        <Link href="/dashboard" className="block">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 glow-effect h-12">
            Sign In
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
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
          Sign up
        </Link>
      </p>
    </div>
  );
}
