"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Ruler, Palette, PenTool, MessageSquare, Check } from "lucide-react";

export default function CuisineDomestiquePage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero Custom */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=70&w=1400")' }}
                    />
                    <div className="absolute inset-0 bg-primary/70" />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">Cuisine Domestique</h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8 font-light">
                        Le cœur de votre maison. <br />
                        Des cuisines sur mesure alliant design et fonctionnalité.
                    </p>
                </div>
            </section>

            {/* Conversion Section */}
            <section className="container mx-auto px-4 sm:px-6 -mt-10 md:-mt-14 relative z-10">
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <p className="text-secondary uppercase tracking-[0.2em] text-xs font-semibold mb-3">
                                🍳 CUISINE DOMESTIQUE
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                                Créez l'espace parfait pour vos repas.
                            </h2>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                Nous concevons et fabriquons des cuisines équipées qui répondent à vos exigences de style et d'ergonomie, avec des matériaux durables et de haute qualité.
                            </p>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    "Cuisines modernes et contemporaines",
                                    "Design classique et intemporel",
                                    "Îlots centraux sur mesure",
                                    "Optimisation de l'espace de rangement",
                                    "Finitions premium (bois, mat, brillant)",
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
                                <h3 className="text-2xl font-bold">Demandez votre devis cuisine</h3>
                                <p className="mt-3 text-primary-foreground/80">
                                    Partagez les dimensions de votre espace et le style souhaité. Nos experts vous accompagneront de la 3D jusqu'à la pose.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/cuisine-domestique/devis"
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
                            { icon: Ruler, title: "1. Étude & Plan 3D", desc: "Nous prenons les mesures exactes et réalisons une modélisation 3D pour que vous puissiez vous projeter." },
                            { icon: Palette, title: "2. Choix des Matériaux", desc: "Sélectionnez les façades, les plans de travail et l'électroménager avec nos conseillers." },
                            { icon: PenTool, title: "3. Fabrication & Pose", desc: "Votre cuisine est fabriquée avec soin puis installée par nos équipes professionnelles." }
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
                    <h2 className="text-3xl font-bold text-center mb-16">Inspirations de Cuisines</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="h-[400px] bg-gray-200 rounded-lg overflow-hidden relative group">
                            <img
                                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000"
                                alt="Cuisine contemporaine"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <h3 className="text-2xl font-bold">Cuisine Contemporaine avec Îlot</h3>
                            </div>
                        </div>
                        <div className="h-[400px] bg-gray-200 rounded-lg overflow-hidden relative group">
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
                                alt="Cuisine minimaliste bois"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <h3 className="text-2xl font-bold">Cuisine Minimaliste Chêne</h3>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        {/* Devise link removed to keep a single button on the page */}
                    </div>
                </div>
            </section>
        </div>
    );
}
