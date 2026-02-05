"use client";

import Link from "next/link";
import { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "4:00 PM", "4:30 PM", "5:00 PM"]; 

export default function AvailabilityOnboardingPage() {
  const [activeDays, setActiveDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string[]>>({
    Mon: ["9:00 AM", "10:00 AM", "4:00 PM"],
    Tue: ["9:30 AM", "10:30 AM", "4:30 PM"],
  });

  const toggleDay = (day: string) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleSlot = (day: string, slot: string) => {
    setSelectedSlots((prev) => {
      const current = prev[day] ?? [];
      const next = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot];
      return { ...prev, [day]: next };
    });
  };

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">Step 2</p>
          <h1 className="section-title">Set weekly availability</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Choose working days and time slots for each doctor.
          </p>
        </div>
        <Link className="button-outline" href="/clinic/onboarding">
          Back to checklist
        </Link>
      </div>

      <div className="mt-8 grid gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold">Working days</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {days.map((day) => (
              <button
                key={day}
                className={`pill cursor-pointer ${activeDays.includes(day) ? "border-[color:var(--accent-3)] bg-[#eaf7f1] text-[color:var(--accent-3)]" : ""}`}
                type="button"
                onClick={() => toggleDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold">Time slots</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Tap to enable slots for each active day.
          </p>
          <div className="mt-4 grid gap-4">
            {activeDays.map((day) => (
              <div key={day} className="rounded-2xl border border-[color:var(--stroke)] bg-white p-4">
                <p className="font-semibold">{day}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {slots.map((slot) => {
                    const active = (selectedSlots[day] ?? []).includes(slot);
                    return (
                      <button
                        key={`${day}-${slot}`}
                        type="button"
                        className={`pill cursor-pointer ${active ? "border-[color:var(--accent-3)] bg-[#eaf7f1] text-[color:var(--accent-3)]" : ""}`}
                        onClick={() => toggleSlot(day, slot)}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[color:var(--muted)]">Demo only. No data is saved.</p>
            <button className="button-primary" type="button">Save availability</button>
          </div>
        </div>
      </div>
    </div>
  );
}
