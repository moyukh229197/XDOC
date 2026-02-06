 "use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type HistoryItem = {
  id: string;
  pid: string;
  orderId: string;
  amount: string;
  patient: {
    name: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    heightCm: number;
    weightKg: number;
  };
  doctor: string;
  specialty: string;
  clinic: string;
  date: string;
  notes: string[];
  tests: string[];
  medicines: { name: string; dosage: string; duration: string }[];
};

const demoHistory: HistoryItem[] = [
  {
    id: "visit-1",
    pid: "PID-CB-F-27-220126-0004",
    orderId: "XDOC-ORD-220126-8452",
    amount: "₹510",
    patient: {
      name: "Moyukh Roy",
      age: 27,
      gender: "Male",
      heightCm: 172,
      weightKg: 68,
    },
    doctor: "Dr. Ananya Sen",
    specialty: "General Physician",
    clinic: "Cooch Behar City Clinic",
    date: "Jan 22, 2026",
    notes: ["BP stable", "Advised hydration + rest"],
    tests: ["CBC", "Blood sugar (fasting)"],
    medicines: [
      { name: "Paracetamol", dosage: "500 mg • 2 times/day", duration: "3 days" },
      { name: "ORS", dosage: "1 sachet/day", duration: "3 days" },
    ],
  },
  {
    id: "visit-2",
    pid: "PID-DI-F-31-081225-0002",
    orderId: "XDOC-ORD-081225-3198",
    amount: "₹610",
    patient: {
      name: "Moyukh Roy",
      age: 27,
      gender: "Male",
      heightCm: 172,
      weightKg: 68,
    },
    doctor: "Dr. Riya Basak",
    specialty: "Dermatologist",
    clinic: "North Bengal Skin Studio",
    date: "Dec 08, 2025",
    notes: ["Mild dermatitis", "Avoid harsh soaps"],
    tests: ["Allergy panel"],
    medicines: [
      { name: "Cetirizine", dosage: "10 mg • at night", duration: "7 days" },
      { name: "Moisturizer", dosage: "Apply twice daily", duration: "2 weeks" },
    ],
  },
  {
    id: "visit-3",
    pid: "PID-TU-M-19-151125-0006",
    orderId: "XDOC-ORD-151125-5520",
    amount: "₹510",
    patient: {
      name: "Moyukh Roy",
      age: 27,
      gender: "Male",
      heightCm: 172,
      weightKg: 68,
    },
    doctor: "Dr. Arup Roy",
    specialty: "ENT",
    clinic: "Little Steps Children Care",
    date: "Nov 15, 2025",
    notes: ["Throat inflammation", "Steam inhalation recommended"],
    tests: ["Throat swab"],
    medicines: [
      { name: "Azithromycin", dosage: "500 mg • once daily", duration: "5 days" },
      { name: "Warm saline gargle", dosage: "3 times/day", duration: "1 week" },
    ],
  },
];

