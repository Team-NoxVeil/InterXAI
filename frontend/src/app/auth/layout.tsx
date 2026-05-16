import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side illustration */}
      <div className="hidden lg:flex flex-1 relative bg-primary/5 items-center justify-center overflow-hidden">
        <Image src="/bg.png" alt="Background" fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-3xl mb-8 shadow-2xl">
            I
          </div>
          <h2 className="text-4xl font-heading font-bold mb-4 text-foreground">
            Master Every Interview
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Join thousands of professionals using AI to perfect their interview skills and land their dream jobs.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[20%] w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Right side content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
