import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { publicDb, userDb } from "./workspace-db";
import type { Role } from "./workspace-types";
export const COOKIE = "wtech_owner_access";
export const REFRESH_COOKIE = "wtech_owner_refresh";
export const getActor = cache(async () => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const db = userDb(token);
    const { data, error } = await db.auth.getUser(token);
    if (error || !data.user) return null;
    const permission = await db.from("wtech_records").select("id").limit(1);
    if (permission.error) return null;
    const membership = await db
      .from("wtech_members")
      .select("role,active")
      .eq("user_id", data.user.id)
      .single();
    if (membership.error || !membership.data?.active) return null;
    return {
      id: data.user.id,
      email: data.user.email,
      role: membership.data.role as Role,
      db,
      token,
    };
  } catch {
    return null;
  }
});
export async function isAdmin() {
  return (await getActor())?.role === "owner";
}
export async function setOwnerSession(
  access: string,
  refresh: string,
  expires: number,
) {
  const jar = await cookies();
  const options = {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
  };
  jar.set(COOKIE, access, { ...options, maxAge: expires });
  jar.set(REFRESH_COOKIE, refresh, { ...options, maxAge: 8 * 3600 });
}
export async function clearOwnerSession() {
  const jar = await cookies();
  for (const name of [COOKIE, REFRESH_COOKIE])
    jar.delete({ name, path: "/admin" });
}
export { publicDb };
