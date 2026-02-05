"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "verified">("idle");
  const router = useRouter();

  const canSend = name.trim() && email.trim() && phone.trim();

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Login / Signup
          </p>
          <h1 className="section-title">Sign up with your details</h1>
        </div>
        <Link className="button-outline" href="/">
          Back to home
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-[color:var(--muted)]">Full name</label>
              <input
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-[color:var(--muted)]">Email address</label>
              <input
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-[color:var(--muted)]">Mobile number</label>
              <input
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                placeholder="+91 98xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-[color:var(--muted)]">Gender</label>
              <select
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                value={gender}
                onChange={(e) => setGender(e.target.value as "male" | "female" | "other")}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              className="button-primary"
              disabled={!canSend || status === "sending"}
              onClick={() => {
                if (!canSend) return;
                setStatus("sending");
                setTimeout(() => {
                  setSent(true);
                  setStatus("idle");
                }, 800);
              }}
            >
              {status === "sending" ? "Sending OTP..." : "Send OTP to email + mobile"}
            </button>
            {sent ? (
              <p className="text-sm text-[color:var(--accent-3)]">
                OTP sent to {email} and {phone}.
              </p>
            ) : null}
          </div>
          <div className="mt-6 grid gap-4">
            <div>
              <label className="text-sm text-[color:var(--muted)]">Enter OTP</label>
              <input
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              className="button-outline"
              disabled={!sent || !otp}
              onClick={() => {
                setStatus("verified");
                window.localStorage.setItem(
                  "xdoc-user",
                  JSON.stringify({ name: name.trim(), gender })
                );
                setTimeout(() => {
                  router.push("/");
                }, 400);
              }}
            >
              Verify and continue
            </button>
            {status === "verified" ? (
              <p className="text-sm text-[color:var(--accent-3)]">Verified! You&apos;re logged in.</p>
            ) : null}
          </div>
        </div>

        <aside className="card h-fit">
          <h3 className="text-2xl">Why OTP?</h3>
          <ul className="mt-6 grid gap-3 text-sm text-[color:var(--muted)]">
            <li>No passwords to remember.</li>
            <li>Secure patient identity checks.</li>
            <li>Fast booking in under 60 seconds.</li>
          </ul>
          <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--stroke)] p-4 text-sm text-[color:var(--muted)]">
            We will send OTPs to your email and mobile number.
          </div>
        </aside>
      </div>
    </div>
  );
}
