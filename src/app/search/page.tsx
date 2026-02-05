"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  doctors,
  getTodayAvailabilityStatus,
  getVisitingSummary,
  neighborhoods,
  specialties,
} from "@/lib/data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [applied, setApplied] = useState({
    query: "",
    specialty: "",
    location: "",
  });
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

  const filteredDoctors = useMemo(() => {
    const q = applied.query.trim().toLowerCase();
    const s = applied.specialty;
    const l = applied.location;

    return doctorList.filter((doctor) => {
      const matchesQuery =
        !q ||
        doctor.name.toLowerCase().includes(q) ||
        doctor.clinic.toLowerCase().includes(q);
      const matchesSpecialty = !s || doctor.specialty === s;
      const matchesLocation = !l || doctor.location === l;
      return matchesQuery && matchesSpecialty && matchesLocation;
    });
  }, [applied, doctorList]);

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Search Doctors
          </p>
          <h1 className="section-title">Available appointments</h1>
        </div>
        <Link className="button-outline" href="/">
          Back to home
        </Link>
      </div>

      <div className="glass mt-8 rounded-[24px] p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
            placeholder="Doctor or clinic"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
            value={selectedSpecialty}
            onChange={(event) => setSelectedSpecialty(event.target.value)}
          >
            <option value="">All specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty}>{specialty}</option>
            ))}
          </select>
          <select
            className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
            value={selectedLocation}
            onChange={(event) => setSelectedLocation(event.target.value)}
          >
            <option value="">All locations</option>
            {neighborhoods.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
          <button
            className="button-primary w-full"
            onClick={() =>
              setApplied({
                query,
                specialty: selectedSpecialty,
                location: selectedLocation,
              })
            }
          >
            Filter
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
          <span className="pill">Telehealth</span>
          <span className="pill">In-person</span>
          <span className="pill">Insurance accepted</span>
          <span className="pill">Open today</span>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-8">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="card">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <Link className="text-xl font-semibold" href={`/doctors/${doctor.id}`}>
                    {doctor.name}
                  </Link>
                  <p className="text-sm text-[color:var(--muted)]">
                    {doctor.specialty} • {doctor.clinic}
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">
                    Visiting: {getVisitingSummary(doctor.id).days} • {getVisitingSummary(doctor.id).timeRange}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="pill">{doctor.location}</span>
                    <span className="pill">{doctor.experience}</span>
                    {doctor.telehealth ? <span className="pill">Telehealth</span> : null}
                    <span className="pill">{doctor.rating}★ ({doctor.reviews})</span>
                    <span className="pill">
                      Today: {getTodayAvailabilityStatus(doctor.id)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[color:var(--muted)]">Consultation fee</p>
                  <p className="text-2xl font-semibold">₹{doctor.fee}</p>
                  <p className="text-xs text-[color:var(--muted)]">Booking fee ₹{doctor.bookingFee}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {doctor.slots.map((slot) => (
                  <span
                    key={slot.time}
                    className={`pill ${
                      slot.status === "open"
                        ? "border-[color:var(--accent-3)] text-[color:var(--accent-3)]"
                        : slot.status === "waitlist"
                          ? "border-[color:var(--accent)] text-[color:var(--accent)]"
                          : "border-[color:var(--stroke)] text-[color:var(--muted)]"
                    }`}
                  >
                    {slot.time} • {slot.type}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="button-primary" href={`/book/${doctor.id}`}>
                  Book appointment
                </Link>
                <Link className="button-outline" href={`/doctors/${doctor.id}`}>
                  View profile
                </Link>
                <button className="button-outline">Join waitlist</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="card h-fit">
          <h3 className="text-2xl">Why patients love XDOC</h3>
          <ul className="mt-6 grid gap-4 text-sm text-[color:var(--muted)]">
            <li>OTP login with your mobile number.</li>
            <li>Transparent booking fee before you pay.</li>
            <li>SMS + email reminders so you don&apos;t miss slots.</li>
            <li>Verified reviews from real appointments.</li>
          </ul>
          <div className="mt-6 grid gap-3">
            <button className="button-primary">Start OTP login</button>
            <Link className="button-outline" href="/">
              Explore home
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
