"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Package, FileText, Users, TrendingUp } from "lucide-react";
import { formatTND } from "@/lib/money";
import type { StoredProduct } from "@/lib/productStore.server";
import type { StoredQuote } from "@/lib/quotesStore.server";

export default function AdminDashboard() {
    const [products, setProducts] = useState<StoredProduct[]>([]);
    const [quotes, setQuotes] = useState<StoredQuote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const [pRes, qRes] = await Promise.all([
                    fetch("/api/products", { cache: "no-store" }),
                    fetch("/api/quotes", { cache: "no-store" }),
                ]);
                const [pJson, qJson] = await Promise.all([pRes.json(), qRes.json()]);
                if (!active) return;
                setProducts(Array.isArray(pJson?.products) ? pJson.products : []);
                setQuotes(Array.isArray(qJson?.quotes) ? qJson.quotes : []);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const pendingQuotesCount = useMemo(
        () => quotes.filter((q) => q.status === "PENDING").length,
        [quotes]
    );
    const revenueEstimate = useMemo(
        () => products.reduce((sum, p) => sum + (Number.isFinite(p.price) ? p.price : 0), 0),
        [products]
    );

    const stats = useMemo(
        () => [
            { name: "Total Produits", value: String(products.length), icon: Package, change: "", color: "text-blue-600", bg: "bg-blue-50" },
            { name: "Devis En Attente", value: String(pendingQuotesCount), icon: FileText, change: "", color: "text-orange-600", bg: "bg-orange-50" },
            { name: "Visiteurs (Mois)", value: "—", icon: Users, change: "", color: "text-purple-600", bg: "bg-purple-50" },
            { name: "Revenu Estimé", value: formatTND(revenueEstimate), icon: TrendingUp, change: "", color: "text-green-600", bg: "bg-green-50" },
        ],
        [products.length, pendingQuotesCount, revenueEstimate]
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
                <p className="text-muted-foreground">Vue d&apos;ensemble de votre activité.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            {stat.change ? (
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    {loading ? "…" : ""}
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <p className="text-sm text-muted-foreground">{stat.name}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="font-bold mb-4">Derniers Devis</h3>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-sm text-muted-foreground">Chargement…</div>
                        ) : quotes.length === 0 ? (
                            <div className="text-sm text-muted-foreground">Aucune demande pour le moment.</div>
                        ) : (
                            quotes.slice(0, 3).map((q) => (
                                <div key={q.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div>
                                        <p className="font-medium text-sm">{q.productSlug ? `Produit: ${q.productSlug}` : q.type}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(q.createdAt).toLocaleString("fr-FR")} • {q.name}
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                        {q.status === "PENDING" ? "En attente" : q.status === "CONTACTED" ? "Contacté" : "Traité"}
                                    </span>
                                </div>
                            ))
                        )}
                        <div className="pt-2">
                            <Link href="/admin/quotes" className="text-sm font-medium text-secondary hover:underline underline-offset-4">
                                Voir tout
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="font-bold mb-4">Produits Populaires</h3>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-sm text-muted-foreground">Chargement…</div>
                        ) : products.length === 0 ? (
                            <div className="text-sm text-muted-foreground">Aucun produit enregistré.</div>
                        ) : (
                            products.slice(0, 3).map((p) => (
                                <div key={p.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                                            {p.images?.[0] ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                            ) : null}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{p.name}</p>
                                            <p className="text-xs text-muted-foreground">{p.subLabel}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold">{formatTND(p.price)}</span>
                                </div>
                            ))
                        )}
                        <div className="pt-2">
                            <Link href="/admin/products" className="text-sm font-medium text-secondary hover:underline underline-offset-4">
                                Voir tout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
