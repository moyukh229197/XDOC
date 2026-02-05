import Link from "next/link";

export default function MedicalHistoryPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">Medical history</p>
          <h1 className="section-title">Your medical history</h1>
        </div>
        <Link className="button-outline" href="/">Back to home</Link>
      </div>

      <div className="mt-8 grid gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold">History summary</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Demo medical history page. Add reports, prescriptions, and test results here.
          </p>
        </div>
      </div>
    </div>
  );
}
