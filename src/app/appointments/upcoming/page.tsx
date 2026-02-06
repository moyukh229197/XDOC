"use client";

import Link from "next/link";

const upcomingVisits = [
  {
    id: "visit-1",
    doctor: "Dr. Ananya Sen",
    clinic: "Cooch Behar City Clinic",
    date: "Feb 10, 2026",
    time: "4:30 PM",
    type: "Telehealth",
    status: "Scheduled",
  },
  {
    id: "visit-2",
    doctor: "Dr. Riya Basak",
    clinic: "North Bengal Skin Studio",
    date: "Feb 12, 2026",
    time: "11:00 AM",
    type: "In-person",
    status: "Scheduled",
  },
];

export default function UpcomingAppointmentsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Upcoming bookings
          </p>
          <h1 className="section-title">Your upcoming visits</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="button-outline" href="/appointments">
            Previous appointments
          </Link>
          <Link className="button-outline" href="/profile">
            Back to profile
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        {upcomingVisits.map((visit) => (
          <Link
            key={visit.id}
            href={`/appointments/upcoming/${visit.id}`}
            className="card transition hover:border-[color:var(--accent-3)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{visit.doctor}</p>
                <p className="text-sm text-[color:var(--muted)]">
                  {visit.clinic} • {visit.type}
                </p>
              </div>
              <span className="pill">{visit.status}</span>
            </div>
            <p className="mt-3 text-sm text-[color:var(--muted)]">
              {visit.date} • {visit.time}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
