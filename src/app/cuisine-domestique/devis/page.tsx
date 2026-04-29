"use client";

import { useState } from "react";
import Link from "next/link";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function CuisineDevisPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        details: "",
    });
    const [images, setImages] = useState<{file: File, preview: string}[]>([]);
    const [submittedId, setSubmittedId] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setImages(prev => [...prev, ...newFiles]);
        }
    };
    
    const removeImage = (index: number) => {
        setImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitting(true);
        
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("details", formData.details);
            data.append("type", "Cuisine domestique");
            
            images.forEach(img => {
                data.append("images", img.file);
            });
            
            const res = await fetch("/api/quotes", {
                method: "POST",
                body: data,
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
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-bold">Demande envoyée !</h2>
                    <p className="text-muted-foreground">
                        Merci {formData.name}. Nous avons bien reçu votre demande de cuisine. Notre équipe l'étudie actuellement.
                    </p>
                    
                    <div className="bg-muted/50 p-6 rounded-2xl my-6 border border-border shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">Vous pouvez suivre l'avancement de votre devis dans l'<strong>Espace Client</strong> en utilisant simplement votre numéro de téléphone :</p>
                        <div className="text-2xl font-bold text-primary mt-2">{formData.phone}</div>
                    </div>

                    <button
                        onClick={() => {
                            setSubmittedId(null);
                            setFormData({ name: "", email: "", phone: "", details: "" });
                            images.forEach(img => URL.revokeObjectURL(img.preview));
                            setImages([]);
                        }}
                        className="text-primary font-medium underline hover:text-secondary mt-4 block mx-auto"
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
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Devis Cuisine</h1>
                        <p className="text-muted-foreground">
                            Concevons ensemble la cuisine de vos rêves.
                        </p>
                    </div>

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

                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="05 XX XX XX XX"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="details" className="text-sm font-medium">Détails de votre demande</label>
                            <textarea
                                id="details"
                                name="details"
                                rows={6}
                                required
                                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                placeholder="Décrivez votre espace, le style (moderne, bois massif...), ou les dimensions approximatives..."
                                value={formData.details}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <span className="text-sm font-medium block">Ajouter des images (plans, inspirations...)</span>
                            <label 
                                htmlFor="file-upload"
                                className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-10 hover:bg-muted/50 transition-colors cursor-pointer group"
                            >
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                                    <div className="mt-4 flex justify-center text-sm leading-6 text-muted-foreground">
                                        <span className="relative font-semibold text-primary group-hover:text-secondary transition-colors">
                                            Télécharger des fichiers
                                        </span>
                                        <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                                        <p className="pl-1">ou glisser-déposer</p>
                                    </div>
                                    <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF jusqu'à 10MB</p>
                                </div>
                            </label>
                            
                            {images.length > 0 && (
                                <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {images.map((img, index) => (
                                        <li key={index} className="relative rounded-lg overflow-hidden border border-border bg-background group aspect-square">
                                            <img src={img.preview} alt={img.file.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeImage(index)}
                                                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                                                    title="Supprimer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                </button>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] truncate px-2 py-1">
                                                {img.file.name}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md text-lg disabled:opacity-60"
                        >
                            {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
