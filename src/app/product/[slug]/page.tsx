import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Truck, Shield } from "lucide-react";
import { formatTND } from "@/lib/money";
import { getStoredProductBySlug } from "@/lib/productStore.server";

export const dynamic = "force-dynamic";

export default async function ProductPage({
    params,
}: {
    params: { slug: string } | Promise<{ slug: string }>;
}) {
    const resolvedParams = await Promise.resolve(params);
    // const product = await prisma.product.findUnique({ where: { slug: resolvedParams.slug } });
    const slug = decodeURIComponent(resolvedParams.slug);
    const product = await getStoredProductBySlug(slug);

    if (!product) return notFound();

    const images = product.images ?? [];
    const features: string[] = (product as any)?.characteristics ?? [];

    return (
        <div className="bg-background min-h-screen pb-20">
            <div className="container mx-auto px-4 sm:px-6 pt-8">
                <Link
                    href={`/${product.categoryGroup}`}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Retour au catalogue
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                            {images[0] ? (
                                <img
                                    src={images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                    Aucune image
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-2 gap-4">
                                {images.slice(1, 5).map((src, idx) => (
                                    <div key={src + idx} className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                                        <img
                                            src={src}
                                            alt={`${product.name} détail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="space-y-8">
                        <div>
                                <span className="text-secondary text-sm font-medium tracking-widest uppercase mb-2 block">
                                    {product.subLabel}
                                </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{product.name}</h1>
                            <p className="text-3xl font-semibold text-primary">{formatTND(product.price)}</p>
                        </div>

                        <div className="prose text-muted-foreground leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        {/* Features */}
                        <div className="space-y-4 border-y border-border py-6">
                            <h3 className="font-semibold text-primary">Caractéristiques</h3>
                            {features.length > 0 ? (
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-foreground/80">
                                            <Check size={16} className="text-secondary mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">Caractéristiques à compléter.</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <Link
                                href={`/devis?product=${product.slug}`}
                                className="block w-full py-4 bg-primary text-primary-foreground text-center font-bold rounded-full hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg"
                            >
                                Demander un devis / Commander
                            </Link>
                            <p className="text-xs text-center text-muted-foreground">
                                Chaque pièce est unique. Contactez-nous pour une personnalisation.
                            </p>
                        </div>

                        {/* Trust/Info */}
                        <div className="grid grid-cols-2 gap-4 pt-6">
                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                <Truck className="text-secondary" />
                                <div>
                                    <p className="font-semibold text-sm">Livraison</p>
                                    <p className="text-xs text-muted-foreground">Partout en Algérie</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                <Shield className="text-secondary" />
                                <div>
                                    <p className="font-semibold text-sm">Garantie</p>
                                    <p className="text-xs text-muted-foreground">Qualité artisanale</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
