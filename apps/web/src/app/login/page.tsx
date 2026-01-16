"use client";

import Link from "next/link";
import Image from "next/image";
import SignInForm from "@/components/sign-in-form";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding / Splash - Hidden on mobile, visible on lg */}
      <div className="hidden w-1/2 flex-col justify-center bg-blue-50 lg:flex relative overflow-hidden">
        {/* Curved Background Effect */}
        <div className="absolute top-0 right-0 w-full h-full"> 
             <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute h-full w-full text-white fill-current opacity-50 transform translate-x-1/2 scale-150">
               <path d="M0 0 C 50 100 80 100 100 0 Z" />
             </svg>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center p-10 text-center">
             <div className="mb-8 relative w-[400px] h-[400px]">
                <Image
                  src="/splash.png"
                  alt="Empowering the Workforce"
                  fill
                  className="object-contain"
                  priority
                />
             </div>
             <h2 className="text-4xl font-bold text-primary mb-4">Welcome Back</h2>
             <p className="text-lg text-muted-foreground max-w-md">
                Sign in to manage your career or find the perfect talent for your next project.
             </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-center bg-background p-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
           <div className="mb-8 flex justify-center lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Logo" width={40} height={40} />
                <span className="text-xl font-bold text-primary">i'llTip</span>
              </Link>
           </div>

           <SignInForm onSwitchToSignUp={() => router.push('/signup')} />
        </div>
      </div>
    </div>
  );
}
