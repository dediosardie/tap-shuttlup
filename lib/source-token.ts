import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

type SourceKind = "tap" | "qr";

type Payload = {
  u: string;
  s: SourceKind;
  iat: number;
};

const TOKEN_TTL_SECONDS = 60 * 60 * 12;

function getSecret(): string | null {
  const secret = process.env.SOURCE_TOKEN_SECRET ?? process.env.NEXTAUTH_SECRET ?? null;
  return secret && secret.length > 16 ? secret : null;
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string): string | null {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function signSegment(segment: string, secret: string): string {
  return createHmac("sha256", secret).update(segment).digest("base64url");
}

export function createSourceToken(username: string, source: SourceKind): string | null {
  const secret = getSecret();
  if (!secret) return null;

  const payload: Payload = {
    u: username.toLowerCase(),
    s: source,
    iat: Math.floor(Date.now() / 1000),
  };

  const segment = encodeBase64Url(JSON.stringify(payload));
  const signature = signSegment(segment, secret);
  return `${segment}.${signature}`;
}

export function verifySourceToken(token: string | null | undefined, username: string, source: SourceKind): boolean {
  const secret = getSecret();
  if (!token || !secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [segment, providedSig] = parts;
  const expectedSig = signSegment(segment, secret);

  const providedBuf = Buffer.from(providedSig);
  const expectedBuf = Buffer.from(expectedSig);
  if (providedBuf.length !== expectedBuf.length) return false;
  if (!timingSafeEqual(providedBuf, expectedBuf)) return false;

  const decoded = decodeBase64Url(segment);
  if (!decoded) return false;

  try {
    const payload = JSON.parse(decoded) as Payload;
    if (!payload || payload.s !== source) return false;
    if (payload.u !== username.toLowerCase()) return false;
    if (!Number.isFinite(payload.iat)) return false;

    const now = Math.floor(Date.now() / 1000);
    if (payload.iat > now + 60) return false;
    if (now - payload.iat > TOKEN_TTL_SECONDS) return false;
    return true;
  } catch {
    return false;
  }
}
