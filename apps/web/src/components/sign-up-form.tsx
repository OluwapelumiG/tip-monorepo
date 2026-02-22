"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignUpForm({ 
    onSwitchToSignIn, 
    onBack,
    role 
}: { 
    onSwitchToSignIn: () => void;
    onBack?: () => void;
    role: "freelancer" | "customer";
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
          // @ts-expect-error - Role field is added via better-auth config but types might need regeneration
          role: role, // Pass role to backend
        },
        {
          onSuccess: () => {
             // Force hard refresh or router refresh
            window.location.href = "/dashboard";
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-8 text-center relative">
        {onBack && (
            <Button variant="ghost" size="icon" className="absolute left-0 top-0" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
            </Button>
        )}
        <h1 className="text-3xl font-bold text-primary">Create {role === 'freelancer' ? 'Freelancer' : 'Client'} Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your details to get started</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="Full Name"
                   className="h-14 rounded-xl bg-muted/30 px-4 border-2 border-transparent focus:border-primary/50 focus:bg-background transition-colors"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                   placeholder="Email Address"
                   className="h-14 rounded-xl bg-muted/30 px-4 border-2 border-transparent focus:border-primary/50 focus:bg-background transition-colors"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                     placeholder="Password"
                     className="h-14 rounded-xl bg-muted/30 pl-4 pr-12 border-2 border-transparent focus:border-primary/50 focus:bg-background transition-colors"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="h-14 w-full rounded-xl text-lg font-semibold shadow-lg shadow-primary/20"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
        <button type="button" onClick={onSwitchToSignIn} className="hover:text-primary transition-colors">
            Already have an account
        </button>
      </div>

       <div className="mt-10">
        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-semibold text-primary">Or continue with</span>
            </div>
        </div>

        <div className="flex justify-center gap-4">
             <Button variant="secondary" className="h-12 w-12 rounded-lg bg-muted">
                <span className="sr-only">Google</span>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12S5.867 24 12.48 24c3.44 0 6.04-1.133 7.973-3.04 1.96-1.96 2.533-4.933 2.533-7.227 0-.36-.027-.8-.08-1.587h-10.427z"/></svg>
             </Button>
             <Button variant="secondary" className="h-12 w-12 rounded-lg bg-muted">
                <span className="sr-only">Facebook</span>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
             </Button>
             <Button variant="secondary" className="h-12 w-12 rounded-lg bg-muted">
                <span className="sr-only">Apple</span>
                 <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" /></svg>
             </Button>
        </div>
      </div>
    </div>
  );
}
