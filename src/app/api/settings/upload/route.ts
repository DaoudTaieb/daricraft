import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

    const ext = file.name.split('.').pop() || "png";
    const fileName = `settings/${crypto.randomUUID()}.${ext}`;
    
    const blob = await put(fileName, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
