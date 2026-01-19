"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, RotateCcw } from "lucide-react";
import type { SiteSettings } from "@/lib/siteSettingsStore.server";

function normalizeUrl(v: string) {
  const value = v.trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<SiteSettings>({
    contact: { addressLine: "", phone: "", email: "" },
    social: { instagram: "", facebook: "", linkedin: "" },
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (!active) return;
        setDraft(json.settings);
        setIsLoaded(true);
      } catch {
        if (!active) return;
        setError("Impossible de charger les paramètres.");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setError(null);

    const next: SiteSettings = {
      contact: {
        addressLine: draft.contact.addressLine.trim(),
        phone: draft.contact.phone.trim(),
        email: draft.contact.email.trim(),
      },
      social: {
        instagram: normalizeUrl(draft.social.instagram ?? ""),
        facebook: normalizeUrl(draft.social.facebook ?? ""),
        linkedin: normalizeUrl(draft.social.linkedin ?? ""),
      },
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Erreur lors de l'enregistrement.");
        return;
      }
      setDraft(json.settings);
      setSaved(true);
      router.refresh(); // refresh footer (server component)
      window.setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Erreur réseau.");
    }
  };

  const onReset = async () => {
    setSaved(false);
    setError(null);
    // reset by writing empty -> API will apply defaults
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: { addressLine: "", phone: "", email: "" },
          social: { instagram: "", facebook: "", linkedin: "" },
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Erreur lors de la réinitialisation.");
        return;
      }
      setDraft(json.settings);
      router.refresh();
    } catch {
      setError("Erreur réseau.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">Modifiez les informations visibles dans le footer.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
          >
            <RotateCcw size={16} />
            Réinitialiser
          </button>
          <button
            type="submit"
            form="settings-form"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Save size={16} />
            Enregistrer
          </button>
        </div>
      </div>

      {saved && (
        <div className="rounded-xl border border-green-200 bg-green-50 text-green-800 px-4 py-3 text-sm">
          Paramètres enregistrés.
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form id="settings-form" onSubmit={onSubmit} className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8 space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Adresse</label>
              <input
                disabled={!isLoaded}
                value={draft.contact.addressLine}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, contact: { ...s.contact, addressLine: e.target.value } }))
                }
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Ex: Tunis, Tunisie"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <input
                disabled={!isLoaded}
                value={draft.contact.phone}
                onChange={(e) => setDraft((s) => ({ ...s, contact: { ...s.contact, phone: e.target.value } }))}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="+216 ..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                disabled={!isLoaded}
                value={draft.contact.email}
                onChange={(e) => setDraft((s) => ({ ...s, contact: { ...s.contact, email: e.target.value } }))}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="contact@daricraft.com"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Réseaux sociaux</h2>
          <p className="text-sm text-muted-foreground">
            Ajoutez les liens (ex: `instagram.com/votrepage`). On ajoute automatiquement `https://` si besoin.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Instagram</label>
              <input
                disabled={!isLoaded}
                value={draft.social.instagram ?? ""}
                onChange={(e) => setDraft((s) => ({ ...s, social: { ...s.social, instagram: e.target.value } }))}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Facebook</label>
              <input
                disabled={!isLoaded}
                value={draft.social.facebook ?? ""}
                onChange={(e) => setDraft((s) => ({ ...s, social: { ...s.social, facebook: e.target.value } }))}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn</label>
              <input
                disabled={!isLoaded}
                value={draft.social.linkedin ?? ""}
                onChange={(e) => setDraft((s) => ({ ...s, social: { ...s.social, linkedin: e.target.value } }))}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="linkedin.com/company/..."
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