export default function MedicalHistoryPage() {
  const [selectedId, setSelectedId] = useState(demoHistory[0]?.id ?? "");
  const [uploads, setUploads] = useState<File[]>([]);
  const [userRole, setUserRole] = useState<"patient" | "clinic" | "guest">("guest");

  useEffect(() => {
    const raw = window.localStorage.getItem("xdoc-user");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { role?: "patient" | "clinic" };
      setUserRole(parsed?.role ?? "guest");
    } catch {
      setUserRole("guest");
    }
  }, []);

  const selected = useMemo(
    () => demoHistory.find((item) => item.id === selectedId) ?? demoHistory[0],
    [selectedId]
  );

  if (userRole === "clinic") {
    return (
      <div className="container py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
              Medical history
            </p>
            <h1 className="section-title">Patient history access</h1>
          </div>
          <Link className="button-outline" href="/">
            Back to home
          </Link>
        </div>
        <div className="mt-8 card">
          <p className="text-sm text-[color:var(--muted)]">
            Clinic accounts can review patient history after a consultation. Please switch to
            a patient account to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">Medical history</p>
          <h1 className="section-title">Your medical history</h1>
        </div>
        <Link className="button-outline" href="/">Back to home</Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card">
          <h2 className="text-xl font-semibold">Previous appointments</h2>
          <div className="mt-4 grid gap-4">
            {demoHistory.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedId === item.id
                    ? "border-transparent bg-[color:var(--accent-3)] text-white"
                    : "border-[color:var(--stroke)] bg-white"
                }`}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{item.doctor}</p>
                    <p className="text-sm opacity-80">{item.specialty}</p>
                  </div>
                  <span className="text-xs opacity-80">{item.date}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs opacity-80">
                  <span>{item.clinic}</span>
                  <span>Last amount: {item.amount}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold">Visit details</h2>
          {selected ? (
            <div className="mt-4 grid gap-4 text-sm">
              <div className="grid gap-2 rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3 text-[color:var(--muted)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>Patient ID</span>
                  <span className="font-semibold text-[color:var(--ink)]">{selected.pid}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>Order ID</span>
                  <span className="font-semibold text-[color:var(--ink)]">{selected.orderId}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>Last booking amount</span>
                  <span className="font-semibold text-[color:var(--ink)]">{selected.amount}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[color:var(--stroke)] bg-white px-4 py-3">
                <img
                  src="/avatars/male.svg"
                  alt="Patient profile"
                  className="h-12 w-12 rounded-full border border-[color:var(--stroke)] bg-[color:var(--card)]"
                />
                <div className="flex-1 text-[color:var(--muted)]">
                  <p className="font-semibold text-[color:var(--ink)]">
                    {selected.patient.name}
                  </p>
                  <p className="text-xs">
                    {selected.patient.gender} • {selected.patient.age} yrs
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-[color:var(--muted)]">
                  <span className="pill">{selected.patient.heightCm} cm</span>
                  <span className="pill">{selected.patient.weightKg} kg</span>
                </div>
              </div>
              <div>
                <p className="font-semibold">Doctor notes</p>
                <div className="mt-2 grid gap-2 text-[color:var(--muted)]">
                  {selected.notes.map((note) => (
                    <div key={note} className="rounded-xl border border-[color:var(--stroke)] bg-white px-3 py-2">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">Tests prescribed</p>
                <div className="mt-2 grid gap-2 text-[color:var(--muted)]">
                  {selected.tests.map((test) => (
                    <div key={test} className="rounded-xl border border-[color:var(--stroke)] bg-white px-3 py-2">
                      {test}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">Medicines + dosage</p>
                <div className="mt-2 grid gap-2 text-[color:var(--muted)]">
                  {selected.medicines.map((medicine) => (
                    <div
                      key={medicine.name}
                      className="rounded-xl border border-[color:var(--stroke)] bg-white px-3 py-2"
                    >
                      <p className="font-semibold">{medicine.name}</p>
                      <p className="text-xs">{medicine.dosage}</p>
                      <p className="text-xs">{medicine.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">Upload test documents</p>
                <div className="mt-2 rounded-2xl border border-dashed border-[color:var(--stroke)] bg-white px-6 py-6 text-center text-[color:var(--muted)]">
                  <input
                    id="history-documents"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length) {
                        setUploads((prev) => [...prev, ...files]);
                      }
                    }}
                  />
                  <p>Drag & drop reports here</p>
                  <label
                    htmlFor="history-documents"
                    className="button-outline mt-4 inline-flex cursor-pointer"
                  >
                    Upload documents
                  </label>
                </div>
                {uploads.length ? (
                  <div className="mt-3 grid gap-2 text-xs text-[color:var(--muted)]">
                    {uploads.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="rounded-xl border border-[color:var(--stroke)] bg-white px-3 py-2">
                        {file.name}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[color:var(--muted)]">
              Select an appointment to see visit details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
