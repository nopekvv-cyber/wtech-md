"use server";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { z } from "zod";
import {
  publicDb,
  getActor,
  setOwnerSession,
  clearOwnerSession,
  REFRESH_COOKIE,
} from "@/lib/admin-auth";
import { sharedGate } from "@/lib/workspace-db";
export type ActionState = { error?: string; ok?: boolean; at?: string };
export async function login(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  if (!z.string().email().safeParse(email).success || password.length < 8)
    return { error: "Verifică emailul și parola." };
  try {
    const h = await headers();
    const req = new Request("https://wtech.md/admin", { headers: h });
    if (await sharedGate(req, "login"))
      return { error: "Prea multe încercări. Reîncearcă mai târziu." };
    const db = publicDb();
    const { data, error } = await db.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.session) return { error: "Autentificare nereușită." };
    const member = await db
      .from("wtech_members")
      .select("role,active")
      .eq("user_id", data.user.id)
      .single();
    if (!member.data?.active || !["owner", "sales"].includes(member.data.role))
      return { error: "Contul nu are acces la workspace." };
    await setOwnerSession(
      data.session.access_token,
      data.session.refresh_token,
      data.session.expires_in,
    );
  } catch {
    return {
      error:
        "Autentificarea nu este disponibilă. Verifică configurarea contului.",
    };
  }
  redirect("/admin");
}
export async function logout() {
  const actor = await getActor();
  if (actor) {
    const db = publicDb();
    const rt = (await cookies()).get(REFRESH_COOKIE)?.value;
    if (rt) {
      await db.auth.setSession({
        access_token: actor.token,
        refresh_token: rt,
      });
      await db.auth.signOut({ scope: "local" });
    }
  }
  await clearOwnerSession();
  redirect("/admin");
}
