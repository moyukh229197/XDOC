"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const upcomingVisits = [
  {
    id: "visit-1",
    doctor: "Dr. Ananya Sen",
    clinic: "Cooch Behar City Clinic",
    date: "Feb 10, 2026",
    time: "4:30 PM",
    type: "Telehealth",
    status: "Scheduled",
    room: "Telehealth Room A",
    instructions: "Join 5 minutes early. Keep ID ready.",
  },
  {
    id: "visit-2",
    doctor: "Dr. Riya Basak",
    clinic: "North Bengal Skin Studio",
    date: "Feb 12, 2026",
    time: "11:00 AM",
    type: "In-person",
    status: "Scheduled",
    room: "Clinic Room 2",
    instructions: "Arrive 10 minutes early for check-in.",
  },
];

export default function UpcomingAppointmentDetail() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const visit = upcomingVisits.find((item) => item.id === id) ?? upcomingVisits[0];

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Upcoming booking
          </p>
          <h1 className="section-title">Booking details</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="button-outline" href="/appointments/upcoming">
            Back to upcoming
          </Link>
          <Link className="button-outline" href="/profile">
            Back to profile
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <h2 className="text-2xl font-semibold">{visit.doctor}</h2>
          <p className="mt-2 text-[color:var(--muted)]">
            {visit.clinic} • {visit.type}
          </p>
          <div className="mt-6 grid gap-3 text-sm text-[color:var(--muted)]">
            <div className="flex items-center justify-between">
              <span>Date</span>
              <span className="font-semibold text-[color:var(--ink)]">{visit.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Time</span>
              <span className="font-semibold text-[color:var(--ink)]">{visit.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="pill">{visit.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Room</span>
              <span className="font-semibold text-[color:var(--ink)]">{visit.room}</span>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-[color:var(--stroke)] bg-white p-4 text-sm text-[color:var(--muted)]">
            {visit.instructions}
          </div>
        </div>

        <div className="card h-fit">
          <h3 className="text-xl font-semibold">Quick actions</h3>
          <div className="mt-4 grid gap-3">
            <Link className="button-primary" href="/medical-history">
              View medical history
            </Link>
            <Link className="button-outline" href="/search">
              Book another doctor
            </Link>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--stroke)] p-4 text-sm text-[color:var(--muted)]">
            Reminder SMS will be sent 24 hours and 2 hours before the visit.
          </div>
        </div>
      </div>
    </div>
  );
}
