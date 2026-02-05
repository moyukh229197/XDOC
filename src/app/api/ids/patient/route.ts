import { NextResponse } from "next/server";
import { generatePatientId, getNextPatientSerialPersistent } from "@/lib/doctorStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, gender, age } = body ?? {};
    if (!location || !gender || !age) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const date = new Date();
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const serial = getNextPatientSerialPersistent(dateKey);
    const pid = generatePatientId({
      location,
      gender,
      age: Number(age),
      date,
      serial,
    });
    return NextResponse.json({ pid });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate patient ID" }, { status: 500 });
  }
}
