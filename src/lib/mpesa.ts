const MPESA_ENV = process.env.MPESA_ENV ?? "sandbox";
export const MPESA_BASE =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const PASSKEY = process.env.MPESA_PASSKEY!;

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get OAuth token from Daraja and cache it in memory.
 */
export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt)
    return cachedToken.token;

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString(
    "base64"
  );
  const url = `${MPESA_BASE}/oauth/v1/generate?grant_type=client_credentials`;

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Mpesa token error: ${res.status} ${txt}`);
  }

  const json = await res.json();
  const expiresIn = Number(json.expires_in ?? 3600);
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + (expiresIn - 60) * 1000,
  };

  return cachedToken.token;
}

/** Return timestamp YYYYMMDDHHmmss (UTC) */
export function getTimestamp(): string {
  const d = new Date();
  const YYYY = d.getUTCFullYear();
  const MM = String(d.getUTCMonth() + 1).padStart(2, "0");
  const DD = String(d.getUTCDate()).padStart(2, "0");
  const HH = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${YYYY}${MM}${DD}${HH}${mm}${ss}`;
}

/** Build Daraja password and timestamp */
export function getPassword() {
  const timestamp = getTimestamp();
  const raw = `${SHORTCODE}${PASSKEY}${timestamp}`;
  const password = Buffer.from(raw).toString("base64");
  return { password, timestamp };
}

/** Normalize phone -> 2547XXXXXXXX (no +) */
export function normalizePhone(input: string) {
  const digits = (input || "").replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0"))
    return `254${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith("7")) return `254${digits}`;
  if (digits.length === 12 && digits.startsWith("254")) return digits;
  // fallback - return digits
  return digits;
}
