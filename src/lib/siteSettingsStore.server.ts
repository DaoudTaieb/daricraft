import { promises as fs } from "fs";
import path from "path";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

export type SiteSettings = {
  contact: {
    addressLine: string;
    phone: string;
    email: string;
  };
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contact: {
    addressLine: "Tunis, Tunisie",
    phone: "+216",
    email: "contact@daricraft.com",
  },
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
};

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_XML = path.join(DATA_DIR, "site-settings.xml");

let settingsCache: { mtimeMs: number; value: SiteSettings } | null = null;

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  parseTagValue: false,
});

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
});

async function exists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function toXml(settings: SiteSettings): string {
  return xmlBuilder.build({
    siteSettings: {
      contact: {
        addressLine: settings.contact.addressLine,
        phone: settings.contact.phone,
        email: settings.contact.email,
      },
      social: {
        instagram: settings.social.instagram,
        facebook: settings.social.facebook,
        linkedin: settings.social.linkedin,
      },
    },
  });
}

function safeString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function fromXml(raw: string): SiteSettings {
  try {
    const parsed = xmlParser.parse(raw) as any;
    const ss = parsed?.siteSettings ?? {};
    const contact = ss?.contact ?? {};
    const social = ss?.social ?? {};
    return {
      contact: {
        addressLine: safeString(contact.addressLine, DEFAULT_SITE_SETTINGS.contact.addressLine).trim(),
        phone: safeString(contact.phone, DEFAULT_SITE_SETTINGS.contact.phone).trim(),
        email: safeString(contact.email, DEFAULT_SITE_SETTINGS.contact.email).trim(),
      },
      social: {
        instagram: safeString(social.instagram, DEFAULT_SITE_SETTINGS.social.instagram).trim(),
        facebook: safeString(social.facebook, DEFAULT_SITE_SETTINGS.social.facebook).trim(),
        linkedin: safeString(social.linkedin, DEFAULT_SITE_SETTINGS.social.linkedin).trim(),
      },
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

async function ensureSettingsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  if (!(await exists(SETTINGS_XML))) {
    await fs.writeFile(SETTINGS_XML, toXml(DEFAULT_SITE_SETTINGS), "utf8");
    const st = await fs.stat(SETTINGS_XML);
    settingsCache = { mtimeMs: st.mtimeMs, value: DEFAULT_SITE_SETTINGS };
  }
}

export async function readSiteSettings(): Promise<SiteSettings> {
  await ensureSettingsFile();
  const st = await fs.stat(SETTINGS_XML);
  if (settingsCache && settingsCache.mtimeMs === st.mtimeMs) return settingsCache.value;
  const raw = await fs.readFile(SETTINGS_XML, "utf8");
  const value = fromXml(raw);
  settingsCache = { mtimeMs: st.mtimeMs, value };
  return value;
}

export async function writeSiteSettings(next: SiteSettings): Promise<void> {
  await ensureSettingsFile();
  await fs.writeFile(SETTINGS_XML, toXml(next), "utf8");
  const st = await fs.stat(SETTINGS_XML);
  settingsCache = { mtimeMs: st.mtimeMs, value: next };
}

