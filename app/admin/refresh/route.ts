import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  publicDb,
  REFRESH_COOKIE,
  setOwnerSession,
  clearOwnerSession,
} from "@/lib/admin-auth";
export async function GET() {
  const token = (await cookies()).get(REFRESH_COOKIE)?.value;
  if (token) {
    try {
      const db = publicDb();
      const { data, error } = await db.auth.refreshSession({
        refresh_token: token,
      });
      if (!error && data.session) {
        const member = await db
          .from("wtech_members")
          .select("active")
          .eq("user_id", data.user!.id)
          .single();
        if (member.data?.active) {
          await setOwnerSession(
            data.session.access_token,
            data.session.refresh_token,
            data.session.expires_in,
          );
          redirect("/admin");
        }
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
    }
  }
  await clearOwnerSession();
  redirect("/admin");
}
