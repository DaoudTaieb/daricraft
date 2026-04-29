import { NextResponse } from "next/server";
import { updateQuoteReply } from "@/lib/quotesStore.server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: any }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  const contentType = req.headers.get("content-type") || "";
  
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Invalid Content-Type" }, { status: 400 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "FormData invalide." }, { status: 400 });

  const replyMessage = String(formData.get("replyMessage") ?? "").trim();
  if (!replyMessage) {
    return NextResponse.json({ error: "Message de réponse manquant." }, { status: 400 });
  }

  const replyImages: string[] = [];
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  for (const [key, value] of formData.entries()) {
    if (key === "replyImages" && value instanceof Blob) {
      const file = value as File;
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split('.').pop() || "png";
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);
        replyImages.push(`/uploads/${fileName}`);
      }
    }
  }

  const updatedQuote = await updateQuoteReply(id, replyMessage, replyImages);
  if (!updatedQuote) {
    return NextResponse.json({ error: "Devis introuvable." }, { status: 404 });
  }

  return NextResponse.json({ quote: updatedQuote }, { status: 200 });
}
