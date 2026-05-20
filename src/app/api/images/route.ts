import { NextRequest, NextResponse } from "next/server";

// Only proxy URLs from Vercel Blob — prevents SSRF attacks
const ALLOWED_BLOB_HOST = "blob.vercel-storage.com";

export async function GET(request: NextRequest) {
  const blobUrl = request.nextUrl.searchParams.get("url");

  if (!blobUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(blobUrl);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (!parsed.hostname.endsWith(ALLOWED_BLOB_HOST)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return new NextResponse("Server misconfiguration", { status: 500 });
  }

  try {
    const upstream = await fetch(blobUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!upstream.ok) {
      return new NextResponse("Not found", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": contentType,
        // Cache aggressively — blob content is immutable (content-addressed)
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
