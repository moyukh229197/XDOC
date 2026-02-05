"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { doctors } from "@/lib/data";

type PageProps = {
  params: { id: string };
};

export default function BookingPage({ params }: PageProps) {
  const [doctorList, setDoctorList] = useState(doctors);
  const doctor = doctorList.find((item) => item.id === params.id) ?? doctorList[0];
  const isFallback = !doctorList.some((item) => item.id === params.id);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [liveQueue, setLiveQueue] = useState({
    currentToken: 18,
    patientsAhead: 6,
    waitMinutes: 22,
  });
  const [patientGender, setPatientGender] = useState<"M" | "F" | "O">("M");
  const [patientAge, setPatientAge] = useState<string>("");
  const [patientSubdivision, setPatientSubdivision] = useState("Cooch Behar Town");
  const [patientId, setPatientId] = useState<string | null>(null);

  const dateOptions = useMemo(() => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toDateString());
    }
    return dates;
  }, []);

  // Demo token generation (stable for a given date + slot).
  const tokenNumber = useMemo(() => {
    if (!selectedSlot || !selectedDate) return null;
    const seed = `${doctor.id}-${selectedDate}-${selectedSlot}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return (hash % 60) + 1;
  }, [doctor.id, selectedDate, selectedSlot]);

  const timeWindow = useMemo(() => {
    if (!selectedSlot) return null;
    const match = selectedSlot.match(/(\\d{1,2}):(\\d{2})\\s?(AM|PM)/i);
    if (!match) return null;
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const period = match[3].toUpperCase();
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    const totalMinutes = hour * 60 + minute;
    const start = totalMinutes - 15;
    const end = totalMinutes + 15;
    const format = (mins: number) => {
      const h24 = (mins + 1440) % 1440;
      const h = Math.floor(h24 / 60);
      const m = h24 % 60;
      const suffix = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${h12}:${m.toString().padStart(2, "0")} ${suffix}`;
    };
    return `${format(start)} - ${format(end)}`;
  }, [selectedSlot]);

  useEffect(() => {
    const slot = searchParams.get("slot");
    if (slot) setSelectedSlot(slot);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.doctors) && data.doctors.length) {
          setDoctorList(data.doctors);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (dateOptions.length && !selectedDate) {
      setSelectedDate(dateOptions[0]);
    }
  }, [dateOptions, selectedDate]);

  useEffect(() => {
    if (!patientAge || !patientSubdivision) return;
    fetch("/api/ids/patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: patientSubdivision,
        gender: patientGender,
        age: patientAge,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.pid) setPatientId(data.pid);
      })
      .catch(() => {});
  }, [patientAge, patientSubdivision, patientGender]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveQueue((prev) => {
        const currentToken = prev.currentToken + 1;
        const patientsAhead = Math.max(prev.patientsAhead - 1, 0);
        const waitMinutes = Math.max(prev.waitMinutes - 2, 5);
        return {
          currentToken,
          patientsAhead,
          waitMinutes,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Booking
          </p>
          <h1 className="section-title">Confirm your appointment</h1>
        </div>
        <Link className="button-outline" href={`/doctors/${doctor.id}`}>
          Back to profile
        </Link>
      </div>

      {isFallback ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--stroke)] bg-white p-4 text-sm text-[color:var(--muted)]">
          Doctor not found. Showing a featured doctor instead.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p className="text-sm text-[color:var(--muted)]">{doctor.specialty}</p>
            </div>
            <span className="pill">{doctor.location}</span>
          </div>

          <div className="mt-6 grid gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Pick a slot
              </p>
              <div className="mt-3">
                <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Select date
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {dateOptions.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {doctor.slots.map((slot) => {
                  const isSelectable = slot.status === "open";
                  const isSelected = selectedSlot === slot.time;

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => {
                        if (isSelectable) setSelectedSlot(slot.time);
                      }}
                      aria-pressed={isSelected}
                      disabled={!isSelectable}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-[color:var(--accent)] bg-[#fff2e7] shadow-sm"
                          : "border-[color:var(--stroke)] bg-white"
                      } ${!isSelectable ? "opacity-60" : "hover:-translate-y-0.5"}`}
                    >
                      <div>
                        <p className="font-semibold">{slot.time}</p>
                        <p className="text-sm text-[color:var(--muted)]">{slot.type}</p>
                      </div>
                      <span className="pill">
                        {isSelected ? "Selected" : slot.status === "open" ? "Select" : slot.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Patient details
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <input
                  className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                  placeholder="Full name"
                />
                <input
                  className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                  placeholder="Mobile number"
                />
                <input
                  className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                  placeholder="Reason for visit"
                />
                <select className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3">
                  <option>In-person</option>
                  <option>Telehealth</option>
                </select>
                <select className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3" value={patientGender} onChange={(e) => setPatientGender(e.target.value as "M" | "F" | "O")}>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
                <input
                  className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                  placeholder="Age"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <select className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3" value={patientSubdivision} onChange={(e) => setPatientSubdivision(e.target.value)}>
                  <option>Cooch Behar Town</option>
                  <option>Dinhata</option>
                  <option>Tufanganj</option>
                  <option>Mathabhanga</option>
                  <option>Sitalkuchi</option>
                  <option>Mekhliganj</option>
                </select>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Reminders
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <label className="pill">
                  <input className="mr-2" type="checkbox" defaultChecked /> SMS reminder
                </label>
                <label className="pill">
                  <input className="mr-2" type="checkbox" defaultChecked /> Email reminder
                </label>
              </div>
            </div>
          </div>
        </div>

        <aside className="card h-fit">
          <h3 className="text-2xl">Payment summary</h3>
          <div className="mt-6 grid gap-3 text-sm text-[color:var(--muted)]">
            <div className="flex items-center justify-between">
              <span>Consultation fee</span>
              <span>₹{doctor.fee}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Booking fee</span>
              <span>₹{doctor.bookingFee}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[color:var(--stroke)] pt-3 text-base font-semibold text-[color:var(--ink)]">
              <span>Total due now</span>
              <span>₹{doctor.bookingFee}</span>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-[color:var(--stroke)] bg-white p-4 text-sm text-[color:var(--muted)]">
            <p className="font-semibold text-[color:var(--ink)]">Your token details</p>
            <p className="mt-2">
              Token number: {tokenNumber ?? "Pick date + slot to generate"}
            </p>
            <p className="mt-1">
              Expected consultation window: {timeWindow ?? "Choose a slot to estimate"}
            </p>
            <p className="mt-1">
              Patient ID: {patientId ?? "Enter gender, age, and subdivision"}
            </p>
          </div>
          {/* Live demo queue ticker with rotating values. */}
          <div className="mt-4 rounded-2xl border border-[color:var(--stroke)] bg-white p-4 text-sm text-[color:var(--muted)]">
            <p className="font-semibold text-[color:var(--ink)]">Live queue (demo)</p>
            <div className="mt-2 grid gap-2">
              <p>
                Current token: <span className="font-semibold text-[color:var(--ink)]">{liveQueue.currentToken}</span>
              </p>
              <p>
                Patients ahead: <span className="font-semibold text-[color:var(--ink)]">{liveQueue.patientsAhead}</span>
              </p>
              <p>
                Estimated wait: <span className="font-semibold text-[color:var(--ink)]">{liveQueue.waitMinutes} mins</span>
              </p>
            </div>
          </div>
          <button
            className="button-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!selectedSlot || isPaying}
            onClick={() => {
              if (!selectedSlot) return;
              setIsPaying(true);
              const orderId = `DEMO-${Date.now()}`;
              const params = new URLSearchParams({
                orderId,
                status: "SUCCESS",
                slot: selectedSlot,
              });
              window.location.href = `/payment/return?${params.toString()}`;
            }}
          >
            {isPaying ? "Redirecting..." : "Pay booking fee"}
          </button>
          <p className="mt-4 text-xs text-[color:var(--muted)]">
            Demo payment flow. Remaining consultation fee is paid at the clinic.
          </p>
          <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--stroke)] p-4 text-sm text-[color:var(--muted)]">
            OTP verification will be sent to the patient&apos;s phone after payment.
          </div>
        </aside>
      </div>
    </div>
  );
}
