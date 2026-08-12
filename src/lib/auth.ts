import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "ctn_session";
/** Default password assigned on self-registration; user must change it on first login. */
export const DEFAULT_MEMBER_PASSWORD = "123456789";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const BCRYPT_COST = 12;

export type MemberRole = "member" | "admin";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export interface SessionPayload {
  memberId: string;
  role: MemberRole;
  mustChangePassword: boolean;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET env var");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    role: payload.role,
    mustChangePassword: payload.mustChangePassword,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.memberId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string") return null;
    const role = payload.role;
    if (role !== "member" && role !== "admin") return null;
    if (typeof payload.mustChangePassword !== "boolean") return null;
    return {
      memberId: payload.sub,
      role,
      mustChangePassword: payload.mustChangePassword,
    };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
