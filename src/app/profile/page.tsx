 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type UserProfile = {
  name: string;
  gender?: "male" | "female" | "other";
  role?: "patient" | "clinic";
  clinicName?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("xdoc-user");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as UserProfile;
      if (parsed?.name) setUser(parsed);
    } catch {
      // ignore
    }
  }, []);

  const displayName =
    user?.role === "clinic" && user?.clinicName ? user.clinicName : user?.name ?? "Patient";
  const avatar =
    user?.gender === "female"
      ? "/avatars/female.svg"
      : user?.gender === "male"
        ? "/avatars/male.svg"
        : "/avatars/other.svg";

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Patient profile
          </p>
          <h1 className="section-title">Your profile</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="button-outline" href="/medical-history">
            Medical history
          </Link>
          <Link className="button-outline" href="/">
            Back to home
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside
          className="rounded-[28px] p-6 text-white"
          style={{
            background: "linear-gradient(180deg, #6f8ff7 0%, #6a63e0 100%)",
          }}
        >
          <h2 className="text-2xl font-semibold">XDOC</h2>
          <nav className="mt-6 grid gap-3 text-sm">
            <Link className="rounded-2xl bg-white/15 px-3 py-2" href="/appointments">
              Scheduled visits
            </Link>
            <Link className="rounded-2xl px-3 py-2 hover:bg-white/10" href="/medical-history">
              Medical history
            </Link>
            <Link className="rounded-2xl px-3 py-2 hover:bg-white/10" href="/search">
              Find doctors
            </Link>
            <Link className="rounded-2xl px-3 py-2 hover:bg-white/10" href="/clinic">
              Clinic calendar
            </Link>
            <button
              type="button"
              className="mt-2 rounded-2xl bg-white/20 px-3 py-2 text-left"
              onClick={() => {
                window.localStorage.removeItem("xdoc-user");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </nav>
          <div className="mt-8 rounded-2xl bg-white/10 p-4 text-xs">
            Keep your profile updated for faster bookings and accurate reminders.
          </div>
        </aside>

        <div className="grid gap-6">
          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-16 w-16 rounded-full border border-[color:var(--stroke)] bg-white"
                />
                <div>
                  <h2 className="text-2xl font-semibold">{displayName}</h2>
                  <p className="text-sm text-[color:var(--muted)]">
                    {user?.role === "clinic" ? "Clinic account" : "Patient account"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link className="button-outline" href="/profile/edit">
                  Edit profile
                </Link>
                <Link className="button-primary" href="/appointments">
                  View visits
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">General information</h3>
                <Link className="text-sm text-[color:var(--accent-3)]" href="/auth">
                  Edit
                </Link>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
                <div className="flex items-center justify-between">
                  <span>Gender</span>
                  <span className="font-semibold text-[color:var(--ink)]">
                    {user?.gender ?? "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>City</span>
                  <span className="font-semibold text-[color:var(--ink)]">Cooch Behar</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Registered on</span>
                  <span className="font-semibold text-[color:var(--ink)]">Feb 05, 2026</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Medical summary</h3>
                <Link className="text-sm text-[color:var(--accent-3)]" href="/medical-history">
                  View
                </Link>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
                <div className="flex items-center justify-between">
                  <span>Allergies</span>
                  <span className="font-semibold text-[color:var(--ink)]">None reported</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chronic conditions</span>
                  <span className="font-semibold text-[color:var(--ink)]">No</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Blood group</span>
                  <span className="font-semibold text-[color:var(--ink)]">O+</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Upcoming visits</h3>
                <Link className="text-sm text-[color:var(--accent-3)]" href="/appointments/upcoming">
                  View all
                </Link>
              </div>
              <div className="mt-4 grid gap-3 text-sm">
                <Link
                  className="rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3 transition hover:border-[color:var(--accent-3)]"
                  href="/appointments/upcoming/visit-1"
                >
                  <p className="font-semibold">Feb 10, 2026 • 4:30 PM</p>
                  <p className="text-[color:var(--muted)]">Dr. Ananya Sen • Telehealth</p>
                  <span className="pill mt-2 inline-flex">Scheduled</span>
                </Link>
                <Link
                  className="rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3 transition hover:border-[color:var(--accent-3)]"
                  href="/appointments/upcoming/visit-2"
                >
                  <p className="font-semibold">Feb 12, 2026 • 11:00 AM</p>
                  <p className="text-[color:var(--muted)]">Dr. Riya Basak • In-person</p>
                  <span className="pill mt-2 inline-flex">Scheduled</span>
                </Link>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Files & reports</h3>
                <Link className="text-sm text-[color:var(--accent-3)]" href="/medical-history">
                  Upload
                </Link>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
                <div className="flex items-center justify-between">
                  <span>Blood test report.pdf</span>
                  <span className="pill">Download</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Prescription Jan 2026.pdf</span>
                  <span className="pill">Download</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ultrasound scan.pdf</span>
                  <span className="pill">Download</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
