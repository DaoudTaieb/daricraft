"use client";

import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATALOG_TAXONOMY, type CategoryGroup } from "@/lib/catalog";

export default function NewProductPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [group, setGroup] = useState<CategoryGroup>("mobilier");
    const [subKey, setSubKey] = useState<string>(CATALOG_TAXONOMY.mobilier[0]?.items[0]?.key ?? "");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [images, setImages] = useState<Array<{ file: File; url: string }>>([]);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [price, setPrice] = useState<string>("");
    const [description, setDescription] = useState("");
    const [characteristics, setCharacteristics] = useState("");

    const slugify = (v: string) =>
        v
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80);

    const imageCountLabel = useMemo(() => {
        if (images.length === 0) return "Aucune image sélectionnée";
        if (images.length === 1) return "1 image sélectionnée";
        return `${images.length} images sélectionnées`;
    }, [images.length]);

    useEffect(() => {
        return () => {
            // cleanup object URLs
            for (const img of images) URL.revokeObjectURL(img.url);
        };
    }, [images]);

    const addFiles = (files: FileList | File[]) => {
        const list = Array.from(files);
        const onlyImages = list.filter((f) => f.type.startsWith("image/"));
        if (onlyImages.length === 0) return;

        setImages((prev) => {
            // avoid unbounded growth in demo UI
            const next = [...prev];
            for (const f of onlyImages) {
                if (next.length >= 8) break;
                next.push({ file: f, url: URL.createObjectURL(f) });
            }
            return next;
        });
    };

    const removeImageAt = (idx: number) => {
        setImages((prev) => {
            const next = [...prev];
            const removed = next.splice(idx, 1)[0];
            if (removed) URL.revokeObjectURL(removed.url);
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const fd = new FormData();
            fd.append("name", name.trim());
            fd.append("slug", slug.trim());
            fd.append("price", String(price).trim());
            fd.append("description", description.trim());
            fd.append("characteristics", characteristics.trim());
            fd.append("group", group);
            fd.append("subKey", subKey);
            for (const img of images) fd.append("images", img.file);

            const res = await fetch("/api/products", { method: "POST", body: fd });
            const json = await res.json();
            if (!res.ok) {
                setError(json?.error ?? "Erreur lors de l'enregistrement.");
                return;
            }

            // reset form after success
            setName("");
            setSlug("");
            setPrice("");
            setDescription("");
            setCharacteristics("");
            setImages([]);
            alert("Produit enregistré ✅");
        } catch {
            setError("Erreur réseau. Réessayez.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nouveau Produit</h1>
                    <p className="text-muted-foreground">Ajouter une nouvelle référence au catalogue</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl shadow-sm p-8 space-y-8">

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-border pb-2">Informations Générales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nom du produit</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setName(v);
                                    if (!slug) setSlug(slugify(v));
                                }}
                                className="w-full p-2 border border-input rounded-md bg-background"
                                placeholder="Ex: Fauteuil..."
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Slug (URL)</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(slugify(e.target.value))}
                                className="w-full p-2 border border-input rounded-md bg-background"
                                placeholder="Ex: fauteuil-design"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Univers</label>
                            <select
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
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-2 border border-input rounded-md bg-background"
                                placeholder="0.000"
                                step="0.001"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-input rounded-md bg-background"
                            placeholder="Description détaillée..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Caractéristiques</label>
                        <textarea
                            rows={4}
                            value={characteristics}
                            onChange={(e) => setCharacteristics(e.target.value)}
                            className="w-full p-2 border border-input rounded-md bg-background"
                            placeholder={"- Bois massif\n- Finition mate\n- Fabrication sur mesure"}
                        />
                        <p className="text-xs text-muted-foreground">1 ligne = 1 caractéristique (max 24).</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-border pb-2">Images</h3>
                    <input
                        ref={fileInputRef}
                        id="product-images"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files) addFiles(e.target.files);
                            // allow selecting same file again
                            e.target.value = "";
                        }}
                    />

                    <div className="space-y-3">
                        <label
                            htmlFor="product-images"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
                            }}
                            className="block border-2 border-dashed border-border rounded-lg p-10 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                            <p className="text-muted-foreground">
                                Glissez-déposez vos images ici, ou cliquez pour sélectionner depuis votre PC.
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">{imageCountLabel} • Max 8</p>
                        </label>

                        {images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <div key={`${img.file.name}-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                                        <img src={img.url} alt={img.file.name} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImageAt(idx)}
                                            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow"
                                            aria-label="Supprimer l’image"
                                            title="Supprimer"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <Link href="/admin/products" className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium">
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
                    >
                        {isLoading ? "Enregistrement..." : <><Save size={18} /> Enregistrer le produit</>}
                    </button>
                </div>

            </form>
        </div>
    );
}
