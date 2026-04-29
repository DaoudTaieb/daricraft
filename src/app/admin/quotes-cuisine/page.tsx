"use client";

import { Eye, Mail, Phone, CheckCircle, Clock, Paperclip, Download, Reply, Send, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import type { StoredQuote } from "@/lib/quotesStore.server";

export default function AdminQuotesCuisinePage() {
    const [quotes, setQuotes] = useState<StoredQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<StoredQuote | null>(null);

    // Reply states
    const [replyMessage, setReplyMessage] = useState("");
    const [replyImages, setReplyImages] = useState<File[]>([]);
    const [replying, setReplying] = useState(false);
    const [replySuccess, setReplySuccess] = useState(false);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch("/api/quotes");
                const json = await res.json();
                if (!active) return;
                setQuotes(Array.isArray(json?.quotes) ? json.quotes.filter((q: any) => q.type === "Cuisine domestique") : []);
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

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        setReplying(true);
        
        try {
            const formData = new FormData();
            formData.append("replyMessage", replyMessage);
            replyImages.forEach(img => formData.append("replyImages", img));

            const res = await fetch(`/api/quotes/${selected.id}/reply`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Erreur serveur");
            
            const json = await res.json();
            setQuotes(prev => prev.map(q => q.id === selected.id ? json.quote : q));
            setSelected(json.quote);
            setReplySuccess(true);
        } catch (error) {
            alert("Erreur lors de l'envoi de la réponse.");
        } finally {
            setReplying(false);
        }
    };

    const closeDialog = () => {
        setSelected(null);
        setReplySuccess(false);
        setReplyMessage("");
        setReplyImages([]);
    };

    const downloadAllImages = async () => {
        if (!selected || !selected.images) return;
        
        try {
            const zip = new JSZip();
            const folderName = `Images_${selected.name.replace(/\s+/g, '_')}`;
            const folder = zip.folder(folderName);
            if (!folder) return;

            const fetchPromises = selected.images.map(async (imgUrl, idx) => {
                const response = await fetch(imgUrl);
                if (!response.ok) throw new Error(`Erreur réseau: ${response.status}`);
                const blob = await response.blob();
                const ext = imgUrl.split('.').pop()?.split('?')[0] || "jpg";
                folder.file(`${folderName}_${idx + 1}.${ext}`, blob);
            });

            await Promise.all(fetchPromises);
            
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(zipBlob);
            link.download = `${folderName}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Erreur ZIP:", error);
            alert("Erreur lors du téléchargement des images. Veuillez réessayer.");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Devis Cuisine Domestique</h1>
                <p className="text-muted-foreground">Suivi exclusif des projets de cuisine</p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-medium text-muted-foreground">Client</th>
                            <th className="p-4 font-medium text-muted-foreground">Détails du projet</th>
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
                                <td className="p-4 text-muted-foreground" colSpan={5}>Aucune demande de cuisine pour le moment.</td>
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
                                        <div className="text-xs text-muted-foreground truncate max-w-[260px]" title={quote.details}>
                                            {quote.details}
                                        </div>
                                        {quote.images && quote.images.length > 0 && (
                                            <div className="mt-2 text-xs font-semibold text-secondary flex items-center gap-1">
                                                <Paperclip size={12} /> {quote.images.length} pièce(s) jointe(s)
                                            </div>
                                        )}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-5xl rounded-2xl bg-card border border-border shadow-2xl flex flex-col max-h-[90vh]">
                        {/* HEADER MODAL */}
                        <div className="p-6 border-b border-border flex items-start justify-between gap-4 bg-muted/20">
                            <div>
                                <h2 className="text-2xl font-bold text-primary">Demande Cuisine : {selected.name}</h2>
                                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                    <Clock size={14} /> Reçu le {new Date(selected.createdAt).toLocaleString("fr-FR")}
                                    <span className="ml-4">{getStatusBadge(selected.status)}</span>
                                </p>
                            </div>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted font-medium transition-colors"
                                onClick={closeDialog}
                            >
                                Fermer
                            </button>
                        </div>

                        {/* BODY MODAL */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* GAUCHE : INFO CLIENT & IMAGES */}
                                <div className="space-y-6">
                                    <div className="rounded-xl border border-border bg-background p-5">
                                        <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-bold mb-4 flex items-center gap-2"><Eye size={16}/> Détails du client</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="grid grid-cols-3">
                                                <span className="text-muted-foreground">Nom :</span>
                                                <span className="col-span-2 font-medium">{selected.name}</span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <span className="text-muted-foreground">Email :</span>
                                                <span className="col-span-2 font-medium"><a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.email}</a></span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <span className="text-muted-foreground">Téléphone :</span>
                                                <span className="col-span-2 font-medium">{selected.phone || "-"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-border bg-background p-5">
                                        <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-2"><FileText size={16}/> Description</h3>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{selected.details}</p>
                                    </div>
                                    
                                    {selected.images && selected.images.length > 0 && (
                                        <div className="rounded-xl border border-border bg-background p-5">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
                                                    <Paperclip size={16}/> Fichiers attachés ({selected.images.length})
                                                </h3>
                                                {selected.images.length > 1 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={downloadAllImages}
                                                        className="text-xs flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/90 transition-colors font-medium shadow-sm"
                                                    >
                                                        <Download size={14} /> Tout télécharger
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {selected.images.map((imgUrl, idx) => (
                                                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-border shadow-sm aspect-square bg-muted">
                                                        <a 
                                                            href={imgUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            title={`Ouvrir l'image ${idx + 1}`}
                                                            className="block w-full h-full"
                                                        >
                                                            <img src={imgUrl} alt={`Pièce jointe ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        </a>
                                                        {/* BOUTON TELECHARGEMENT */}
                                                        <a 
                                                            href={imgUrl} 
                                                            download={`${selected.name.replace(/\s+/g, '_')}_Image_${idx + 1}`}
                                                            className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                                            title="Télécharger l'image"
                                                        >
                                                            <Download size={16} />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* DROITE : FORMULAIRE DE REPONSE */}
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-border bg-muted/30 p-6 h-full flex flex-col">
                                        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                                            <Reply size={20} className="text-primary" /> 
                                            Répondre & Proposer un plan 3D
                                        </h3>
                                        
                                        {replySuccess ? (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                                    <CheckCircle size={32} />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold">Réponse envoyée !</h4>
                                                    <p className="text-muted-foreground mt-2">Le client a reçu votre proposition par email.</p>
                                                </div>
                                                <button onClick={closeDialog} className="mt-4 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90">
                                                    Retour aux devis
                                                </button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleReplySubmit} className="flex-1 flex flex-col gap-5">
                                                <div className="space-y-2 flex-1">
                                                    <label className="text-sm font-medium">Message ou description de l'offre</label>
                                                    <textarea 
                                                        required
                                                        value={replyMessage}
                                                        onChange={e => setReplyMessage(e.target.value)}
                                                        className="w-full h-[180px] p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" 
                                                        placeholder={`Bonjour ${selected.name},\n\nSuite à votre demande, voici notre proposition et le rendu 3D de votre future cuisine...`}
                                                    />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Joindre des images traitées / Rendus 3D</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="file" 
                                                            multiple 
                                                            accept="image/*" 
                                                            onChange={e => e.target.files && setReplyImages(Array.from(e.target.files))}
                                                            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 border border-border rounded-xl bg-background cursor-pointer"
                                                        />
                                                    </div>
                                                </div>

                                                <button 
                                                    type="submit" 
                                                    disabled={replying}
                                                    className="w-full mt-4 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow flex items-center justify-center gap-2 disabled:opacity-70"
                                                >
                                                    {replying ? (
                                                        <span className="flex items-center gap-2"><Clock size={18} className="animate-spin" /> Envoi en cours...</span>
                                                    ) : (
                                                        <span className="flex items-center gap-2"><Send size={18} /> Envoyer la réponse au client</span>
                                                    )}
                                                </button>
                                                <p className="text-xs text-center text-muted-foreground">Une notification email sera envoyée à {selected.email}</p>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
