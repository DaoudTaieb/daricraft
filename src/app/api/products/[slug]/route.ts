import { NextResponse } from "next/server";
import { getStoredProductBySlug } from "@/lib/productStore.server";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } | Promise<{ slug: string }> }
) {
  const resolved = await Promise.resolve(params);
  const slug = decodeURIComponent(resolved.slug);

  const stored = await getStoredProductBySlug(slug);
  if (stored) {
    return NextResponse.json({
      product: {
        slug: stored.slug,
        name: stored.name,
        image: stored.images?.[0] ?? null,
        price: stored.price,
        categoryGroup: stored.categoryGroup,
        subLabel: stored.subLabel,
      },
    });
  }

  return NextResponse.json({ product: null }, { status: 404 });
}

