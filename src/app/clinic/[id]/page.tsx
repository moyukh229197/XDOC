"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clinicIdFromName, clinics, doctors } from "@/lib/data";

type ClinicPageProps = {
  params: {
    id: string;
  };
};

export default function ClinicProfilePage({ params }: ClinicPageProps) {
  const [doctorList, setDoctorList] = useState(doctors);
  const clinicFromList = clinics.find(
    (item) => item.id === params.id || clinicIdFromName(item.name) === params.id
  );

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

  const clinicDoctors = useMemo(() => {
    return doctorList.filter(
      (doctor) => clinicIdFromName(doctor.clinic) === params.id
    );
  }, [doctorList, params.id]);

  const clinic = useMemo(() => {
    if (clinicFromList) return clinicFromList;
    if (!clinicDoctors.length) return null;
    const totalRating = clinicDoctors.reduce((sum, doc) => sum + doc.rating, 0);
    const avgRating = Math.round((totalRating / clinicDoctors.length) * 10) / 10;
    const location = clinicDoctors[0]?.location ?? "Cooch Behar";
    return {
      id: params.id,
      name: clinicDoctors[0]?.clinic ?? "Clinic",
      location,
      rating: avgRating,
      waitTime: "20 mins",
      status: "medium" as const,
      waiting: "5 patients",
      available: `${Math.max(1, Math.min(3, clinicDoctors.length))} doctors`,
    };
  }, [clinicDoctors, clinicFromList, params.id]);

  if (!clinic) {
    return (
      <div className="container py-12">
        <h1 className="section-title">Clinic not found</h1>
        <p className="mt-2 text-[color:var(--muted)]">
          Please go back to the clinic list and try again.
        </p>
        <Link className="button-outline mt-6 inline-flex" href="/clinic">
          Back to clinic calendar
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Clinic profile
          </p>
          <h1 className="section-title">{clinic.name}</h1>
          <p className="mt-2 text-[color:var(--muted)]">
            {clinic.location} • {clinic.rating}★ rating
          </p>
        </div>
        <Link className="button-outline" href="/clinic">
          Back to calendar
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="text-2xl">Waiting time</h2>
          <p className="mt-3 text-3xl font-semibold text-[#ff5a2c]">
            {clinic.waitTime}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-[color:var(--muted)]">
            <div className="flex items-center justify-between">
              <span>Waiting</span>
              <span className="font-semibold text-[color:var(--ink)]">
                {clinic.waiting}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Available</span>
              <span className="font-semibold text-[color:var(--ink)]">
                {clinic.available}
              </span>
            </div>
          </div>
          <span
            className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              clinic.status === "low"
                ? "bg-[#e4f8e9] text-[#1b8f4e]"
                : clinic.status === "medium"
                ? "bg-[#fff3cc] text-[#a76a00]"
                : "bg-[#ffe0d6] text-[#c84f1b]"
            }`}
          >
            {clinic.status} load
          </span>
        </div>

        <div className="card">
          <h2 className="text-2xl">Clinic details</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Fast check-ins, live queue visibility, and priority booking updates.
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-[color:var(--muted)]">
            <li>Live queue updates every 5 minutes.</li>
            <li>Telehealth options available for select doctors.</li>
            <li>Booking fee adjusted at clinic.</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="button-primary" href="/search">
              Book appointment
            </Link>
            <Link className="button-outline" href="/clinic">
              View all clinics
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl">Doctors at {clinic.name}</h2>
          <Link className="button-outline" href="/search">
            Find another doctor
          </Link>
        </div>
        {clinicDoctors.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clinicDoctors.map((doctor) => (
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
                <p className="text-sm text-[color:var(--muted)]">
                  Fee ₹{doctor.fee} • {doctor.experience}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="pill">{doctor.location}</span>
                  <div className="flex items-center gap-2">
                    <Link className="button-outline" href={`/doctors/${doctor.id}`}>
                      View profile
                    </Link>
                    <Link className="button-primary" href={`/book/${doctor.id}`}>
                      Book now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            Doctors for this clinic will appear here once they are added.
          </p>
        )}
      </div>
    </div>
  );
}
