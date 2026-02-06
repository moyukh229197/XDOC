"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const [step, setStep] = useState<"login" | "signup">("login");
  const [accountType, setAccountType] = useState<"patient" | "clinic" | null>(
    null
  );
  const [name, setName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [contactName, setContactName] = useState("");
  const [clinicLocation, setClinicLocation] = useState("");
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "locating" | "ok" | "error"
  >("idle");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "verified">("idle");
  const router = useRouter();

  const canSendPatient =
    name.trim() && email.trim() && phone.trim() && accountType === "patient";
  const canSendClinic =
    clinicName.trim() &&
    contactName.trim() &&
    clinicLocation.trim() &&
    email.trim() &&
    phone.trim() &&
    accountType === "clinic";
  const canSend = canSendPatient || canSendClinic;

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Login / Signup
          </p>
          <h1 className="section-title">
            {step === "login" ? "Sign in to your account" : "Sign up with your details"}
          </h1>
        </div>
        <Link className="button-outline" href="/">
          Back to home
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          {step === "login" ? (
            <div className="grid gap-4">
              <div>
                <label className="text-sm text-[color:var(--muted)]">Sign in</label>
                <div className="mt-3 grid gap-3">
                  <button
                    type="button"
                    className="button-outline w-full justify-center"
                    onClick={() => {
                      window.localStorage.setItem(
                        "xdoc-user",
                        JSON.stringify({ name: "Google User", gender: "other", role: "patient" })
                      );
                      window.location.href = "/";
                    }}
                  >
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    className="button-primary w-full justify-center"
                    onClick={() => {
                      setStep("signup");
                      setAccountType("patient");
                    }}
                  >
                    Continue with OTP
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-[color:var(--stroke)] bg-white p-4 text-sm text-[color:var(--muted)]">
                New to XDOC?{" "}
                <button
                  type="button"
                  className="text-[color:var(--accent-3)] underline"
                  onClick={() => setStep("signup")}
                >
                  Create an account
                </button>
              </div>
            </div>
          ) : null}

          {step === "signup" ? (
            <>
              <div className="grid gap-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="text-sm text-[color:var(--muted)]">
                  Continue as
                </label>
                <div className="inline-flex items-center rounded-full border border-[color:var(--stroke)] bg-white p-1 text-sm">
                  <button
                    type="button"
                    className={`rounded-full px-4 py-2 transition ${
                      accountType === "patient"
                        ? "text-white shadow"
                        : "text-[color:var(--muted)]"
                    }`}
                    style={
                      accountType === "patient"
                        ? {
                            backgroundImage:
                              "linear-gradient(135deg, #ff8a3d 0%, #ff5a2c 100%)",
                          }
                        : undefined
                    }
                    onClick={() => setAccountType("patient")}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-4 py-2 transition ${
                      accountType === "clinic"
                        ? "bg-[color:var(--accent-2)] text-white shadow"
                        : "text-[color:var(--muted)]"
                    }`}
                    onClick={() => setAccountType("clinic")}
                  >
                    Clinic
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-[color:var(--muted)]">
                Choose the option that matches your account. 
              </p>
            </div>

            {accountType === "patient" ? (
              <>
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
                    onChange={(e) =>
                      setGender(e.target.value as "male" | "female" | "other")
                    }
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            ) : null}

            {accountType === "clinic" ? (
              <>
                <div>
                  <label className="text-sm text-[color:var(--muted)]">
                    Clinic name
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                    placeholder="Clinic or hospital name"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-[color:var(--muted)]">
                    Clinic location (Google Maps)
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                    placeholder="Paste Google Maps link or full address"
                    value={clinicLocation}
                    onChange={(e) => setClinicLocation(e.target.value)}
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
                    <span>Find on Maps:</span>
                    <a
                      className="rounded-full border border-[color:var(--stroke)] bg-white px-3 py-1"
                      href={`https://www.google.com/maps/search/${encodeURIComponent(
                        clinicName || "clinic near me"
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Google Maps
                    </a>
                    <button
                      type="button"
                      className="rounded-full border border-[color:var(--stroke)] bg-white px-3 py-1"
                      onClick={() => {
                        if (!navigator.geolocation) {
                          setLocationStatus("error");
                          return;
                        }
                        setLocationStatus("locating");
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            const lat = pos.coords.latitude.toFixed(6);
                            const lng = pos.coords.longitude.toFixed(6);
                            setClinicLocation(`${lat}, ${lng}`);
                            setLocationStatus("ok");
                          },
                          () => {
                            setLocationStatus("error");
                          },
                          { enableHighAccuracy: true, timeout: 10000 }
                        );
                      }}
                    >
                      Use current location
                    </button>
                  </div>
                  {locationStatus === "locating" ? (
                    <p className="mt-2 text-xs text-[color:var(--muted)]">
                      Fetching your current location...
                    </p>
                  ) : null}
                  {locationStatus === "error" ? (
                    <p className="mt-2 text-xs text-[color:var(--accent-3)]">
                      Unable to access location. Please allow location access or paste a
                      Google Maps link.
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="text-sm text-[color:var(--muted)]">
                    Contact person
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                    placeholder="Admin or coordinator name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-[color:var(--muted)]">
                    Email address
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                    placeholder="clinic@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-[color:var(--muted)]">
                    Mobile number
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                    placeholder="+91 98xxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            ) : null}
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
              disabled={!sent || !otp || !accountType}
              onClick={() => {
                setStatus("verified");
                window.localStorage.setItem(
                  "xdoc-user",
                  JSON.stringify(
                    accountType === "clinic"
                      ? {
                          name: contactName.trim() || "Clinic Admin",
                          role: "clinic",
                          clinicName: clinicName.trim(),
                          clinicLocation: clinicLocation.trim(),
                        }
                      : { name: name.trim(), gender, role: "patient" }
                  )
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
            </>
          ) : null}
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
