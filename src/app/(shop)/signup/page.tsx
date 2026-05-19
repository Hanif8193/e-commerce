import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";

export const metadata = { title: "Create Account — NextShop" };

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/products");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 text-center">
          Create your account
        </h1>
        <SignupForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
