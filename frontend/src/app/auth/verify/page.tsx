import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="glass-card p-8 bg-white/60 text-center">
      <div className="mb-6 flex justify-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <Image src="/verify-email.png" alt="Verify Email" fill className="object-contain drop-shadow-lg z-10" priority />
        </div>
      </div>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading mb-2">Check your email</h1>
        <p className="text-sm text-muted-foreground mb-4">
          We've sent a verification link to <span className="font-semibold text-foreground">you@example.com</span>
        </p>
      </div>

      <div className="space-y-4">
        <Link href="/dashboard" className="block">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 glow-effect h-12">
            Go to Dashboard
          </Button>
        </Link>
        <Button variant="outline" className="w-full bg-white/50 h-12">
          Resend Email
        </Button>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Back to{" "}
        <Link href="/auth/signin" className="text-primary hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
