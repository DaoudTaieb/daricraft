import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import type { CategoryGroup } from "@/lib/catalog";
import {
    CATEGORY_LABELS,
    getSubLabel,
    getTaxonomy,
} from "@/lib/catalog";
import { readStoredProducts } from "@/lib/productStore.server";

export const dynamic = "force-dynamic";

export default function CategoryPage({
    params,
    searchParams,
}: {
    params: { category: string } | Promise<{ category: string }>;
    searchParams?: { sub?: string } | Promise<{ sub?: string }>;
}) {
    // Support both Promise and plain object (depending on Next config/version)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const resolvedParamsPromise = Promise.resolve(params);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const resolvedSearchPromise = searchParams ? Promise.resolve(searchParams) : Promise.resolve(undefined);

    // Note: async server component pattern via "then" to keep signature compatible
    return (
        <ResolvedCategoryPage
            resolvedParamsPromise={resolvedParamsPromise}
            resolvedSearchPromise={resolvedSearchPromise}
        />
    );
}

async function ResolvedCategoryPage({
    resolvedParamsPromise,
    resolvedSearchPromise,
}: {
    resolvedParamsPromise: Promise<{ category: string }>;
    resolvedSearchPromise: Promise<{ sub?: string } | undefined>;
}) {
    const resolvedParams = await resolvedParamsPromise;
    const resolvedSearch = await resolvedSearchPromise;

    const categorySlug = resolvedParams.category as CategoryGroup;
    const categoryName = CATEGORY_LABELS[categorySlug] ?? "Catalogue";

    const selectedSub = typeof resolvedSearch?.sub === "string" ? resolvedSearch.sub : undefined;

    // In a real app, we would fetch from DB based on params.category
    // const category = await prisma.category.findUnique({ where: { slug: params.category } });

    const selectedLabel = selectedSub ? getSubLabel(categorySlug, selectedSub) : undefined;
    const taxonomy = getTaxonomy(categorySlug);

    // Client shows ONLY products stored in XML (created from Admin)
    const storedAll = await readStoredProducts();
    const storedForGroup = storedAll.filter((p) => p.categoryGroup === categorySlug);

    const section = selectedSub ? taxonomy.find((s) => s.key === selectedSub) : undefined;
    const sectionItemKeys = section ? new Set(section.items.map((i) => i.key)) : undefined;

    const storedFiltered = selectedSub
        ? sectionItemKeys
            ? storedForGroup.filter((p) => sectionItemKeys.has(p.subKey))
            : storedForGroup.filter((p) => p.subKey === selectedSub)
        : storedForGroup;

    const products = storedFiltered
        .map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            image: p.images?.[0] ?? "",
            subKey: p.subKey,
            subLabel: p.subLabel,
        }))
        .filter((p) => Boolean(p.image));

    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <div className="bg-primary text-primary-foreground py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">{categoryName}</h1>
                    <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
                        {selectedLabel
                            ? `Découvrez notre sélection pour “${selectedLabel}”.`
                            : `Découvrez notre sélection exclusive de ${categoryName.toLowerCase()}.`}
                    </p>
                </div>
            </div>

            {/* Taxonomy */}
            {taxonomy.length > 0 && (
                <section className="container mx-auto px-4 sm:px-6 -mt-10 md:-mt-14 relative z-10">
                    <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <h2 className="text-xl md:text-2xl font-bold text-primary tracking-tight">Catégories</h2>
                            {selectedSub && (
                                <Link
                                    href={`/${categorySlug}`}
                                    className="text-sm font-medium text-secondary hover:underline underline-offset-4"
                                >
                                    Voir tout
                                </Link>
                            )}
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {taxonomy.map((section) => (
                                <div key={section.key} className="rounded-xl border border-border bg-background p-5">
                                    <Link
                                        href={`/${categorySlug}?sub=${encodeURIComponent(section.key)}`}
                                        className="font-semibold text-primary hover:text-secondary transition-colors"
                                    >
                                        {section.title}
                                    </Link>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.key}
                                                href={`/${categorySlug}?sub=${encodeURIComponent(item.key)}`}
                                                className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted text-sm text-foreground/80 hover:text-secondary hover:bg-muted/80 transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Grid */}
            <div className="container mx-auto px-4 sm:px-6 py-16">
                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-lg font-semibold text-primary mb-2">Aucun produit pour le moment</p>
                        <p className="text-muted-foreground">
                            Cette sous-catégorie sera bientôt alimentée. Revenez bientôt, ou{" "}
                            <Link href="/devis" className="text-secondary hover:underline underline-offset-4">
                                demandez un devis
                            </Link>
                            .
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.image}
                                category={product.subKey}
                                categoryLabel={product.subLabel}
                                slug={product.slug}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
