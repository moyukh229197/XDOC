"use client";

import Link from "next/link";
import { useState } from "react";

export default function LaunchOnboardingPage() {
  const [goLive, setGoLive] = useState(false);

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">Step 4</p>
          <h1 className="section-title">Launch patient booking</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Review your setup and go live when you are ready.
          </p>
        </div>
        <Link className="button-outline" href="/clinic/onboarding">
          Back to checklist
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <h2 className="text-xl font-semibold">Final checks</h2>
          <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
            <label className="pill">
              <input className="mr-2" type="checkbox" defaultChecked /> Doctors added
            </label>
            <label className="pill">
              <input className="mr-2" type="checkbox" defaultChecked /> Availability published
            </label>
            <label className="pill">
              <input className="mr-2" type="checkbox" defaultChecked /> Payments connected
            </label>
            <label className="pill">
              <input className="mr-2" type="checkbox" defaultChecked /> Telehealth enabled
            </label>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold">Go live</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Patients will start seeing your clinic immediately.
          </p>
          <button
            className="button-primary mt-6 w-full"
            type="button"
            onClick={() => setGoLive(true)}
          >
            Go live
          </button>
          {goLive ? (
            <p className="mt-4 text-sm text-[color:var(--accent-3)]">
              Your clinic is now live. New bookings will appear on your dashboard.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
