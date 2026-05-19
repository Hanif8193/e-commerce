import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AccountForm } from "@/components/admin/AccountForm";

export const metadata = { title: "Account Settings — Admin — NextShop" };
export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/");

  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your admin email address or password.
        </p>
      </div>
      <AccountForm currentEmail={session.user.email ?? ""} />
    </Container>
  );
}
