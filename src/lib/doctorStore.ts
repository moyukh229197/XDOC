import fs from "fs";
import path from "path";
import type { Doctor } from "@/lib/data";

const DATA_PATH = path.join(process.cwd(), "data", "doctors.csv");
const SERIALS_PATH = path.join(process.cwd(), "data", "serials.json");

const subdivisionCodes: Record<string, string> = {
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

export function generateDoctorId(params: {
  location: string;
  specialty: string;
  firstName: string;
  lastName: string;
  serial: number;
}) {
  const subdivision = subdivisionCodes[params.location] ?? "CB";
  const specialty = specialtyCodes[params.specialty] ?? "XX";
  const initials = `${params.firstName?.[0] ?? "X"}${params.lastName?.[0] ?? "X"}`;
  const serial = String(params.serial).padStart(4, "0");
  return `DID-${subdivision}-${specialty}-${initials.toUpperCase()}-${serial}`;
}

export function generatePatientId(params: {
  location: string;
  gender: "M" | "F" | "O";
  age: number;
  date: Date;
  serial: number;
}) {
  const subdivision = subdivisionCodes[params.location] ?? "CB";
  const dd = String(params.date.getDate()).padStart(2, "0");
  const mm = String(params.date.getMonth() + 1).padStart(2, "0");
  const yy = String(params.date.getFullYear()).slice(-2);
  const serial = String(params.serial).padStart(4, "0");
  return `PID-${subdivision}-${params.gender}-${params.age}-${dd}${mm}${yy}-${serial}`;
}

type SerialsStore = {
  patient: Record<string, number>;
  doctor: number;
};

function readSerials(): SerialsStore {
  if (!fs.existsSync(SERIALS_PATH)) {
    return { patient: {}, doctor: 0 };
  }
  try {
    return JSON.parse(fs.readFileSync(SERIALS_PATH, "utf8"));
  } catch {
    return { patient: {}, doctor: 0 };
  }
}

function writeSerials(store: SerialsStore) {
  fs.writeFileSync(SERIALS_PATH, JSON.stringify(store, null, 2));
}

export function getNextDoctorSerialPersistent() {
  const store = readSerials();
  store.doctor += 1;
  writeSerials(store);
  return store.doctor;
}

export function getNextPatientSerialPersistent(dateKey: string) {
  const store = readSerials();
  const current = store.patient[dateKey] ?? 0;
  store.patient[dateKey] = current + 1;
  writeSerials(store);
  return store.patient[dateKey];
}

function parseCsvRow(row: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i += 1) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

export function readDoctorsFromCsv(): Doctor[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  const content = fs.readFileSync(DATA_PATH, "utf8");
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length <= 1) return [];
  const rows = lines.slice(1);

  return rows.map((row) => {
    const values = parseCsvRow(row).map((value) => value.replace(/^"|"$/g, ""));
    const [
      id,
      did,
      name,
      specialty,
      clinic,
      location,
      rating,
      reviews,
      fee,
      bookingFee,
      languages,
      experience,
      telehealth,
      about,
      slots,
      profileImage,
    ] = values;

    return {
      id,
      name,
      specialty,
      clinic,
      location,
      rating: Number(rating),
      reviews: Number(reviews),
      fee: Number(fee),
      bookingFee: Number(bookingFee),
      languages: languages ? languages.split("|") : [],
      experience,
      telehealth: telehealth === "true",
      about,
      slots: slots ? JSON.parse(slots) : [],
      profileImage,
      did,
    } as Doctor & { did: string };
  });
}

export function writeDoctorsToCsv(doctors: (Doctor & { did?: string })[]) {
  const header = [
    "id",
    "did",
    "name",
    "specialty",
    "clinic",
    "location",
    "rating",
    "reviews",
    "fee",
    "bookingFee",
    "languages",
    "experience",
    "telehealth",
    "about",
    "slots",
    "profileImage",
  ].join(",");

  const rows = doctors.map((doctor) => {
    const values = [
      doctor.id,
      doctor.did ?? "",
      doctor.name,
      doctor.specialty,
      doctor.clinic,
      doctor.location,
      doctor.rating,
      doctor.reviews,
      doctor.fee,
      doctor.bookingFee,
      (doctor.languages ?? []).join("|"),
      doctor.experience,
      String(doctor.telehealth),
      doctor.about ?? "",
      JSON.stringify(doctor.slots ?? []).replace(/"/g, '""'),
      doctor.profileImage ?? "",
    ];
    return values.map((value) => `"${String(value)}"`).join(",");
  });

  fs.writeFileSync(DATA_PATH, [header, ...rows].join("\n"));
}

export function getNextDoctorSerial(doctors: (Doctor & { did?: string })[]) {
  const serials = doctors
    .map((doctor) => doctor.did)
    .filter(Boolean)
    .map((did) => Number(String(did).split("-").slice(-1)[0]))
    .filter((val) => !Number.isNaN(val));
  return serials.length ? Math.max(...serials) + 1 : 1;
}
