"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { formatTND } from "@/lib/money";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    categoryLabel?: string;
    slug: string;
}

export function ProductCard({ id, name, price, image, category, categoryLabel, slug }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative"
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Link href={`/product/${slug}`} aria-label={`Voir ${name}`}>
                    <span aria-hidden="true" className="absolute inset-0 z-10" />
                </Link>
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                {/* Quick Action */}
                <div className="absolute bottom-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Link
                        href={`/product/${slug}`}
                        className="bg-white text-primary p-3 rounded-full shadow-lg hover:bg-secondary hover:text-primary transition-colors inline-flex"
                        aria-label={`Ouvrir ${name}`}
                    >
                        <ArrowUpRight size={20} />
                    </Link>
                </div>
            </div>

            <div className="mt-4 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{categoryLabel ?? category}</p>
                <h3 className="text-lg font-medium leading-tight">
                    <Link href={`/product/${slug}`}>
                        {name}
                    </Link>
                </h3>
                <p className="text-sm font-semibold">{formatTND(price)}</p>
            </div>
        </motion.div>
    );
}
