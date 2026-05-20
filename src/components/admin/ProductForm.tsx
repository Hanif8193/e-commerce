"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toBlobSrc } from "@/utils/image";

interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
}

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues & { images: string[] }>;
  productId?: string;
}

export function ProductForm({ initialValues, productId }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<ProductFormValues>({
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    price: initialValues?.price ?? "",
    category: initialValues?.category ?? "",
    stock: initialValues?.stock ?? "",
  });
  const [images, setImages] = useState<string[]>(initialValues?.images ?? []);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof ProductFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploadError("");
    setUploading(true);

    const uploaded: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok) {
          setUploadError(data.error ?? "Upload failed");
          break;
        }
        if (data.url) uploaded.push(data.url);
      } catch {
        setUploadError("Upload failed");
        break;
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function addUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setUploadError("URL must start with http:// or https://");
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setUrlInput("");
    setUploadError("");
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (images.length === 0) {
      setError("At least one product image is required.");
      return;
    }

    setLoading(true);

    const payload = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      category: values.category,
      stock: parseInt(values.stock, 10),
      images,
    };

    try {
      const url = productId
        ? `/api/admin/products/${productId}`
        : "/api/admin/products";
      const method = productId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Failed to save product");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <Input
        label="Name"
        value={values.name}
        onChange={set("name")}
        required
        disabled={loading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={values.description}
          onChange={set("description")}
          required
          disabled={loading}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
        />
      </div>

      <Input
        label="Price (USD)"
        type="number"
        step="0.01"
        min="0"
        value={values.price}
        onChange={set("price")}
        required
        disabled={loading}
      />

      <Input
        label="Category"
        value={values.category}
        onChange={set("category")}
        required
        disabled={loading}
      />

      <Input
        label="Stock"
        type="number"
        min="0"
        value={values.stock}
        onChange={set("stock")}
        required
        disabled={loading}
      />

      {/* ── Images ─────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>

        {/* Previews */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((src, i) => (
              <div key={i} className="relative group">
                <div className="relative h-24 w-24 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                  <Image
                    src={toBlobSrc(src)}
                    alt={`Product image ${i + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized={src.startsWith("/")}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Option 1 — Upload from computer */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || loading}
          className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 text-sm text-gray-500 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {uploading ? (
            <span>Uploading…</span>
          ) : (
            <>
              <span className="text-2xl mb-1">📁</span>
              <span className="font-medium">Click to upload from your computer</span>
              <span className="text-xs text-gray-400 mt-0.5">
                JPEG · PNG · WebP · GIF — max 5 MB each
              </span>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Option 2 — Paste URL */}
        <div className="mt-3 flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
            placeholder="Or paste an image URL (https://…)"
            disabled={loading}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addUrl}
            disabled={!urlInput.trim() || loading}
          >
            Add
          </Button>
        </div>

        {uploadError && (
          <p className="mt-1 text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={loading || uploading}>
          {loading ? "Saving…" : productId ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
