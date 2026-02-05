"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PaymentReturnPage({
  searchParams,
}: {
  searchParams: { orderId?: string; status?: string; slot?: string };
}) {
  const [status, setStatus] = useState(searchParams.status ?? "PENDING");
  const [seconds, setSeconds] = useState(1);
  const isSuccess = status === "SUCCESS";

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess]);

  if (isSuccess) {
    return (
      <div className="container py-16">
        <div className="card mx-auto max-w-xl bg-white text-center">
          <p className="text-2xl font-semibold text-[color:var(--ink)]">
            Payment of ₹10.00 processed successfully
          </p>
          <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#5aa564]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="mt-6 text-sm text-[color:var(--muted)]">
            Redirecting you to XDOC in
          </p>
          <p className="text-lg font-semibold text-[#5aa564]">{seconds} seconds</p>
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            If you are not automatically redirected,{" "}
            <Link className="text-[#5aa564] underline" href="/">
              click here
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="card max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
          Demo PhonePe PayPage
        </p>
        <h1 className="section-title mt-2">Complete your ₹10 payment</h1>
        <p className="mt-3 text-[color:var(--muted)]">
          This is a demo flow for PhonePe. Choose a payment method to simulate success or failure.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[color:var(--muted)]">Merchant</p>
                <p className="text-lg font-semibold">XDOC Clinic Booking</p>
              </div>
              <div className="rounded-full bg-[#5f259f] px-3 py-1 text-sm font-semibold text-white">
                PhonePe
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <button className="button-outline flex items-center justify-between">
                UPI (PhonePe / GPay)
                <span className="pill">Recommended</span>
              </button>
              <button className="button-outline flex items-center justify-between">Credit / Debit Card</button>
              <button className="button-outline flex items-center justify-between">Netbanking</button>
              <button className="button-outline flex items-center justify-between">Wallet</button>
            </div>

            <div className="mt-6 grid gap-3">
              <button className="button-primary w-full" onClick={() => setStatus("SUCCESS")}>Pay ₹10</button>
              <button className="button-outline w-full" onClick={() => setStatus("FAILED")}>Simulate failure</button>
            </div>
          </div>

          <div className="card bg-white">
            <h2 className="text-xl font-semibold">Payment summary</h2>
            <div className="mt-4 grid gap-2 text-sm text-[color:var(--muted)]">
              <div className="flex items-center justify-between">
                <span>Booking fee</span>
                <span>₹10</span>
              </div>
              <div className="flex items-center justify-between border-t border-[color:var(--stroke)] pt-2 text-base font-semibold text-[color:var(--ink)]">
                <span>Total</span>
                <span>₹10</span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[color:var(--stroke)] bg-white p-4 text-sm">
              <p className="text-[color:var(--muted)]">Order ID</p>
              <p className="font-semibold">{searchParams.orderId ?? "DEMO-ORDER"}</p>
              {searchParams.slot ? (
                <p className="mt-2 text-[color:var(--muted)]">Slot: {searchParams.slot}</p>
              ) : null}
            </div>

            <div
              className={`mt-4 rounded-2xl p-4 text-sm ${
                isSuccess
                  ? "bg-[#e6f7ef] text-[#0b6b3a]"
                  : status === "FAILED"
                    ? "bg-[#fde8e8] text-[#b42318]"
                    : "bg-[#fff7e6] text-[#b45f06]"
              }`}
            >
              Status: <span className="font-semibold">{status}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="button-outline" href="/book/dr-sen">
            Back to booking
          </Link>
          <Link className="button-primary" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
