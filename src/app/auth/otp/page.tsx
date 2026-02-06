"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OtpLoginPage() {
  const [channel, setChannel] = useState<"mobile" | "email">("mobile");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "verified">("idle");
  const router = useRouter();

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            OTP Login
          </p>
          <h1 className="section-title">Continue with OTP</h1>
        </div>
        <Link className="button-outline" href="/auth">
          Back
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card grid gap-4">
          <div>
            <label className="text-sm text-[color:var(--muted)]">Get OTP on</label>
            <div className="mt-2 inline-flex items-center rounded-full border border-[color:var(--stroke)] bg-white p-1">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm ${
                  channel === "mobile" ? "text-white shadow" : "text-[color:var(--muted)]"
                }`}
                style={
                  channel === "mobile"
                    ? {
                        backgroundImage:
                          "linear-gradient(135deg, #ff8a3d 0%, #ff5a2c 100%)",
                      }
                    : undefined
                }
                onClick={() => setChannel("mobile")}
              >
                Mobile
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm ${
                  channel === "email" ? "text-white shadow" : "text-[color:var(--muted)]"
                }`}
                style={
                  channel === "email"
                    ? {
                        backgroundImage:
                          "linear-gradient(135deg, #ff8a3d 0%, #ff5a2c 100%)",
                      }
                    : undefined
                }
                onClick={() => setChannel("email")}
              >
                Email
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-[color:var(--muted)]">
              {channel === "mobile" ? "Mobile number" : "Email address"}
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
              placeholder={channel === "mobile" ? "+91 98xxxxxxx" : "you@example.com"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="button-primary"
            disabled={!identifier.trim() || status === "sending"}
            onClick={() => {
              if (!identifier.trim()) return;
              setStatus("sending");
              setTimeout(() => {
                setSent(true);
                setStatus("idle");
              }, 700);
            }}
          >
            {status === "sending" ? "Sending OTP..." : "Send OTP"}
          </button>

          {sent ? (
            <>
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
                type="button"
                className="button-outline"
                disabled={!otp.trim()}
                onClick={() => {
                  setStatus("verified");
                  window.localStorage.setItem(
                    "xdoc-user",
                    JSON.stringify({
                      name: channel === "email" ? identifier.split("@")[0] || "User" : "OTP User",
                      role: "patient",
                      gender: "other",
                    })
                  );
                  setTimeout(() => router.push("/"), 300);
                }}
              >
                Verify and continue
              </button>
            </>
          ) : null}
        </div>

        <aside className="card h-fit">
          <h3 className="text-xl font-semibold">OTP sign-in</h3>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Use your mobile number or email to receive a one-time password and sign in quickly.
          </p>
        </aside>
      </div>
    </div>
  );
}
