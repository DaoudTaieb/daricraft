"use client";

import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatTND } from "@/lib/money";
import { useEffect, useMemo, useState } from "react";
import type { StoredProduct } from "@/lib/productStore.server";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<StoredProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);

    const refresh = async () => {
        const res = await fetch("/api/products", { cache: "no-store" });
        const json = await res.json();
        setProducts(Array.isArray(json?.products) ? json.products : []);
    };

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch("/api/products", { cache: "no-store" });
                const json = await res.json();
                if (!active) return;
                setProducts(Array.isArray(json?.products) ? json.products : []);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const rows = useMemo(() => products, [products]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
                    <p className="text-muted-foreground">Gérez votre catalogue</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Nouveau Produit
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-medium text-muted-foreground">Nom</th>
                            <th className="p-4 font-medium text-muted-foreground">Catégorie</th>
                            <th className="p-4 font-medium text-muted-foreground">Prix</th>
                            <th className="p-4 font-medium text-muted-foreground">Images</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td className="p-4 text-muted-foreground" colSpan={5}>
                                    Chargement…
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td className="p-4 text-muted-foreground" colSpan={5}>
                                    Aucun produit enregistré pour le moment.
                                </td>
                            </tr>
                        ) : (
                            rows.map((product) => (
                                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="p-4 font-medium">{product.name}</td>
                                    <td className="p-4">{product.subLabel}</td>
                                    <td className="p-4">{formatTND(product.price)}</td>
                                    <td className="p-4">{product.images?.length ?? 0}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${encodeURIComponent(product.id)}`}
                                                className="p-2 hover:bg-muted rounded-md transition-colors text-blue-600 inline-flex"
                                                title="Éditer"
                                                aria-label={`Éditer ${product.name}`}
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                className="p-2 hover:bg-muted rounded-md transition-colors text-red-600 disabled:opacity-50"
                                                title="Supprimer"
                                                disabled={busyId === product.id}
                                                onClick={async () => {
                                                    const ok = window.confirm(`Supprimer “${product.name}” ?`);
                                                    if (!ok) return;
                                                    setBusyId(product.id);
                                                    try {
                                                        const res = await fetch(`/api/products/id/${product.id}`, { method: "DELETE" });
                                                        const json = await res.json().catch(() => ({}));
                                                        if (!res.ok) {
                                                            window.alert(json?.error ?? "Erreur lors de la suppression.");
                                                            return;
                                                        }
                                                        await refresh();
                                                    } finally {
                                                        setBusyId(null);
                                                    }
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
