"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import logo from "@/app/icon.png";

const PHONE_PREFIX = "+91 ";
const normalizePhoneDigits = (input) => {
  const digits = input.replace(/\D/g, "");
  const withoutPrefix = digits.startsWith("91") ? digits.slice(2) : digits;
  return withoutPrefix.slice(0, 10);
};

// Wrapper Component for Suspense
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isRegistering, setIsRegistering] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: PHONE_PREFIX });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // CHECK FOR QUERY PARAM ?mode=signup
  useEffect(() => {
    if (searchParams.get("mode") === "signup") {
        setIsRegistering(true);
    }
  }, [searchParams]);

  useEffect(() => {
    setOtp("");
    setOtpSent(false);
    setError("");
  }, [isRegistering]);

  const handlePhoneChange = (e) => {
    const digits = normalizePhoneDigits(e.target.value);
    setFormData({ ...formData, phone: `${PHONE_PREFIX}${digits}` });
  };

  const requestOtp = async () => {
    const res = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      }),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.message || "Failed to send OTP");
    }
  };

  const handleResendOtp = async () => {
    setIsSendingOtp(true);
    setError("");
    try {
      await requestOtp();
      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Enter the OTP sent to your email");
      return;
    }
    setIsVerifyingOtp(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otp.trim() }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.message || "Failed to verify OTP");
        setIsVerifyingOtp(false);
        return;
      }

      await signIn("credentials", { 
        email: formData.email, 
        password: formData.password, 
        redirect: false 
      });
      router.push("/select-college");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isRegistering) {
      if (otpSent) {
        setIsLoading(false);
        return;
      }
      const phoneDigits = normalizePhoneDigits(formData.phone);
      if (phoneDigits.length !== 10) {
        setError("Phone number must be 10 digits");
        setIsLoading(false);
        return;
      }

      try {
        const normalizedForm = { ...formData, phone: `${PHONE_PREFIX}${phoneDigits}` };
        setFormData(normalizedForm);
        await requestOtp();
        setOtpSent(true);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }

    } else {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="w-full max-w-md bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl overflow-hidden">
            <Image src={logo} alt="SideQuest Logo" width={48} height={48} className="object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">{isRegistering ? "Create Account" : "Welcome Back"}</h1>
          <p className="text-slate-400 text-sm mt-2">Enter your credentials to continue</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
                <div>
                    <label className="text-xs font-medium text-slate-400 uppercase">Full Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 w-full rounded-lg bg-slate-800 border border-white/10 p-3 text-white outline-none focus:border-violet-500 transition" placeholder="John Doe" />
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={PHONE_PREFIX.length + 10}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="mt-1 w-full rounded-lg bg-slate-800 border border-white/10 p-3 text-white outline-none focus:border-violet-500 transition"
                      placeholder="+91 9876543210"
                    />
                </div>
                {otpSent && (
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase">Email OTP</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="mt-1 w-full rounded-lg bg-slate-800 border border-white/10 p-3 text-white outline-none focus:border-violet-500 transition"
                      placeholder="Enter 6-digit code"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSendingOtp}
                        className="text-violet-400 hover:text-violet-300 font-semibold disabled:opacity-60"
                      >
                        {isSendingOtp ? "Sending..." : "Resend code"}
                      </button>
                    </div>
                  </div>
                )}
            </>
          )}
          
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase">Email Address</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1 w-full rounded-lg bg-slate-800 border border-white/10 p-3 text-white outline-none focus:border-violet-500 transition" placeholder="you@college.edu" />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase">Password</label>
            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="mt-1 w-full rounded-lg bg-slate-800 border border-white/10 p-3 text-white outline-none focus:border-violet-500 transition" placeholder="••••••••" />
          </div>

          {isRegistering && otpSent ? (
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition disabled:opacity-50 flex justify-center"
            >
              {isVerifyingOtp ? <Loader2 className="animate-spin" /> : "Verify Email"}
            </button>
          ) : (
            <button
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition disabled:opacity-50 flex justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (isRegistering ? "Sign Up" : "Login")}
            </button>
          )}
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          {isRegistering ? "Already have an account?" : "Don't have an account?"} 
          <button onClick={() => setIsRegistering(!isRegistering)} className="ml-2 text-violet-400 hover:text-violet-300 font-bold underline">
            {isRegistering ? "Login" : "Sign Up"}
          </button>
        </p>
    </div>
  );
}

// MAIN PAGE COMPONENT
export default function LoginPage() {
  return (
    <div className="min-h-[100svh] flex items-center justify-center bg-slate-950 px-4 py-10">
      <Suspense fallback={<div className="text-violet-500"><Loader2 className="animate-spin h-8 w-8" /></div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}