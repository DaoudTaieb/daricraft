import { NextResponse } from "next/server";
import { createQuote, readQuotes } from "@/lib/quotesStore.server";

export const runtime = "nodejs";

export async function GET() {
  const quotes = await readQuotes();
  return NextResponse.json({ quotes });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as any;
  if (!body) return NextResponse.json({ error: "Body invalide." }, { status: 400 });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const type = String(body.type ?? "").trim();
  const details = String(body.details ?? "").trim();
  const productSlug = body.productSlug ? String(body.productSlug).trim() : undefined;

  if (!name || !email || !details || !type) {
    return NextResponse.json({ error: "Champs manquants (name/email/type/details)." }, { status: 400 });
  }

  const quote = await createQuote({ name, email, phone, type, details, productSlug });
  return NextResponse.json({ quote }, { status: 201 });
}

