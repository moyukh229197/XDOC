"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DoctorActions from "@/components/DoctorActions";
import { doctors, getDemoCalendar, getTodayAvailabilityStatus, getVisitingSummary } from "@/lib/data";

type PageProps = {
  params: { id: string };
};

export default function DoctorProfile({ params }: PageProps) {
  const [doctorList, setDoctorList] = useState(doctors);
  const doctor = doctorList.find((item) => item.id === params.id) ?? doctorList[0];
  const isFallback = !doctorList.some((item) => item.id === params.id);
  const calendar = getDemoCalendar(doctor.id, 28);

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
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Doctor Profile
          </p>
          <h1 className="section-title">{doctor.name}</h1>
          <p className="mt-2 text-[color:var(--muted)]">
            {doctor.specialty} • {doctor.clinic}
          </p>
        </div>
        <Link className="button-outline" href="/search">
          Back to search
        </Link>
      </div>

      {isFallback ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--stroke)] bg-white p-4 text-sm text-[color:var(--muted)]">
          Doctor not found. Showing a featured doctor instead.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card">
          <div className="mb-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Profile highlight
              </p>
              <h2 className="section-title mt-2">{doctor.name}</h2>
              <p className="mt-2 text-[color:var(--muted)]">
                {doctor.specialty} • {doctor.clinic}
              </p>
            </div>
            <div className="rounded-3xl border border-[color:var(--stroke)] bg-white p-4">
              <img
                src={doctor.profileImage}
                alt={`${doctor.name} illustration`}
                className="h-60 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="pill">{doctor.location}</span>
            <span className="pill">{doctor.experience}</span>
            <span className="pill">
              {doctor.rating}★ ({doctor.reviews})
            </span>
            {doctor.telehealth ? <span className="pill">Telehealth</span> : null}
            <span className="pill">
              Today: {getTodayAvailabilityStatus(doctor.id)}
            </span>
          </div>

          <div className="mt-4 grid gap-4">
            <h2 className="text-xl font-semibold">About Dr. {doctor.name.split(" ")[1]}</h2>
            <p className="text-[color:var(--muted)]">{doctor.about}</p>
            <p className="text-sm text-[color:var(--muted)]">
              Visiting: {getVisitingSummary(doctor.id).days} • {getVisitingSummary(doctor.id).timeRange}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-[color:var(--stroke)] bg-white p-4">
                <p className="text-sm text-[color:var(--muted)]">Clinic</p>
                <p className="font-semibold">{doctor.clinic}</p>
              </div>
              <div className="rounded-2xl border border-[color:var(--stroke)] bg-white p-4">
                <p className="text-sm text-[color:var(--muted)]">Languages</p>
                <p className="font-semibold">{doctor.languages.join(", ")}</p>
              </div>
              <div className="rounded-2xl border border-[color:var(--stroke)] bg-white p-4">
                <p className="text-sm text-[color:var(--muted)]">Consultation fee</p>
                <p className="font-semibold">₹{doctor.fee}</p>
              </div>
              <div className="rounded-2xl border border-[color:var(--stroke)] bg-white p-4">
                <p className="text-sm text-[color:var(--muted)]">Booking fee</p>
                <p className="font-semibold">₹{doctor.bookingFee}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Available slots today</h2>
              <Link className="button-outline" href={`/book/${doctor.id}`}>
                Book now
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {doctor.slots.map((slot) => (
                <div
                  key={slot.time}
                  className="flex items-center justify-between rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">{slot.time}</p>
                    <p className="text-sm text-[color:var(--muted)]">{slot.type}</p>
                  </div>
                  {slot.status === "open" ? (
                    <Link
                      className="pill border-[color:var(--accent-3)] text-[color:var(--accent-3)]"
                      href={`/book/${doctor.id}?slot=${encodeURIComponent(slot.time)}`}
                    >
                      Book
                    </Link>
                  ) : (
                    <span className="pill">{slot.status}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Availability calendar</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Green = available, Orange = fast filling, Red = booked.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {calendar.map((day) => (
                <div
                  key={`${day.label}-${day.weekday}`}
                  className={`rounded-2xl border px-3 py-3 text-center text-sm ${
                    day.status === "available"
                      ? "border-[color:var(--accent-3)] bg-[#eaf7f1] text-[color:var(--accent-3)]"
                      : day.status === "fast-filling"
                        ? "border-[color:var(--accent)] bg-[#fff1e6] text-[color:var(--accent)]"
                        : "border-[#e35b5b] bg-[#fdecec] text-[#c0392b]"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.2em]">{day.weekday}</p>
                  <p className="mt-1 font-semibold">{day.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3">
            <h3 className="text-lg font-semibold">Patient stories</h3>
            <div className="rounded-2xl border border-[color:var(--stroke)] bg-white p-4">
              <p className="font-semibold">&ldquo;Quick and kind consultation.&rdquo;</p>
              <p className="text-sm text-[color:var(--muted)]">— Ananya, verified patient</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--stroke)] bg-white p-4">
              <p className="font-semibold">&ldquo;Explained everything clearly.&rdquo;</p>
              <p className="text-sm text-[color:var(--muted)]">— Debajit, verified patient</p>
            </div>
          </div>
        </div>

        <aside className="card h-fit">
          <h3 className="text-2xl">Book this doctor</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Consultation fee ₹{doctor.fee}. Booking fee ₹{doctor.bookingFee}.
          </p>
          <div className="mt-6 grid gap-3">
            <Link className="button-primary" href={`/book/${doctor.id}`}>
              Book appointment
            </Link>
            <DoctorActions doctorName={doctor.name} telehealth={doctor.telehealth} />
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--stroke)] p-4 text-sm text-[color:var(--muted)]">
            SMS + email reminders go out 24 hours and 2 hours before your slot.
          </div>
        </aside>
      </div>
    </div>
  );
}
