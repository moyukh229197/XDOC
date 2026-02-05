import { NextResponse } from "next/server";
import { generateDoctorId, getNextDoctorSerialPersistent } from "@/lib/doctorStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, specialty, firstName, lastName } = body ?? {};
    if (!location || !specialty || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const serial = getNextDoctorSerialPersistent();
    const did = generateDoctorId({
      location,
      specialty,
      firstName,
      lastName,
      serial,
    });
    return NextResponse.json({ did });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate doctor ID" }, { status: 500 });
  }
}
