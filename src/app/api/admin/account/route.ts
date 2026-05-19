import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Session } from "next-auth";

const updateAccountSchema = z
  .object({
    email: z.string().email("Invalid email address").optional(),
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
  })
  .refine((d) => d.email || d.newPassword, {
    message: "Provide a new email or new password",
  });

function requireAdmin(session: Session | null) {
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const deny = requireAdmin(session);
  if (deny) return deny;

  try {
    const body: unknown = await request.json();
    const parsed = updateAccountSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email, currentPassword, newPassword } = parsed.data;

    const admin = await db.user.findUnique({
      where: { id: session!.user.id },
      select: { id: true, email: true, passwordHash: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const passwordValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    if (email && email !== admin.email) {
      const conflict = await db.user.findUnique({ where: { email } });
      if (conflict) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
    }

    const updateData: { email?: string; passwordHash?: string } = {};
    if (email && email !== admin.email) updateData.email = email;
    if (newPassword) updateData.passwordHash = await bcrypt.hash(newPassword, 12);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No changes to save" }, { status: 400 });
    }

    await db.user.update({ where: { id: admin.id }, data: updateData });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}
