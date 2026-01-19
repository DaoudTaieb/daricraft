import { NextResponse } from "next/server";
import {
  DEFAULT_SITE_SETTINGS,
  readSiteSettings,
  writeSiteSettings,
  type SiteSettings,
} from "@/lib/siteSettingsStore.server";

export const runtime = "nodejs";

function normalizeUrl(v: string) {
  const value = v.trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

export async function GET() {
  const settings = await readSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<SiteSettings> | null;
  if (!body) {
    return NextResponse.json({ error: "Body invalide." }, { status: 400 });
  }

  const next: SiteSettings = {
    contact: {
      addressLine: String(body.contact?.addressLine ?? DEFAULT_SITE_SETTINGS.contact.addressLine).trim(),
      phone: String(body.contact?.phone ?? DEFAULT_SITE_SETTINGS.contact.phone).trim(),
      email: String(body.contact?.email ?? DEFAULT_SITE_SETTINGS.contact.email).trim(),
    },
    social: {
      instagram: normalizeUrl(String(body.social?.instagram ?? "")),
      facebook: normalizeUrl(String(body.social?.facebook ?? "")),
      linkedin: normalizeUrl(String(body.social?.linkedin ?? "")),
    },
  };

  await writeSiteSettings(next);
  return NextResponse.json({ settings: next });
}

