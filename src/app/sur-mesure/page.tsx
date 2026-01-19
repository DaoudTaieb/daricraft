"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Ruler, Palette, PenTool, MessageSquare, Check } from "lucide-react";

export default function SurMesurePage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero Custom */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1620613904037-77ef69ea8458?auto=format&fit=crop&q=70&w=1400")' }}
                    />
                    <div className="absolute inset-0 bg-primary/70" />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">Sur Mesure</h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8 font-light">
                        Imaginez. Nous créons. <br />
                        Votre mobilier unique, conçu pour votre espace.
                    </p>
                    <Link
                        href="/devis"
                        className="px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-full hover:bg-white hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                        <PenTool size={20} />
                        Demander un devis
                    </Link>
                </div>
            </section>

            {/* Conversion Section */}
            <section className="container mx-auto px-4 sm:px-6 -mt-10 md:-mt-14 relative z-10">
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <p className="text-secondary uppercase tracking-[0.2em] text-xs font-semibold mb-3">
                                🛠️ SUR MESURE
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                                Transformez votre idée en réalité.
                            </h2>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                C’est la solution idéale pour optimiser votre espace, choisir vos finitions, et obtenir un résultat
                                unique.
                            </p>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    "Mobilier sur mesure",
                                    "Aménagement intérieur",
                                    "Cuisines sur mesure",
                                    "Dressings & rangements",
                                    "Projets professionnels (cafés, restaurants, boutiques, bureaux)",
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3 rounded-xl bg-muted/50 px-4 py-3">
                                        <Check className="text-secondary mt-0.5" size={18} />
                                        <span className="text-sm font-medium text-foreground/90">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white" />
                                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-secondary" />
                            </div>
                            <div className="relative">
                                <h3 className="text-2xl font-bold">Demandez votre devis</h3>
                                <p className="mt-3 text-primary-foreground/80">
                                    Décrivez votre projet, vos dimensions et votre style. Nous vous répondons rapidement avec une
                                    proposition adaptée.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/devis"
                                        className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-full hover:bg-white hover:text-primary transition-colors"
                                    >
                                        Demander un devis
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Steps */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: Ruler, title: "1. Conception", desc: "Nous étudions vos besoins, vos dimensions et votre style pour concevoir le meuble parfait." },
                            { icon: Palette, title: "2. Matériaux", desc: "Choisissez parmi nos essences de bois nobles, nos tissus et nos finitions premium." },
                            { icon: PenTool, title: "3. Fabrication", desc: "Nos artisans donnent vie à votre projet dans notre atelier avec un savoir-faire traditionnel." }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="text-center group"
                            >
                                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <step.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio / Examples */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="text-3xl font-bold text-center mb-16">Nos dernières réalisations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="h-[400px] bg-gray-200 rounded-lg overflow-hidden relative group">
                            <img
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000"
                                alt="Cuisine sur mesure"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <h3 className="text-2xl font-bold">Cuisine Moderne et Bois</h3>
                            </div>
                        </div>
                        <div className="h-[400px] bg-gray-200 rounded-lg overflow-hidden relative group">
                            <img
                                src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1000"
                                alt="Dressing sur mesure"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <h3 className="text-2xl font-bold">Dressing Intégré</h3>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <Link
                            href="/devis"
                            className="inline-flex items-center gap-2 text-lg font-semibold underline underline-offset-8 hover:text-secondary transition-colors"
                        >
                            <MessageSquare />
                            Demander un devis pour mon projet
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
