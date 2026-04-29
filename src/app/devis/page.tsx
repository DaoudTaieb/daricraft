"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { formatTND } from "@/lib/money";

function DevisForm() {
    const searchParams = useSearchParams();
    const productRef = searchParams.get('product');

    const [productPreview, setProductPreview] = useState<{
        slug: string;
        name: string;
        image: string | null;
        price: number;
        categoryGroup: string;
        subLabel: string;
    } | null>(null);
    const [productLoading, setProductLoading] = useState(false);

    const initialDetails = useMemo(() => {
        if (!productRef) return "";
        return `Je souhaite obtenir un devis pour le produit : ${productRef}`;
    }, [productRef]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: productRef ? "Produit spécifique" : "Projet sur mesure",
        details: initialDetails
    });

    const [submittedId, setSubmittedId] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let active = true;
        const run = async () => {
            if (!productRef) {
                setProductPreview(null);
                return;
            }
            setProductLoading(true);
            try {
                const res = await fetch(`/api/products/${encodeURIComponent(productRef)}`);
                if (!res.ok) {
                    if (active) setProductPreview(null);
                    return;
                }
                const json = await res.json();
                if (!active) return;
                setProductPreview(json?.product ?? null);
            } finally {
                if (active) setProductLoading(false);
            }
        };
        run();

        // also keep details in sync if user hasn't edited it
        setFormData((prev) => {
            if (!productRef) return prev;
            if (prev.details !== initialDetails) return prev;
            return { ...prev, type: "Produit spécifique", details: initialDetails };
        });

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productRef]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitting(true);
        try {
            const res = await fetch("/api/quotes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    productSlug: productRef || undefined,
                }),
            });
            const json = await res.json();
            if (!res.ok) {
                setSubmitError(json?.error ?? "Erreur lors de l'envoi.");
                return;
            }
            setSubmittedId(json.quote?.id || "INCONNU");
        } catch {
            setSubmitError("Erreur réseau.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submittedId) {
        const shortId = submittedId.split('-')[0].toUpperCase();
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 sm:px-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold">Demande envoyée !</h2>
                    <p className="text-muted-foreground">
                        Merci {formData.name}. Nous avons bien reçu votre demande.
                    </p>
                    
                    <div className="bg-muted/50 p-6 rounded-2xl my-6 border border-border shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">Suivez votre projet dans l'<strong>Espace Client</strong> avec votre numéro de téléphone :</p>
                        <div className="text-2xl font-bold text-primary mt-2">{formData.phone}</div>
                    </div>

                    <button
                        onClick={() => setSubmittedId(null)}
                        className="text-primary font-medium underline hover:text-secondary block mx-auto mt-4"
                    >
                        Envoyer une autre demande
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20 py-16 px-4 sm:px-6">
            <div className="container mx-auto max-w-3xl">
                <div className="bg-card shadow-lg rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Demande de Devis</h1>
                        <p className="text-muted-foreground">
                            Parlez-nous de votre projet. C'est gratuit et sans engagement.
                        </p>
                    </div>

                    {productRef && (
                        <div className="mb-8 rounded-2xl border border-border bg-muted/30 p-4 md:p-5">
                            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                <div className="w-full sm:w-28">
                                    <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                                        {productLoading ? (
                                            <div className="w-full h-full animate-pulse bg-muted" />
                                        ) : productPreview?.image ? (
                                            <img
                                                src={productPreview.image}
                                                alt={productPreview.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                                Image
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                                        Produit sélectionné
                                    </div>
                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <p className="text-lg font-bold">{productPreview?.name ?? productRef}</p>
                                        {productPreview?.price != null && (
                                            <span className="text-sm font-semibold text-primary">
                                                {formatTND(productPreview.price)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-center gap-3">
                                        <Link
                                            href={`/product/${encodeURIComponent(productRef)}`}
                                            className="text-sm font-medium text-secondary hover:underline underline-offset-4"
                                        >
                                            Voir le produit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {submitError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
                                {submitError}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Nom complet</label>
                                <input
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Votre nom"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="05 XX XX XX XX"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="type" className="text-sm font-medium">Type de projet</label>
                                <select
                                    id="type"
                                    name="type"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={formData.type}
                                    onChange={handleChange}
                                >
                                    <option value="Projet sur mesure">Projet sur mesure</option>
                                    <option value="Produit spécifique">Produit spécifique</option>
                                    <option value="Aménagement intérieur">Aménagement intérieur (Cuisine, Dressing...)</option>
                                    <option value="Professionnel">Projet Professionnel (Restaurant, Boutique...)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="details" className="text-sm font-medium">Détails de votre demande</label>
                            <textarea
                                id="details"
                                name="details"
                                rows={6}
                                required
                                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                placeholder="Décrivez votre projet, vos dimensions, vos inspirations..."
                                value={formData.details}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md text-lg disabled:opacity-60"
                        >
                            {submitting ? "Envoi..." : "Envoyer ma demande"}
                        </button>

                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Vos données sont sécurisées et ne seront jamais partagées.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function DevisPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <DevisForm />
        </Suspense>
    );
}
