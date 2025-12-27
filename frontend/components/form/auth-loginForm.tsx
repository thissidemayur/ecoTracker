"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { useAuthApi } from "@/hooks/useAuthApi";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Mail,
  Lock,
  LogIn,
  Loader2,
  Heart,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().min(1, "Please enter your email").email("Invalid email"),
  password: z.string().min(1, "Please enter your password"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(0); // Countdown for resend
  const { loginUser, verifyOtp } = useAuthApi();
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  // Timer Logic for Resend OTP
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onInitialLogin = async (data: z.infer<typeof loginSchema>) => {
    const result = await loginUser(data.email, data.password);
    if (result?.data?.requiresOtp) {
      setEmail(data.email);
      setShowOtp(true);
      setTimer(60); // Start 60s cooldown
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    // Re-run the login call to trigger a new OTP
    const password = loginForm.getValues("password");
    await loginUser(email, password);
    setTimer(60);
  };

  const onOtpSubmit = async (data: z.infer<typeof otpSchema>) => {
    const result = await verifyOtp(email, data.otp);
    if (result?.success) {
      router.push("/dashboard");
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-8 w-full max-w-sm mx-auto", className)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          {showOtp ? "Verify" : "Login"}
        </h1>
        <p className="text-zinc-500 text-xs font-medium italic">
          {showOtp
            ? `Code sent to ${email}`
            : "Ready to continue your mission?"}
        </p>
      </div>

      <div className="relative overflow-hidden">
        {/* Step 1: Password (Visible when !showOtp) */}
        {!showOtp ? (
          <form
            onSubmit={loginForm.handleSubmit(onInitialLogin)}
            className="space-y-6"
          >
            <FieldGroup className="space-y-4">
              <Controller
                name="email"
                control={loginForm.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Mail className="size-3 text-emerald-500" /> Email
                    </FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="pioneer@eco.com"
                      className="h-12 bg-zinc-900 border-zinc-800 rounded-xl text-white"
                    />
                    {fieldState.error && (
                      <p className="text-[10px] text-red-500 mt-1 italic">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={loginForm.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Lock className="size-3 text-emerald-500" /> Password
                    </FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="h-12 bg-zinc-900 border-zinc-800 rounded-xl text-white"
                    />
                    {fieldState.error && (
                      <p className="text-[10px] text-red-500 mt-1 italic">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button
              disabled={loginForm.formState.isSubmitting}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/10"
            >
              {loginForm.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Access Account"
              )}
            </Button>
          </form>
        ) : (
          /* Step 2: OTP (Visible when showOtp) */
          <form
            onSubmit={otpForm.handleSubmit(onOtpSubmit)}
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <Controller
              name="otp"
              control={otpForm.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="size-3 text-emerald-500" /> Security
                    Code
                  </FieldLabel>
                  <Input
                    {...field}
                    maxLength={6}
                    className="h-14 bg-zinc-900 border-zinc-800 rounded-xl text-center text-2xl font-black tracking-[0.5em] text-emerald-500"
                  />
                  {fieldState.error && (
                    <p className="text-[10px] text-red-500 mt-1 italic">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />

            <div className="flex flex-col gap-4">
              <Button
                disabled={otpForm.formState.isSubmitting}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest rounded-xl"
              >
                {otpForm.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Verify & Launch"
                )}
              </Button>

              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="text-[10px] text-zinc-500 uppercase font-black flex items-center gap-2 hover:text-white transition-colors"
                >
                  <ArrowLeft className="size-3" /> Change Email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  className={cn(
                    "text-[10px] uppercase font-black flex items-center gap-2 transition-colors",
                    timer > 0
                      ? "text-zinc-700 cursor-not-allowed"
                      : "text-emerald-500 hover:text-white"
                  )}
                >
                  <RefreshCw
                    className={cn("size-3", timer > 0 && "animate-spin-slow")}
                  />
                  {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {!showOtp && (
        <div className="text-center">
          <p className="text-sm text-zinc-600 font-medium">
            New to the mission?{" "}
            <Link
              href="/register"
              className="text-emerald-500 font-black hover:underline uppercase tracking-tighter"
            >
              Join Now
            </Link>
          </p>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-zinc-800 pt-4 border-t border-zinc-900">
        <Heart className="size-3" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
          Secure Node 01
        </span>
      </div>
    </div>
  );
}
