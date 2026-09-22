import "server-only";
import { z } from "zod";

/**
 * Server-side configuration, validated once at import. Secrets never leave this module's callers
 * (route handlers and server modules). Public values live in lib/site.ts (NEXT_PUBLIC_*).
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  TRUST_PROXY: z.enum(["0", "1"]).default("0"),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).max(1000).default(8),
  TELEGRAM_BOT_TOKEN: z.string().regex(/^\d{6,12}:[A-Za-z0-9_-]{30,}$/).optional().or(z.literal("")),
  TELEGRAM_CHAT_ID: z.string().regex(/^-?\d{4,20}$/).optional().or(z.literal("")),
  TELEGRAM_API_BASE: z.string().url().default("https://api.telegram.org"), // overridable for tests only
  SMTP_HOST: z.string().optional().or(z.literal("")),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_USER: z.string().optional().or(z.literal("")),
  SMTP_PASS: z.string().optional().or(z.literal("")),
  SMTP_FROM: z.string().optional().or(z.literal("")),
  LEADS_TO: z.string().email().optional().or(z.literal("")),
  ANTHROPIC_API_KEY: z.string().optional().or(z.literal("")),
  ANTHROPIC_AUTH_TOKEN: z.string().optional().or(z.literal("")),
  VERCEL_OIDC_TOKEN: z.string().optional().or(z.literal("")),
  CHAT_DISABLED: z.enum(["0", "1"]).default("0"),
  ALLOWED_ORIGINS: z.string().optional().or(z.literal("")),
  ADMIN_PASSWORD: z.string().min(8).optional().or(z.literal("")),
  ADMIN_SESSION_SECRET: z.string().min(32).optional().or(z.literal("")),
  SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional().or(z.literal("")),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const lines = parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`Invalid server configuration:\n${lines}`);
}

export const env = parsed.data;
export const telegramConfigured = Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
export const smtpConfigured = Boolean(env.SMTP_HOST && env.LEADS_TO);
export const supabaseConfigured = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
