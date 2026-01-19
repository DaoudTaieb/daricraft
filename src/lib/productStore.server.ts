import { promises as fs } from "fs";
import path from "path";
import { getSubLabel, type CategoryGroup } from "@/lib/catalog";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

export type StoredProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  characteristics: string[];
  price: number;
  categoryGroup: CategoryGroup;
  subKey: string;
  subLabel: string;
  images: string[];
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_XML = path.join(DATA_DIR, "products.xml");
const PRODUCTS_JSON = path.join(DATA_DIR, "products.json"); // legacy (migration)

let productsCache: { mtimeMs: number; value: StoredProduct[] } | null = null;

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  parseTagValue: false,
});

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
});

async function exists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function writeXmlFile(products: StoredProduct[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const xml = toXml(products);
  await fs.writeFile(PRODUCTS_XML, xml, "utf8");
  const st = await fs.stat(PRODUCTS_XML);
  productsCache = { mtimeMs: st.mtimeMs, value: products };
}

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  // If XML doesn't exist but JSON exists, migrate once.
  const hasXml = await exists(PRODUCTS_XML);
  const hasJson = await exists(PRODUCTS_JSON);

  if (!hasXml && hasJson) {
    const raw = await fs.readFile(PRODUCTS_JSON, "utf8");
    const parsed = JSON.parse(raw) as { products?: StoredProduct[] };
    const products = Array.isArray(parsed.products) ? parsed.products : [];
    await writeXmlFile(products);
    return;
  }

  if (!hasXml) {
    await writeXmlFile([]);
  }
}

function toXml(products: StoredProduct[]): string {
  const doc = {
    products: {
      product: products.map((p) => ({
        "@_id": p.id,
        "@_createdAt": p.createdAt,
        "@_categoryGroup": p.categoryGroup,
        "@_subKey": p.subKey,
        "@_subLabel": p.subLabel,
        name: p.name,
        slug: p.slug,
        description: p.description,
        characteristics: {
          item: p.characteristics ?? [],
        },
        price: String(p.price),
        images: {
          image: p.images ?? [],
        },
      })),
    },
  };
  return xmlBuilder.build(doc);
}

function normalizeArray<T>(v: T | T[] | undefined | null): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function fromXml(raw: string): StoredProduct[] {
  const parsed = xmlParser.parse(raw) as any;
  const productsNode = parsed?.products;
  const productNodes = normalizeArray(productsNode?.product);

  const out: StoredProduct[] = [];
  for (const n of productNodes) {
    const id = String(n?.["@_id"] ?? "").trim();
    const createdAt = String(n?.["@_createdAt"] ?? "").trim();
    const categoryGroup = String(n?.["@_categoryGroup"] ?? "").trim() as CategoryGroup;
    const subKey = String(n?.["@_subKey"] ?? "").trim();
    const subLabel = String(n?.["@_subLabel"] ?? "").trim();
    const name = String(n?.name ?? "").trim();
    const slug = String(n?.slug ?? "").trim();
    const description = String(n?.description ?? "").trim();
    const characteristics = normalizeArray(n?.characteristics?.item).map((x) => String(x).trim()).filter(Boolean);
    const price = Number(String(n?.price ?? "0").trim());
    const images = normalizeArray(n?.images?.image).map((x) => String(x));

    if (!id || !slug || !name) continue;
    out.push({
      id,
      createdAt: createdAt || new Date().toISOString(),
      categoryGroup,
      subKey,
      subLabel: subLabel || (getSubLabel(categoryGroup, subKey) ?? subKey),
      name,
      slug,
      description,
      characteristics,
      price: Number.isFinite(price) ? price : 0,
      images,
    });
  }

  return out;
}

export async function readStoredProducts(): Promise<StoredProduct[]> {
  await ensureDataFile();
  const st = await fs.stat(PRODUCTS_XML);
  if (productsCache && productsCache.mtimeMs === st.mtimeMs) return productsCache.value;

  const raw = await fs.readFile(PRODUCTS_XML, "utf8");
  const parsed = fromXml(raw);
  productsCache = { mtimeMs: st.mtimeMs, value: parsed };
  return parsed;
}

export async function writeStoredProducts(products: StoredProduct[]): Promise<void> {
  await writeXmlFile(products);
}

export async function getStoredProductBySlug(slug: string): Promise<StoredProduct | undefined> {
  const products = await readStoredProducts();
  return products.find((p) => p.slug === slug);
}

export function buildStoredProduct(input: {
  id: string;
  name: string;
  slug: string;
  description: string;
  characteristics?: string[];
  price: number;
  categoryGroup: CategoryGroup;
  subKey: string;
  images: string[];
}): StoredProduct {
  const subLabel = getSubLabel(input.categoryGroup, input.subKey) ?? input.subKey;
  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    description: input.description,
    characteristics: input.characteristics ?? [],
    price: input.price,
    categoryGroup: input.categoryGroup,
    subKey: input.subKey,
    subLabel,
    images: input.images,
    createdAt: new Date().toISOString(),
  };
}

