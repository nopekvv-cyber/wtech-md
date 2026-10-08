import { redirect } from "next/navigation";
export default function Leads() {
  redirect("/admin?view=inbox");
}
