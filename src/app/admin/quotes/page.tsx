"use client";

import { Eye, Mail, Phone, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import type { StoredQuote } from "@/lib/quotesStore.server";

export default function AdminQuotesPage() {
    const [quotes, setQuotes] = useState<StoredQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<StoredQuote | null>(null);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch("/api/quotes");
                const json = await res.json();
                if (!active) return;
                setQuotes(Array.isArray(json?.quotes) ? json.quotes : []);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold"><Clock size={12} /> En attente</span>;
            case 'CONTACTED': return <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold"><Mail size={12} /> Contacté</span>;
            case 'COMPLETED': return <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={12} /> Traité</span>;
            default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Devis & Demandes</h1>
                <p className="text-muted-foreground">Suivi des projets clients</p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-medium text-muted-foreground">Client</th>
                            <th className="p-4 font-medium text-muted-foreground">Projet / Type</th>
                            <th className="p-4 font-medium text-muted-foreground">Date</th>
                            <th className="p-4 font-medium text-muted-foreground">Status</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td className="p-4 text-muted-foreground" colSpan={5}>Chargement…</td>
                            </tr>
                        ) : quotes.length === 0 ? (
                            <tr>
                                <td className="p-4 text-muted-foreground" colSpan={5}>Aucune demande pour le moment.</td>
                            </tr>
                        ) : (
                            quotes.map((quote) => (
                                <tr key={quote.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium">{quote.name}</div>
                                        <div className="text-xs text-muted-foreground flex flex-col gap-1 mt-1">
                                            <span className="flex items-center gap-1"><Mail size={10} /> {quote.email}</span>
                                            {quote.phone && <span className="flex items-center gap-1"><Phone size={10} /> {quote.phone}</span>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium">
                                            {quote.productSlug ? `Produit: ${quote.productSlug}` : quote.type}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[260px]" title={quote.details}>
                                            {quote.details}
                                        </div>
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {new Date(quote.createdAt).toLocaleString("fr-FR")}
                                    </td>
                                    <td className="p-4">{getStatusBadge(quote.status)}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                            title="Voir détails"
                                            onClick={() => setSelected(quote)}
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>
            </div>

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                    <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-xl p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold">Détails de la demande</h2>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(selected.createdAt).toLocaleString("fr-FR")}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-sm"
                                onClick={() => setSelected(null)}
                            >
                                Fermer
                            </button>
                        </div>

                        <div className="mt-5 space-y-3 text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="rounded-xl bg-muted/40 p-3">
                                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Client</div>
                                    <div className="font-semibold">{selected.name}</div>
                                    <div className="text-muted-foreground">{selected.email}</div>
                                    {selected.phone && <div className="text-muted-foreground">{selected.phone}</div>}
                                </div>
                                <div className="rounded-xl bg-muted/40 p-3">
                                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Type</div>
                                    <div className="font-semibold">
                                        {selected.productSlug ? `Produit: ${selected.productSlug}` : selected.type}
                                    </div>
                                    <div className="mt-2">{getStatusBadge(selected.status)}</div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-muted/40 p-3">
                                <div className="text-xs uppercase tracking-wider text-muted-foreground">Détails</div>
                                <p className="mt-2 whitespace-pre-wrap leading-relaxed">{selected.details}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
