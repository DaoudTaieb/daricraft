"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=70&w=1400")' }}
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-secondary uppercase tracking-[0.2em] mb-4 text-sm md:text-base font-medium">
                        Savoir-faire artisanal
                    </h2>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
                        DariCraft<span className="text-secondary">.</span>
                    </h1>
                    <p className="text-white/80 uppercase tracking-[0.25em] text-xs md:text-sm font-medium mb-4">
                        L&apos;Esprit du Design
                    </p>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light">
                        Créez un intérieur qui vous ressemble avec nos collections de mobilier et nos créations sur mesure.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/mobilier"
                            className="group px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-secondary hover:text-primary transition-all duration-300 flex items-center gap-2"
                        >
                            Découvrir nos créations
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/devis"
                            className="px-8 py-4 bg-transparent border border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                            Devis sur mesure
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1">
                    <div className="w-1 h-3 bg-current rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
