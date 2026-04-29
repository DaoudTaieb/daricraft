import { NextResponse } from "next/server";
import { readQuotes } from "@/lib/quotesStore.server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const phone = url.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 });

  const quotes = await readQuotes();
  const cleanSearch = phone.replace(/\D/g, "");
  
  const userQuotes = quotes.filter(q => {
    const cleanPhone = q.phone.replace(/\D/g, "");
    return cleanPhone === cleanSearch && cleanPhone.length > 0;
  });
  
  // Return sorted by date descending
  userQuotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ quotes: userQuotes });
}
