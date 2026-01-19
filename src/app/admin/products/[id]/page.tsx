"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { CATALOG_TAXONOMY, type CategoryGroup } from "@/lib/catalog";

type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  characteristics?: string[];
  price: number;
  categoryGroup: CategoryGroup;
  subKey: string;
  subLabel: string;
  images: string[];
};

export default function AdminEditProductPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [characteristics, setCharacteristics] = useState("");
  const [price, setPrice] = useState<string>("");
  const [group, setGroup] = useState<CategoryGroup>("mobilier");
  const [subKey, setSubKey] = useState<string>(CATALOG_TAXONOMY.mobilier[0]?.items[0]?.key ?? "");
  const [images, setImages] = useState<string[]>([]);

  const title = useMemo(() => (name ? `Éditer: ${name}` : "Éditer produit"), [name]);

  useEffect(() => {
    let active = true;
    (async () => {
      const resolved = await Promise.resolve(params);
      try {
        const res = await fetch(`/api/products/id/${encodeURIComponent(resolved.id)}`, { cache: "no-store" });
        const json = await res.json();
        if (!active) return;
        if (!res.ok) {
          setError(json?.error ?? "Produit introuvable.");
          return;
        }
        const p = json.product as ProductDTO;
        setId(p.id);
        setName(p.name);
        setSlug(p.slug);
        setDescription(p.description);
        setCharacteristics(Array.isArray(p.characteristics) ? p.characteristics.join("\n") : "");
        setPrice(String(p.price));
        setGroup(p.categoryGroup);
        setSubKey(p.subKey);
        setImages(Array.isArray(p.images) ? p.images : []);
      } catch {
        if (active) setError("Erreur réseau.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/products/id/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          characteristics: characteristics,
          price: Number(price),
          categoryGroup: group,
          subKey,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Erreur lors de l'enregistrement.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-muted rounded-full transition-colors" aria-label="Retour">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">Modifiez les informations du produit.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSave} className="bg-card border border-border rounded-xl shadow-sm p-8 space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-border pb-2">Informations Générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom du produit</label>
              <input
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL)</label>
              <input
                disabled={loading}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Univers</label>
              <select
                disabled={loading}
                className="w-full p-2 border border-input rounded-md bg-background"
                value={group}
                onChange={(e) => {
                  const next = e.target.value as CategoryGroup;
                  setGroup(next);
                  const first = CATALOG_TAXONOMY[next]?.[0]?.items?.[0]?.key ?? "";
                  setSubKey(first);
                }}
              >
                <option value="mobilier">Mobilier</option>
                <option value="decoration">Décoration</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <select
                disabled={loading}
                className="w-full p-2 border border-input rounded-md bg-background"
                value={subKey}
                onChange={(e) => setSubKey(e.target.value)}
              >
                {CATALOG_TAXONOMY[group]?.map((section) => (
                  <optgroup key={section.key} label={section.title}>
                    {section.items.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prix (TND)</label>
              <input
                disabled={loading}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                step="0.001"
                min="0"
                className="w-full p-2 border border-input rounded-md bg-background"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              disabled={loading}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-2 border border-input rounded-md bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Caractéristiques</label>
            <textarea
              disabled={loading}
              value={characteristics}
              onChange={(e) => setCharacteristics(e.target.value)}
              rows={4}
              className="w-full p-2 border border-input rounded-md bg-background"
              placeholder={"- Bois massif\n- Finition mate\n- Fabrication sur mesure"}
            />
            <p className="text-xs text-muted-foreground">1 ligne = 1 caractéristique (max 24).</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold border-b border-border pb-2">Images</h3>
          <p className="text-sm text-muted-foreground">
            Pour l’instant, l’édition des images est en lecture seule (les images existantes restent).
          </p>
          {images.length === 0 ? (
            <div className="text-sm text-muted-foreground">Aucune image.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.slice(0, 8).map((src) => (
                <div key={src} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <Link href="/admin/products" className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium">
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading || saving}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

