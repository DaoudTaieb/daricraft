"use client";

import { useState } from "react";
import { Search, Clock, CheckCircle, Mail, Download, ArrowLeft, Image as ImageIcon, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function SuiviPage() {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/suivi?phone=${encodeURIComponent(phone)}`);
            const data = await res.json();
            setQuotes(data.quotes || []);
            setSearched(true);
            setSelectedQuote(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return "En cours d'étude";
            case 'CONTACTED': return "En cours de discussion";
            case 'COMPLETED': return "Proposition prête";
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-muted/20 py-16 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
                {!searched ? (
                    <div className="bg-card shadow-xl rounded-3xl p-8 md:p-16 max-w-xl mx-auto text-center border border-border">
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={32} />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Suivre vos demandes</h1>
                        <p className="text-muted-foreground mb-8">
                            Entrez le numéro de téléphone utilisé lors de votre demande de devis pour consulter nos propositions.
                        </p>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <input
                                type="tel"
                                required
                                placeholder="Votre numéro de téléphone"
                                className="w-full p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center text-lg"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md text-lg disabled:opacity-60"
                            >
                                {loading ? "Recherche en cours..." : "Consulter mon espace"}
                            </button>
                        </form>
                    </div>
                ) : selectedQuote ? (
                    <div className="bg-card shadow-xl rounded-3xl overflow-hidden border border-border">
                        {/* Header Details */}
                        <div className="bg-muted/30 p-6 md:p-8 border-b border-border">
                            <button 
                                onClick={() => setSelectedQuote(null)}
                                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
                            >
                                <ArrowLeft size={16} /> Retour à mes demandes
                            </button>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-primary">{selectedQuote.type}</h2>
                                    <p className="text-muted-foreground mt-1">
                                        Demande effectuée le {new Date(selectedQuote.createdAt).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                                    selectedQuote.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {selectedQuote.status === 'COMPLETED' ? <CheckCircle size={16} /> : <Clock size={16} />}
                                    {getStatusText(selectedQuote.status)}
                                </div>
                            </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-6 md:p-8 space-y-12">
                            {/* La réponse de l'admin */}
                            {selectedQuote.status === 'COMPLETED' && selectedQuote.replyMessage && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold border-b border-border pb-3">Notre Proposition</h3>
                                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-foreground leading-relaxed whitespace-pre-wrap">
                                        {selectedQuote.replyMessage}
                                    </div>

                                    {selectedQuote.replyImages && selectedQuote.replyImages.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-muted-foreground flex items-center gap-2 uppercase tracking-wider text-sm">
                                                <ImageIcon size={16} /> Plans 3D et rendus
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {selectedQuote.replyImages.map((imgUrl: string, idx: number) => (
                                                    <div key={idx} className="group relative aspect-video rounded-xl overflow-hidden border border-border shadow-sm">
                                                        <a href={imgUrl} target="_blank" rel="noopener noreferrer">
                                                            <img src={imgUrl} alt={`Plan 3D ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        </a>
                                                        <a 
                                                            href={imgUrl} 
                                                            download={`Proposition_DariCraft_${idx + 1}`}
                                                            className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
                            )}

                            {/* Le récapitulatif de la demande */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold border-b border-border pb-3 text-muted-foreground">Récapitulatif de votre demande</h3>
                                <div className="bg-muted/10 rounded-2xl p-6 space-y-4 text-sm text-muted-foreground border border-border">
                                    <p className="whitespace-pre-wrap">{selectedQuote.details}</p>
                                    
                                    {selectedQuote.images && selectedQuote.images.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <p className="font-medium mb-3">Vos fichiers attachés ({selectedQuote.images.length}) :</p>
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {selectedQuote.images.map((imgUrl: string, idx: number) => (
                                                    <a key={idx} href={imgUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 w-16 h-16 rounded-md overflow-hidden border border-border opacity-70 hover:opacity-100 transition-opacity">
                                                        <img src={imgUrl} className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Vos Demandes</h1>
                                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                    <Phone size={14} /> Téléphone : <span className="font-semibold text-foreground">{phone}</span>
                                </p>
                            </div>
                            <button 
                                onClick={() => { setSearched(false); setQuotes([]); setPhone(""); }}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Nouvelle recherche
                            </button>
                        </div>

                        {quotes.length === 0 ? (
                            <div className="bg-card shadow-sm border border-border rounded-3xl p-12 text-center">
                                <div className="w-16 h-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock size={24} />
                                </div>
                                <h2 className="text-xl font-bold mb-2">Aucune demande trouvée</h2>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    Nous n'avons trouvé aucune demande associée à cette adresse email. Avez-vous utilisé une autre adresse ?
                                </p>
                                <Link href="/" className="inline-block px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
                                    Retour à l'accueil
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {quotes.map((quote) => (
                                    <div 
                                        key={quote.id} 
                                        onClick={() => setSelectedQuote(quote)}
                                        className="bg-card border border-border shadow-sm rounded-2xl p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{quote.type}</h3>
                                                {quote.status === 'COMPLETED' && (
                                                    <span className="bg-green-100 text-green-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Nouveau Message</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Demande envoyée le {new Date(quote.createdAt).toLocaleDateString("fr-FR")}</p>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-4 sm:mt-0">
                                            <div className="text-sm font-medium flex items-center gap-2">
                                                {quote.status === 'COMPLETED' ? (
                                                    <span className="text-green-600 flex items-center gap-1.5"><CheckCircle size={16} /> Proposition prête</span>
                                                ) : (
                                                    <span className="text-yellow-600 flex items-center gap-1.5"><Clock size={16} /> En cours d'étude</span>
                                                )}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <ArrowLeft size={16} className="rotate-180" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
