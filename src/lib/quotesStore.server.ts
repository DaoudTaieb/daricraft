import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

export type QuoteStatus = "PENDING" | "CONTACTED" | "COMPLETED";

export type StoredQuote = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  details: string;
  productSlug?: string;
  status: QuoteStatus;
  images?: string[];
  replyMessage?: string;
  replyImages?: string[];
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const QUOTES_XML = path.join(DATA_DIR, "quotes.xml");

let quotesCache: { mtimeMs: number; value: StoredQuote[] } | null = null;

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

function normalizeArray<T>(v: T | T[] | undefined | null): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function toXml(quotes: StoredQuote[]): string {
  return xmlBuilder.build({
    quotes: {
      quote: quotes.map((q) => ({
        "@_id": q.id,
        "@_status": q.status,
        "@_createdAt": q.createdAt,
        "@_productSlug": q.productSlug ?? "",
        name: q.name,
        email: q.email,
        phone: q.phone,
        type: q.type,
        details: q.details,
        images: {
          image: q.images ?? [],
        },
        replyMessage: q.replyMessage ?? "",
        replyImages: {
          image: q.replyImages ?? [],
        },
      })),
    },
  });
}

function fromXml(raw: string): StoredQuote[] {
  try {
    const parsed = xmlParser.parse(raw) as any;
    const nodes = normalizeArray(parsed?.quotes?.quote);
    const out: StoredQuote[] = [];
    for (const n of nodes) {
      const id = String(n?.["@_id"] ?? "").trim();
      const createdAt = String(n?.["@_createdAt"] ?? "").trim() || new Date().toISOString();
      const status = (String(n?.["@_status"] ?? "PENDING").trim() as QuoteStatus) || "PENDING";
      const productSlug = String(n?.["@_productSlug"] ?? "").trim() || undefined;
      const name = String(n?.name ?? "").trim();
      const email = String(n?.email ?? "").trim();
      const phone = String(n?.phone ?? "").trim();
      const type = String(n?.type ?? "").trim();
      const details = String(n?.details ?? "").trim();
      const images = normalizeArray(n?.images?.image).map((x) => String(x));
      const replyMessage = String(n?.replyMessage ?? "").trim();
      const replyImages = normalizeArray(n?.replyImages?.image).map((x) => String(x));
      if (!id || !name || !email) continue;
      out.push({ id, createdAt, status, productSlug, name, email, phone, type, details, images, replyMessage, replyImages });
    }
    return out;
  } catch {
    return [];
  }
}

async function ensureQuotesFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  if (!(await exists(QUOTES_XML))) {
    await fs.writeFile(QUOTES_XML, toXml([]), "utf8");
    const st = await fs.stat(QUOTES_XML);
    quotesCache = { mtimeMs: st.mtimeMs, value: [] };
  }
}

export async function readQuotes(): Promise<StoredQuote[]> {
  await ensureQuotesFile();
  const st = await fs.stat(QUOTES_XML);
  if (quotesCache && quotesCache.mtimeMs === st.mtimeMs) return quotesCache.value;
  const raw = await fs.readFile(QUOTES_XML, "utf8");
  const value = fromXml(raw);
  quotesCache = { mtimeMs: st.mtimeMs, value };
  return value;
}

export async function writeQuotes(quotes: StoredQuote[]): Promise<void> {
  await ensureQuotesFile();
  await fs.writeFile(QUOTES_XML, toXml(quotes), "utf8");
  const st = await fs.stat(QUOTES_XML);
  quotesCache = { mtimeMs: st.mtimeMs, value: quotes };
}

export async function createQuote(input: {
  name: string;
  email: string;
  phone: string;
  type: string;
  details: string;
  productSlug?: string;
  images?: string[];
}): Promise<StoredQuote> {
  const quote: StoredQuote = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "PENDING",
    productSlug: input.productSlug,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    type: input.type.trim(),
    details: input.details.trim(),
    images: input.images ?? [],
  };
  const current = await readQuotes();
  await writeQuotes([quote, ...current]);
  return quote;
}

export async function updateQuoteReply(id: string, replyMessage: string, replyImages: string[]): Promise<StoredQuote | null> {
  const current = await readQuotes();
  const idx = current.findIndex(q => q.id === id);
  if (idx === -1) return null;
  current[idx].status = "COMPLETED";
  current[idx].replyMessage = replyMessage.trim();
  current[idx].replyImages = replyImages;
  await writeQuotes(current);
  return current[idx];
}

