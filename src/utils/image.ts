const VERCEL_BLOB_HOST = "blob.vercel-storage.com";

/**
 * Routes private Vercel Blob URLs through the server-side proxy.
 * External URLs (Unsplash, placehold.co, etc.) pass through unchanged.
 */
export function toBlobSrc(url: string): string {
  if (url.includes(VERCEL_BLOB_HOST)) {
    return `/api/images?url=${encodeURIComponent(url)}`;
  }
  return url;
}
