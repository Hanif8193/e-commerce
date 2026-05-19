import type { Decimal } from "@prisma/client/runtime/library";

export function formatCurrency(amount: Decimal | number | string): string {
  const value = typeof amount === "object" ? parseFloat(amount.toString()) : Number(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatShortDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function truncateId(id: string, length = 8): string {
  return `#${id.slice(-length).toUpperCase()}`;
}
