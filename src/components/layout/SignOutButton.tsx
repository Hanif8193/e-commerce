"use client";

import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  email?: string | null;
}

export function SignOutButton({ email }: SignOutButtonProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs text-gray-500 sm:block">{email}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-sm text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
        type="button"
      >
        Sign out
      </button>
    </div>
  );
}
