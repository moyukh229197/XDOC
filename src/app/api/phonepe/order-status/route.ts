import { NextResponse } from "next/server";

function getEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} in environment variables`);
  }
  return value;
}

async function getAccessToken() {
  const authUrl = process.env.PHONEPE_AUTH_URL ?? "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";
  const clientId = getEnv("PHONEPE_CLIENT_ID");
  const clientSecret = getEnv("PHONEPE_CLIENT_SECRET");
  const clientVersion = getEnv("PHONEPE_CLIENT_VERSION");

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    client_version: clientVersion,
    grant_type: "client_credentials",
  });

  const res = await fetch(authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Auth failed: ${text}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Auth failed: missing access token");
  }

  return data.access_token;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const token = await getAccessToken();
    const statusUrl = process.env.PHONEPE_STATUS_URL ?? "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/status";

    const res = await fetch(`${statusUrl}?merchantOrderId=${encodeURIComponent(orderId)}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.message ?? "Status request failed" }, { status: 400 });
    }

    return NextResponse.json({ status: data?.state ?? "UNKNOWN", details: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
