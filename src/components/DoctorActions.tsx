"use client";

import { useState } from "react";

export default function DoctorActions({
  doctorName,
  telehealth,
}: {
  doctorName: string;
  telehealth: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <div className="grid gap-3">
        <button
          className="button-outline"
          onClick={() =>
            setMessage(
              `Added to waitlist for ${doctorName}. We will notify you via SMS and email.`
            )
          }
        >
          Join waitlist
        </button>
        <button
          className="button-outline"
          disabled={!telehealth}
          onClick={() =>
            setMessage(
              telehealth
                ? "Telehealth demo: You will receive a secure video link after booking."
                : "Telehealth is not available for this doctor."
            )
          }
        >
          Start telehealth
        </button>
      </div>
      {message ? (
        <div className="mt-4 rounded-2xl border border-[color:var(--stroke)] bg-white p-4 text-sm text-[color:var(--muted)]">
          {message}
        </div>
      ) : null}
    </div>
  );
}
