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

export async function POST(request: Request) {
  try {
    const { doctorId, slot, amount } = await request.json();
    const token = await getAccessToken();

    const origin = request.headers.get("origin") ?? "http://localhost:3000";
    const merchantOrderId = `XDOC-${Date.now()}`;
    const amountPaise = Math.round(Number(amount) * 100);

    const payUrl = process.env.PHONEPE_PAY_URL ?? "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";

    const payload = {
      merchantOrderId,
      amount: amountPaise,
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "XDOC booking fee",
        merchantUrls: {
          redirectUrl: `${origin}/payment/return?orderId=${merchantOrderId}`,
        },
      },
      metaInfo: {
        udf1: doctorId ?? "",
        udf2: slot ?? "",
      },
    };

    const res = await fetch(payUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.message ?? "Payment request failed" }, { status: 400 });
    }

    return NextResponse.json({ redirectUrl: data?.redirectUrl, orderId: merchantOrderId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
