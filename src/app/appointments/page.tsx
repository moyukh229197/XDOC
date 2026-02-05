import Link from "next/link";
import { bookings } from "@/lib/data";

export default function AppointmentsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">Appointments</p>
          <h1 className="section-title">Your appointments</h1>
        </div>
        <Link className="button-outline" href="/">Back to home</Link>
      </div>

      <div className="mt-8 grid gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{booking.doctor}</p>
                <p className="text-sm text-[color:var(--muted)]">
                  {booking.clinic} • {booking.type}
                </p>
              </div>
              <span className="pill">{booking.status}</span>
            </div>
            <p className="mt-3 text-sm text-[color:var(--muted)]">
              {booking.date} • {booking.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
