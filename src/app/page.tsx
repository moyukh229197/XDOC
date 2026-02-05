"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthLink from "@/components/AuthLink";
import UserBadge from "@/components/UserBadge";
import { bookings, doctors, neighborhoods, specialties } from "@/lib/data";

export default function Home() {
  const [doctorList, setDoctorList] = useState(doctors);
  const topDoctors = useMemo(() => doctorList.slice(0, 3), [doctorList]);

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

  return (
    <div className="pt-6 pb-8 relative">
      <div className="rajbari-sketch" aria-hidden="true" />
      {/* Reduced header vertical padding to remove excess space around logo/nav. */}
      <header className="container pt-1 pb-3 fade-up">
        <nav className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 -mb-12">
            <div className="flex h-72 items-center justify-center">
              <img src="/images/xdoc-logo-wide.png" alt="XDOC logo" className="h-72 w-auto" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
            <Link className="pill" href="/search">
              Find Doctors
            </Link>
            <Link className="pill" href="/clinic">
              Clinic Calendar
            </Link>
            <AuthLink />
            <UserBadge />
          </div>
        </nav>

        <div className="mt-4 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="badge">Patients first</span>
            <h2 className="section-title mt-4">
              Know your doctor’s availability before you travel to Cooch Behar.
            </h2>
            {/* Updated hero copy to highlight availability before travel. */}
            <p className="mt-4 text-lg text-[color:var(--muted)]">
              See doctor availability, fees, and your expected turn time before coming to town.
              Book a slot and travel with confidence.
            </p>
            {/* Added local context line to reduce travel anxiety. */}
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Serving Cooch Behar town and nearby subdivisions.
            </p>

            <div className="glass mt-8 rounded-[28px] p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Location
                  </p>
                  <select className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3">
                    {neighborhoods.map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Specialty
                  </p>
                  <select className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3">
                    {specialties.map((specialty) => (
                      <option key={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Visit Type
                  </p>
                  <select className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3">
                    <option>In-person</option>
                    <option>Telehealth</option>
                    <option>Either</option>
                  </select>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link className="button-primary" href="/search">
                  Find doctors today
                </Link>
                <Link className="button-outline" href="/clinic">
                  View clinic schedules
                </Link>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-[color:var(--muted)]">
              <div>
                <p className="text-2xl font-semibold text-[color:var(--ink)]">38</p>
                <p>Active clinics</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[color:var(--ink)]">1,260+</p>
                <p>Appointments booked</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[color:var(--ink)]">4.7★</p>
                <p>Patient satisfaction</p>
              </div>
            </div>
          </div>

          <div className="card relative overflow-hidden">
            <h3 className="text-2xl">Next available consultation</h3>
            <p className="mt-2 text-[color:var(--muted)]">
              Dr. Ananya Sen • General Physician
            </p>
            <div className="mt-6 grid gap-3">
              <div className="flex items-center justify-between rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3">
                <div>
                  <p className="font-semibold">Today, 4:30 PM</p>
                  <p className="text-sm text-[color:var(--muted)]">Telehealth</p>
                  {/* Added booking fee trust note near price. */}
                  <p className="mt-1 text-xs text-[color:var(--muted)]">
                    Booking fee ₹10 • Booking fee adjusted at clinic. No hidden charges.
                  </p>
                </div>
                <Link className="button-primary whitespace-nowrap" href="/book/dr-sen">
                  Book now
                </Link>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3">
                <div>
                  <p className="font-semibold">Today, 6:00 PM</p>
                  <p className="text-sm text-[color:var(--muted)]">Dermatology</p>
                </div>
                <Link className="button-outline" href="/doctors/dr-basak">
                  View profile
                </Link>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-[color:var(--stroke)] bg-white p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--muted)]">
                Your bookings
              </p>
              <div className="mt-4 grid gap-3 text-sm">
                {bookings.slice(0, 2).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[color:var(--stroke)] bg-[color:var(--card)] px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold">{booking.doctor}</p>
                      <p className="text-[color:var(--muted)]">
                        {booking.date} • {booking.time} • {booking.type}
                      </p>
                    </div>
                    <span className="pill">{booking.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container py-16 fade-up delay-1">
        <div className="hero-gallery mb-10 grid gap-6 md:grid-cols-2">
          <img src="/images/home-card-1.png" alt="Book doctor appointment" />
          <img src="/images/home-card-2.png" alt="Cooch Behar Rajbari" />
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Top doctors this week</h2>
            <p className="mt-2 text-[color:var(--muted)]">
              Carefully ranked by verified reviews and availability.
            </p>
          </div>
          <Link className="button-outline" href="/search">
            Explore all doctors
          </Link>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {topDoctors.map((doctor) => (
            <div key={doctor.id} className="card flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <Link className="text-lg font-semibold" href={`/doctors/${doctor.id}`}>
                    {doctor.name}
                  </Link>
                  <p className="text-sm text-[color:var(--muted)]">{doctor.specialty}</p>
                </div>
                <span className="pill">{doctor.rating}★</span>
              </div>
              <p className="text-sm text-[color:var(--muted)]">{doctor.clinic}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="pill">{doctor.location}</span>
                <span className="pill">{doctor.experience}</span>
                {doctor.telehealth ? <span className="pill">Telehealth</span> : null}
              </div>
              <div className="mt-auto flex items-center justify-between">
                <p className="text-sm text-[color:var(--muted)]">Fee ₹{doctor.fee}</p>
                <Link className="button-primary" href={`/doctors/${doctor.id}`}>
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-28 fade-up delay-2">
        <div className="mb-8 grid gap-6 md:grid-cols-[1.4fr_0.6fr]">
            <div className="card">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
                    Booking deal
                  </p>
                  {/* Updated booking deal headline for clarity and trust. */}
                  <h3 className="text-2xl">Secure your doctor visit for just ₹10</h3>
                  {/* Updated booking deal subtext to reduce travel anxiety. */}
                  <p className="mt-2 text-sm text-[color:var(--muted)]">
                    Your slot is reserved with priority.
                    Get instant SMS confirmation. No standing in queues.
                  </p>
                  {/* Added micro-trust note near SMS mention. */}
                  <p className="mt-2 text-xs text-[color:var(--muted)]">
                    Works on basic phones. No app required.
                  </p>
                </div>
                <Link className="button-primary" href="/search">
                  Confirm my slot
                </Link>
              </div>
            </div>
          <div className="card card-red flex flex-col items-center justify-center text-center text-white">
            {/* Removed "AD" label and softened promo copy. */}
            <p className="mt-2 text-3xl font-semibold">Flat ₹10 booking fee</p>
            <p className="mt-1 text-sm text-white/80">No extra charges</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card">
            <h3 className="text-2xl">How XDOC helps patients</h3>
            <div className="mt-6 grid gap-4">
              <div className="flex items-start gap-4">
                <span className="pill">01</span>
                <div>
                  {/* Updated item 01 for availability clarity. */}
                  <p className="font-semibold">Live doctor availability</p>
                  <p className="text-sm text-[color:var(--muted)]">
                    See exactly when a doctor is available before coming to town.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="pill">02</span>
                <div>
                  {/* Updated item 02 for simple login messaging. */}
                  <p className="font-semibold">Easy mobile login</p>
                  <p className="text-sm text-[color:var(--muted)]">
                    Sign in using your mobile number. No passwords to remember.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="pill">03</span>
                <div>
                  {/* Updated item 03 for confirmed slot messaging. */}
                  <p className="font-semibold">Confirmed slot + updates</p>
                  <p className="text-sm text-[color:var(--muted)]">
                    Pay a small fee to secure your turn and get notified if an earlier slot opens.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            {/* Added clinic-local label for relevance. */}
            <p className="text-sm text-[color:var(--muted)]">For clinics in Cooch Behar</p>
            <h3 className="text-2xl">Clinic onboarding checklist</h3>
            {/* Added helper line for time-to-value. */}
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Start accepting online bookings in under 30 minutes.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-[color:var(--muted)]">
              <li className="flex items-center justify-between rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3">
                <Link href="/clinic/onboarding/profiles" className="font-medium">
                  Upload doctor profiles
                </Link>
                <span className="pill">5 mins</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3">
                <Link href="/clinic/onboarding/availability" className="font-medium">
                  Set weekly availability
                </Link>
                <span className="pill">10 mins</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3">
                <Link href="/clinic/onboarding/payments" className="font-medium">
                  Enable telehealth + payments
                </Link>
                <span className="pill">8 mins</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3">
                <Link href="/clinic/onboarding/launch" className="font-medium">
                  Launch patient booking
                </Link>
                <span className="pill">Instant</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link className="button-primary" href="/clinic/onboarding">
                Start accepting bookings
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-12 footer-dark footer-home-bg border-t border-[color:var(--stroke)]">
        <div className="container pt-16 pb-16">
          <div className="footer-grid pt-4">
            <div>
              <h3 className="text-lg font-semibold">XDOC</h3>
              <p className="mt-3 text-sm muted">
                Local doctor availability, fees, and expected turn times—before you travel.
              </p>
              <div className="mt-6 flex gap-3 text-sm">
                <Link href="/search">Doctors</Link>
                <Link href="/clinic">Clinics</Link>
                <Link href="/auth">Login / Signup</Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-[0.3em] muted">Our partners</h4>
              <div className="logo-row mt-4">
                <span className="pill">CoochCare</span>
                <span className="pill">NorthBengal</span>
                <span className="pill">City Clinic</span>
                <span className="pill">Wellness Plus</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-[0.3em] muted">Payment partners</h4>
              <div className="logo-row payments mt-4">
                <span className="logo-tile">
                  <img src="/logos/phonepe.svg" alt="PhonePe" />
                </span>
                <span className="logo-tile">
                  <img src="/logos/google-pay.png" alt="Google Pay" />
                </span>
                <span className="logo-tile">
                  <img src="/logos/paytm.png" alt="Paytm" />
                </span>
                <span className="logo-tile">
                  <img src="/logos/visa.png" alt="Visa" />
                </span>
                <span className="logo-tile">
                  <img src="/logos/mastercard.png" alt="Mastercard" />
                </span>
                <span className="logo-tile">
                  <img src="/logos/lazypay.webp" alt="LazyPay" />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[color:var(--stroke)] pt-8 pb-2 text-xs muted">
            © 2026 XDOC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
