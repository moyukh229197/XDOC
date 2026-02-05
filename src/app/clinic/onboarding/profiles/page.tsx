"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProfilesOnboardingPage() {
  const [doctors, setDoctors] = useState([
    { name: "Dr. Ananya Sen", specialty: "General Physician", fee: "600" },
  ]);
  const [clinicName, setClinicName] = useState("Cooch Behar City Clinic");
  const [clinicLocation, setClinicLocation] = useState("Cooch Behar Town");
  const [status, setStatus] = useState<string | null>(null);

  const addDoctor = () => {
    setDoctors((prev) => [
      ...prev,
      { name: "", specialty: "Dermatologist", fee: "" },
    ]);
  };

  const updateDoctor = (index: number, field: string, value: string) => {
    setDoctors((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, [field]: value } : doc))
    );
  };

  const generateDidPreview = (name: string, specialty: string, index: number) => {
    const locationCodes: Record<string, string> = {
      "Cooch Behar Town": "CB",
      Dinhata: "DI",
      Tufanganj: "TU",
      Mathabhanga: "MA",
      Sitalkuchi: "SI",
      Mekhliganj: "ME",
    };
    const specialtyCodes: Record<string, string> = {
      "General Physician": "GP",
      Dermatologist: "DE",
      Pediatrician: "PE",
      Gynecologist: "GY",
      ENT: "EN",
      Orthopedic: "OR",
    };
    const parts = name.replace("Dr.", "").trim().split(" ");
    const initials = `${parts[0]?.[0] ?? "X"}${parts[parts.length - 1]?.[0] ?? "X"}`.toUpperCase();
    const serial = String(index + 1).padStart(4, "0");
    return `DID-${locationCodes[clinicLocation] ?? "CB"}-${specialtyCodes[specialty] ?? "XX"}-${initials}-${serial}`;
  };

  const saveProfiles = async () => {
    setStatus("Saving to Excel database...");
    try {
      const existing = await fetch("/api/doctors").then((res) => res.json());
      const baseDoctors = Array.isArray(existing?.doctors) ? existing.doctors : [];

      const newDoctors = await Promise.all(
        doctors.map(async (doc, index) => {
          const nameParts = doc.name.replace("Dr.", "").trim().split(" ");
          const firstName = nameParts[0] ?? "X";
          const lastName = nameParts[nameParts.length - 1] ?? "X";
          const didRes = await fetch("/api/ids/doctor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: clinicLocation,
              specialty: doc.specialty,
              firstName,
              lastName,
            }),
          });
          const didData = await didRes.json();

          return {
            id: `dr-custom-${Date.now()}-${index}`,
            did: didData?.did ?? generateDidPreview(doc.name, doc.specialty, index),
            name: doc.name || `Doctor ${index + 1}`,
            specialty: doc.specialty,
            clinic: clinicName,
            location: clinicLocation,
            rating: 4.7,
            reviews: 0,
            fee: Number(doc.fee || 0),
            bookingFee: 10,
            languages: ["Bengali", "English"],
            experience: "New",
            telehealth: true,
            about: "Clinic-added doctor profile.",
            slots: [],
            profileImage: "/doctors/dr-sen.svg",
          };
        })
      );

      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctors: [...baseDoctors, ...newDoctors] }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus("Saved. Update the Excel file to see changes across the site.");
    } catch (error) {
      setStatus("Save failed. Please try again.");
    }
  };

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">Step 1</p>
          <h1 className="section-title">Upload doctor profiles</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Add doctor details so patients can find you quickly.
          </p>
        </div>
        <Link className="button-outline" href="/clinic/onboarding">
          Back to checklist
        </Link>
      </div>

      <div className="mt-8 grid gap-6">
        <div className="card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Clinic profile</h2>
            <span className="pill">Demo</span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3" placeholder="Clinic name" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
            <select className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3" value={clinicLocation} onChange={(e) => setClinicLocation(e.target.value)}>
              <option>Cooch Behar Town</option>
              <option>Dinhata</option>
              <option>Tufanganj</option>
              <option>Mathabhanga</option>
              <option>Sitalkuchi</option>
              <option>Mekhliganj</option>
            </select>
            <input className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3" placeholder="Clinic phone" defaultValue="+91 98xxxxxxx" />
            <input className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3" placeholder="Clinic email" defaultValue="clinic@xdoc.in" />
          </div>
        </div>

        <div className="card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Doctor profiles</h2>
            <button className="button-outline" type="button" onClick={addDoctor}>
              Add doctor
            </button>
          </div>
          <div className="mt-4 grid gap-4">
            {doctors.map((doc, index) => (
              <div key={index} className="rounded-2xl border border-[color:var(--stroke)] bg-white p-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <input
                    className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                    placeholder="Doctor name"
                    value={doc.name}
                    onChange={(e) => updateDoctor(index, "name", e.target.value)}
                  />
                  <select
                    className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                    value={doc.specialty}
                    onChange={(e) => updateDoctor(index, "specialty", e.target.value)}
                  >
                    <option>General Physician</option>
                    <option>Dermatologist</option>
                    <option>Pediatrician</option>
                    <option>Gynecologist</option>
                    <option>ENT</option>
                    <option>Orthopedic</option>
                  </select>
                  <input
                    className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                    placeholder="Consultation fee"
                    value={doc.fee}
                    onChange={(e) => updateDoctor(index, "fee", e.target.value)}
                  />
                  <input
                    className="w-full rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3"
                    placeholder="Doctor ID (DID)"
                    value={generateDidPreview(doc.name, doc.specialty, index)}
                    readOnly
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
                  <label className="pill">
                    <input className="mr-2" type="checkbox" defaultChecked /> Telehealth enabled
                  </label>
                  <label className="pill">
                    <input className="mr-2" type="checkbox" defaultChecked /> Accept new patients
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[color:var(--muted)]">
              Demo only. Data is stored in an Excel-friendly CSV file.
            </p>
            <button className="button-primary" type="button" onClick={saveProfiles}>
              Save profiles
            </button>
          </div>
          {status ? (
            <p className="mt-3 text-sm text-[color:var(--muted)]">{status}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
