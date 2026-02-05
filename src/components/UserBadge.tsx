"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type UserProfile = {
  name: string;
  gender?: "male" | "female" | "other";
  role?: "patient" | "clinic";
  clinicName?: string;
};

const avatarMap: Record<UserProfile["gender"], { src: string; alt: string }> = {
  male: { src: "/avatars/male.svg", alt: "Male user" },
  female: { src: "/avatars/female.svg", alt: "Female user" },
  other: { src: "/avatars/other.svg", alt: "User" },
};

export default function UserBadge() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("xdoc-user");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as UserProfile;
      if (parsed?.name) setUser(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  if (!user) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-[color:var(--stroke)] bg-white px-3 py-2 text-sm">
        <img
          src="/avatars/other.svg"
          alt="Guest"
          className="h-8 w-8 rounded-full"
        />
        <span>Guest</span>
      </div>
    );
  }

  const avatar = avatarMap[user.gender ?? "other"] ?? avatarMap.other;
  const displayName =
    user.role === "clinic" && user.clinicName ? user.clinicName : user.name;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="flex items-center gap-3 rounded-full border border-[color:var(--stroke)] bg-white px-3 py-2 text-sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img src={avatar.src} alt={avatar.alt} className="h-8 w-8 rounded-full" />
        <span className="font-semibold">{displayName}</span>
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[color:var(--stroke)] bg-white p-2 text-sm shadow-lg z-50">
          <Link className="block rounded-xl px-3 py-2 hover:bg-[color:var(--card)]" href="/profile">
            Profile
          </Link>
          <Link className="block rounded-xl px-3 py-2 hover:bg-[color:var(--card)]" href="/appointments">
            Appointments
          </Link>
          <Link className="block rounded-xl px-3 py-2 hover:bg-[color:var(--card)]" href="/medical-history">
            Medical history
          </Link>
          <button
            type="button"
            className="mt-1 w-full rounded-xl px-3 py-2 text-left hover:bg-[color:var(--card)]"
            onClick={() => {
              window.localStorage.removeItem("xdoc-user");
              setUser(null);
              setOpen(false);
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
