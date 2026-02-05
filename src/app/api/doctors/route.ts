import { NextResponse } from "next/server";
import { readDoctorsFromCsv, writeDoctorsToCsv } from "@/lib/doctorStore";

export async function GET() {
  try {
    const doctors = readDoctorsFromCsv();
    return NextResponse.json({ doctors });
  } catch (error) {
    return NextResponse.json({ doctors: [], error: "Failed to read doctors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body?.doctors)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    writeDoctorsToCsv(body.doctors);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save doctors" }, { status: 500 });
  }
}
