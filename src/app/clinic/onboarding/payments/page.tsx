"use client";

import Link from "next/link";
import { useState } from "react";

export default function PaymentsOnboardingPage() {
  const [telehealth, setTelehealth] = useState(["Zoom", "Google Meet"]);
  const [payments, setPayments] = useState(["PhonePe", "Google Pay", "Paytm"]);

  const toggle = (value: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">Step 3</p>
          <h1 className="section-title">Enable telehealth + payments</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Choose telehealth tools and payment methods to accept bookings.
          </p>
        </div>
        <Link className="button-outline" href="/clinic/onboarding">
          Back to checklist
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-xl font-semibold">Telehealth apps</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Pick the video tools you already use.</p>
          <div className="mt-4 grid gap-3">
            {["Zoom", "Google Meet", "Microsoft Teams", "WhatsApp Video", "Jitsi"].map((item) => (
              <label key={item} className="pill">
                <input
                  className="mr-2"
                  type="checkbox"
                  checked={telehealth.includes(item)}
                  onChange={() => toggle(item, telehealth, setTelehealth)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold">Payment partners</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Enable the payment methods you accept.</p>
          <div className="mt-4 grid gap-3">
            {["PhonePe", "Google Pay", "Paytm", "Visa", "Mastercard", "LazyPay"].map((item) => (
              <label key={item} className="pill">
                <input
                  className="mr-2"
                  type="checkbox"
                  checked={payments.includes(item)}
                  onChange={() => toggle(item, payments, setPayments)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[color:var(--muted)]">Demo only. No data is saved.</p>
          <button className="button-primary" type="button">Save settings</button>
        </div>
      </div>
    </div>
  );
}
