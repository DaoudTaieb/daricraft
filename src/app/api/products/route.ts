import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";
import type { CategoryGroup } from "@/lib/catalog";
import {
  buildStoredProduct,
  readStoredProducts,
  writeStoredProducts,
  type StoredProduct,
} from "@/lib/productStore.server";

export const runtime = "nodejs";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function sanitizeFilename(name: string) {
  // keep extension, remove weird chars
  const base = name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return base || "image";
}

export async function GET() {
  const products = await readStoredProducts();
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const form = await req.formData();

  const name = String(form.get("name") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const characteristicsRaw = String(form.get("characteristics") ?? "").trim();
  const priceRaw = String(form.get("price") ?? "").trim();
  const categoryGroup = String(form.get("group") ?? "").trim() as CategoryGroup;
  const subKey = String(form.get("subKey") ?? "").trim();

  if (!name || !slug || !description || !priceRaw || !categoryGroup || !subKey) {
    return NextResponse.json(
      { error: "Champs manquants (name/slug/description/price/group/subKey)." },
      { status: 400 }
    );
  }

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
  }

  const files = form.getAll("images").filter((v): v is File => v instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "Ajoutez au moins une image." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const productDir = path.join(UPLOADS_DIR, id);
  await fs.mkdir(productDir, { recursive: true });

  const imageUrls: string[] = [];
  for (const file of files.slice(0, 8)) {
    if (!file.type.startsWith("image/")) continue;
    // basic size guard (10MB)
    if (file.size > 10 * 1024 * 1024) continue;

    const extFromType = file.type.split("/")[1] ? `.${file.type.split("/")[1]}` : "";
    const safe = sanitizeFilename(file.name || "image");
    const filename = safe.includes(".") ? safe : `${safe}${extFromType || ".png"}`;

    const buf = Buffer.from(await file.arrayBuffer());
    const targetPath = path.join(productDir, filename);
    await fs.writeFile(targetPath, buf);
    imageUrls.push(`/uploads/${id}/${filename}`);
  }

  if (imageUrls.length === 0) {
    return NextResponse.json({ error: "Aucune image valide n'a été reçue." }, { status: 400 });
  }

  const products = await readStoredProducts();
  if (products.some((p) => p.slug === slug)) {
    return NextResponse.json({ error: "Slug déjà utilisé." }, { status: 409 });
  }

  const characteristics = characteristicsRaw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 24);

  const newProduct: StoredProduct = buildStoredProduct({
    id,
    name,
    slug,
    description,
    characteristics,
    price,
    categoryGroup,
    subKey,
    images: imageUrls,
  });

  await writeStoredProducts([newProduct, ...products]);
  return NextResponse.json({ product: newProduct }, { status: 201 });
}

