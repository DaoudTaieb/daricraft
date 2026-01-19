import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { readStoredProducts, writeStoredProducts } from "@/lib/productStore.server";
import { getSubLabel, type CategoryGroup } from "@/lib/catalog";

export const runtime = "nodejs";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET(
  _req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  const resolved = await Promise.resolve(params);
  const id = String(resolved.id).trim();
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 400 });

  const products = await readStoredProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });

  return NextResponse.json({ product });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  const resolved = await Promise.resolve(params);
  const id = String(resolved.id).trim();
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 400 });

  const body = (await req.json().catch(() => null)) as any;
  if (!body) return NextResponse.json({ error: "Body invalide." }, { status: 400 });

  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const description = String(body.description ?? "").trim();
  const characteristicsRaw = String(body.characteristics ?? "").trim();
  const price = Number(body.price);
  const categoryGroup = String(body.categoryGroup ?? "").trim() as CategoryGroup;
  const subKey = String(body.subKey ?? "").trim();

  if (!name || !slug || !description || !Number.isFinite(price) || !categoryGroup || !subKey) {
    return NextResponse.json({ error: "Champs invalides." }, { status: 400 });
  }

  const products = await readStoredProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });

  if (products.some((p) => p.slug === slug && p.id !== id)) {
    return NextResponse.json({ error: "Slug déjà utilisé." }, { status: 409 });
  }

  const prev = products[idx];
  const characteristics = characteristicsRaw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 24);
  const next = {
    ...prev,
    name,
    slug,
    description,
    characteristics,
    price,
    categoryGroup,
    subKey,
    subLabel: getSubLabel(categoryGroup, subKey) ?? subKey,
  };

  const updated = [...products];
  updated[idx] = next;
  await writeStoredProducts(updated);

  return NextResponse.json({ product: next });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  const resolved = await Promise.resolve(params);
  const id = String(resolved.id).trim();
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 400 });

  const products = await readStoredProducts();
  const exists = products.some((p) => p.id === id);
  if (!exists) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });

  const next = products.filter((p) => p.id !== id);
  await writeStoredProducts(next);

  // delete images folder
  const dir = path.join(UPLOADS_DIR, id);
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: true });
}

