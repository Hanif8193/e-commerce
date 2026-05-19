"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

interface AccountFormProps {
  currentEmail: string;
}

export function AccountForm({ currentEmail }: AccountFormProps) {
  const toast = useToast();

  const [email, setEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    const hasEmailChange = email.trim() !== currentEmail;
    const hasPasswordChange = !!newPassword;

    if (!hasEmailChange && !hasPasswordChange) {
      toast.info("No changes to save");
      return;
    }

    setLoading(true);
    try {
      const body: Record<string, string> = { currentPassword };
      if (hasEmailChange) body.email = email.trim();
      if (hasPasswordChange) body.newPassword = newPassword;

      const res = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        toast.error(data.error ?? "Failed to update account");
        return;
      }

      toast.success("Account updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
      />

      <hr className="border-gray-200" />

      <Input
        label="Current Password (required to save any change)"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
        disabled={loading}
        placeholder="Enter your current password"
      />

      <Input
        label="New Password (leave blank to keep current)"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        disabled={loading}
        placeholder="Min. 8 characters"
      />

      {newPassword && (
        <Input
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          placeholder="Repeat new password"
        />
      )}

      <Button type="submit" disabled={loading || !currentPassword}>
        {loading ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
