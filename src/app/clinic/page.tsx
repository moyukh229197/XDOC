"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clinicCalendars, clinicIdFromName, doctors, getDemoCalendar } from "@/lib/data";

export default function ClinicCalendar() {
  const [query, setQuery] = useState("");
  const [doctorList, setDoctorList] = useState(doctors);

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

  const clinicRatings = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    doctorList.forEach((doctor) => {
      const key = doctor.clinic;
      const entry = map.get(key) ?? { total: 0, count: 0 };
      entry.total += doctor.rating;
      entry.count += 1;
      map.set(key, entry);
    });
    const ratingMap = new Map<string, number>();
    map.forEach((value, key) => {
      ratingMap.set(key, Math.round((value.total / value.count) * 10) / 10);
    });
    return ratingMap;
  }, [doctorList]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clinicCalendars;
    return clinicCalendars.filter((item) =>
      [item.doctorName, item.clinic, item.location].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [query]);

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Clinic Calendar
          </p>
          <h1 className="section-title">Doctor schedules</h1>
        </div>
        <Link className="button-outline" href="/">
          Back to home
        </Link>
      </div>

      <div className="glass mt-8 rounded-[24px] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
            placeholder="Search doctor, clinic, or location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="button-primary">Search</button>
        </div>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          Showing {filtered.length} calendars
        </p>
      </div>

      <div className="mt-10 grid gap-6">
        {filtered.map((calendar) => (
          <div key={calendar.doctorId} className="card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{calendar.doctorName}</h2>
                <p className="text-sm text-[color:var(--muted)]">
                  {calendar.clinic} • {calendar.location} •{" "}
                  {clinicRatings.get(calendar.clinic) ?? "4.5"}★
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="hidden items-center gap-2 rounded-2xl border border-[color:var(--stroke)] bg-white px-3 py-2 text-xs md:flex">
                  {getDemoCalendar(calendar.doctorId, 7).map((day) => (
                    <div
                      key={`${calendar.doctorId}-${day.label}`}
                      className={`flex h-10 w-10 flex-col items-center justify-center rounded-xl border ${
                        day.status === "available"
                          ? "border-[color:var(--accent-3)] text-[color:var(--accent-3)]"
                          : day.status === "fast-filling"
                            ? "border-[color:var(--accent)] text-[color:var(--accent)]"
                            : "border-[#e35b5b] text-[#c0392b]"
                      }`}
                    >
                      <span className="text-[10px] uppercase">{day.weekday}</span>
                      <span className="text-xs font-semibold">{day.label.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
                <Link className="button-outline" href={`/doctors/${calendar.doctorId}`}>
                  View profile
                </Link>
                <Link
                  className="button-outline"
                  href={`/clinic/${clinicIdFromName(calendar.clinic)}`}
                >
                  View clinic
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {calendar.schedule.map((day) => (
                <div
                  key={`${calendar.doctorId}-${day.day}`}
                  className="rounded-2xl border border-[color:var(--stroke)] bg-white p-4"
                >
                  <p className="font-semibold">{day.day}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {day.slots.map((slot) => (
                      <span
                        key={`${day.day}-${slot.time}`}
                        className={`pill ${
                          slot.status === "open"
                            ? "border-[color:var(--accent-3)] text-[color:var(--accent-3)]"
                            : slot.status === "booked"
                              ? "border-[color:var(--accent)] text-[color:var(--accent)]"
                              : "border-[color:var(--stroke)] text-[color:var(--muted)]"
                        }`}
                      >
                        {slot.time} • {slot.status}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
