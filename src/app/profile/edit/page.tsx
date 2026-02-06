"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type UserProfile = {
  name: string;
  gender?: "male" | "female" | "other";
  role?: "patient" | "clinic";
  clinicName?: string;
  phone?: string;
  email?: string;
  age?: string;
};

export default function ProfileEditPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    gender: "other",
    role: "patient",
    clinicName: "",
    phone: "",
    email: "",
    age: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem("xdoc-user");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as UserProfile;
      setProfile((prev) => ({ ...prev, ...parsed }));
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Edit profile
          </p>
          <h1 className="section-title">Update your details</h1>
        </div>
        <Link className="button-outline" href="/profile">
          Back to profile
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="card">
          <h2 className="text-xl font-semibold">Basic details</h2>
          <div className="mt-4 grid gap-4 text-sm">
            <div>
              <label className="text-sm text-[color:var(--muted)]">Full name</label>
              <input
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-[color:var(--muted)]">Email</label>
              <input
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                value={profile.email ?? ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-[color:var(--muted)]">Phone</label>
              <input
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                value={profile.phone ?? ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-[color:var(--muted)]">Age</label>
              <input
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                value={profile.age ?? ""}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-[color:var(--muted)]">Gender</label>
              <select
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                value={profile.gender ?? "other"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    gender: e.target.value as "male" | "female" | "other",
                  })
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              className="button-primary"
              type="button"
              onClick={() => {
                window.localStorage.setItem("xdoc-user", JSON.stringify(profile));
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
              }}
            >
              Save changes
            </button>
            {saved ? (
              <p className="text-sm text-[color:var(--accent-3)]">Saved!</p>
            ) : null}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold">Clinic details</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Only required for clinic accounts.
          </p>
          <div className="mt-4 grid gap-4 text-sm">
            <div>
              <label className="text-sm text-[color:var(--muted)]">Clinic name</label>
              <input
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                value={profile.clinicName ?? ""}
                onChange={(e) => setProfile({ ...profile, clinicName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-[color:var(--muted)]">Account type</label>
              <select
                className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                value={profile.role ?? "patient"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    role: e.target.value as "patient" | "clinic",
                  })
                }
              >
                <option value="patient">Patient</option>
                <option value="clinic">Clinic</option>
              </select>
            </div>
            <Link className="button-outline" href="/clinic/onboarding">
              Open clinic onboarding
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
