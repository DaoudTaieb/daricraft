import { kv } from "@vercel/kv";

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
  footer?: {
    description?: string;
    logoUrl?: string;
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
  footer: {
    description: "L'esprit du design, le savoir-faire artisanal. Création de mobilier sur mesure et décoration unique pour votre intérieur.",
    logoUrl: "/daricraft-logo.svg"
  }
};

const SETTINGS_KEY = "daricraft_site_settings";

export async function readSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await kv.get<SiteSettings>(SETTINGS_KEY);
    // Merge with defaults to ensure all fields exist
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...settings,
      contact: { ...DEFAULT_SITE_SETTINGS.contact, ...settings?.contact },
      social: { ...DEFAULT_SITE_SETTINGS.social, ...settings?.social },
      footer: { ...DEFAULT_SITE_SETTINGS.footer, ...settings?.footer }
    };
  } catch (error) {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function writeSiteSettings(next: SiteSettings): Promise<void> {
  await kv.set(SETTINGS_KEY, next);
}
