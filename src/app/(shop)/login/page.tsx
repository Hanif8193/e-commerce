import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

interface LoginPageProps {
  searchParams: { callbackUrl?: string };
}

export const metadata = { title: "Sign In — NextShop" };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  if (session) redirect("/products");

  const callbackUrl = searchParams.callbackUrl ?? "/products";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 text-center">
          Sign in to NextShop
        </h1>
        <LoginForm callbackUrl={callbackUrl} />
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
