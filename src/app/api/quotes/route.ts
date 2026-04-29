import { NextResponse } from "next/server";
import { createQuote, readQuotes } from "@/lib/quotesStore.server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

export async function GET() {
  const quotes = await readQuotes();
  return NextResponse.json({ quotes });
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  let name = "", email = "", phone = "", type = "", details = "", productSlug: string | undefined;
  const images: string[] = [];

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData().catch(() => null);
    if (!formData) return NextResponse.json({ error: "FormData invalide." }, { status: 400 });

    name = String(formData.get("name") ?? "").trim();
    email = String(formData.get("email") ?? "").trim();
    phone = String(formData.get("phone") ?? "").trim();
    type = String(formData.get("type") ?? "Cuisine domestique").trim();
    details = String(formData.get("details") ?? "").trim();

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    for (const [key, value] of formData.entries()) {
      if (key === "images" && value instanceof Blob) {
        const file = value as File;
        if (file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const ext = file.name.split('.').pop() || "png";
          const fileName = `${crypto.randomUUID()}.${ext}`;
          const filePath = path.join(uploadDir, fileName);
          await fs.writeFile(filePath, buffer);
          images.push(`/uploads/${fileName}`);
        }
      }
    }
  } else {
    const body = (await req.json().catch(() => null)) as any;
    if (!body) return NextResponse.json({ error: "Body invalide." }, { status: 400 });

    name = String(body.name ?? "").trim();
    email = String(body.email ?? "").trim();
    phone = String(body.phone ?? "").trim();
    type = String(body.type ?? "").trim();
    details = String(body.details ?? "").trim();
    productSlug = body.productSlug ? String(body.productSlug).trim() : undefined;
  }

  if (!name || !email || !details || !type) {
    return NextResponse.json({ error: "Champs manquants (name/email/type/details)." }, { status: 400 });
  }

  const quote = await createQuote({ name, email, phone, type, details, productSlug, images });
  return NextResponse.json({ quote }, { status: 201 });
}

