"use client";
import { useTranslations } from "next-intl";
export function ContactPreference({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("contact");
  return (
    <div>
      <label className="label" htmlFor={`${id}-channel`}>
        {t("preferredChannel")}
      </label>
      <select
        id={`${id}-channel`}
        className="field"
        name="channel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="phone">{t("phoneChannel")}</option>
        <option value="email">Email</option>
        <option value="whatsapp">WhatsApp</option>
      </select>
    </div>
  );
}
