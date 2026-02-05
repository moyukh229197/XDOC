import Link from "next/link";

export default function ClinicOnboardingPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Clinic onboarding
          </p>
          <h1 className="section-title">Start accepting bookings</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Follow the steps below to launch your clinic in XDOC.
          </p>
        </div>
        <Link className="button-outline" href="/">
          Back to home
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        <Link className="card" href="/clinic/onboarding/profiles">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">Upload doctor profiles</p>
              <p className="text-sm text-[color:var(--muted)]">Add doctors, specialties, and fees.</p>
            </div>
            <span className="pill">5 mins</span>
          </div>
        </Link>
        <Link className="card" href="/clinic/onboarding/availability">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">Set weekly availability</p>
              <p className="text-sm text-[color:var(--muted)]">Define open slots and holidays.</p>
            </div>
            <span className="pill">10 mins</span>
          </div>
        </Link>
        <Link className="card" href="/clinic/onboarding/payments">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">Enable telehealth + payments</p>
              <p className="text-sm text-[color:var(--muted)]">Configure PhonePe & telehealth.</p>
            </div>
            <span className="pill">8 mins</span>
          </div>
        </Link>
        <Link className="card" href="/clinic/onboarding/launch">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">Launch patient booking</p>
              <p className="text-sm text-[color:var(--muted)]">Publish and start receiving slots.</p>
            </div>
            <span className="pill">Instant</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
