"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthLink() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem("xdoc-user");
    setShow(!raw);
  }, []);

  if (!show) return null;

  return (
    <Link className="pill" href="/auth">
      Login / Signup
    </Link>
  );
}
