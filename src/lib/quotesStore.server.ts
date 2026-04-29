import { kv } from "@vercel/kv";
import crypto from "crypto";

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

const KV_KEY = "daricraft_quotes";

export async function readQuotes(): Promise<StoredQuote[]> {
  try {
    const quotes = await kv.get<StoredQuote[]>(KV_KEY);
    return quotes || [];
  } catch (error) {
    console.error("KV Read Error:", error);
    return [];
  }
}

export async function writeQuotes(quotes: StoredQuote[]): Promise<void> {
  await kv.set(KV_KEY, quotes);
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
