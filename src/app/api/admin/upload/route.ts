import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import type { Session } from "next-auth";

function requireAdmin(session: Session | null) {
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function POST(request: Request) {
  const { allowed } = rateLimit(`upload:${getClientIp(request)}`, 20, 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait a moment." },
      { status: 429 }
    );
  }

  const session = await getServerSession(authOptions);
  const deny = requireAdmin(session);
  if (deny) return deny;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File must be under 5 MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const blob = await put(filename, file, { access: "public" });

    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
