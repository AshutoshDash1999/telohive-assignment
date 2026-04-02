"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  type FormErrors,
  type LoginInput,
  loginSchema,
  mapZodErrors,
} from "@/lib/validation/auth";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const initialize = useAuthStore((state) => state.initialize);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginAsGuest = useAuthStore((state) => state.loginAsGuest);
  const loginWithCredentials = useAuthStore(
    (state) => state.loginWithCredentials,
  );

  const [formValues, setFormValues] = useState<LoginInput>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors<LoginInput>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/discovery");
    }
  }, [isAuthenticated, isHydrated, router]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast]);

  const socialProviders = useMemo(
    () =>
      [
        { id: "google", label: "Google" },
        { id: "microsoft", label: "Microsoft" },
        { id: "apple", label: "Apple" },
      ] as const,
    [],
  );

  function onInputChange<Key extends keyof LoginInput>(
    key: Key,
    value: LoginInput[Key],
  ): void {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const result = loginSchema.safeParse(formValues);
    if (!result.success) {
      setErrors(mapZodErrors(result.error));
      return;
    }

    loginWithCredentials(result.data);
    router.push("/discovery");
  }

  function onForgotPasswordClick(): void {
    setToast("Reset link flow is not implemented in mock mode.");
  }

  function onSocialLogin(provider: "google" | "microsoft" | "apple"): void {
    loginAsGuest({ provider });
    router.push("/discovery");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Login</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Sign in to access your discovery workspace.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-zinc-900">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formValues.email}
              onChange={(event) => onInputChange("email", event.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 transition focus:border-zinc-400 focus:ring-2"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-900"
            >
              Password
            </label>
            <div className="flex gap-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formValues.password}
                onChange={(event) => onInputChange("password", event.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 transition focus:border-zinc-400 focus:ring-2"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password ? (
              <p className="text-xs text-red-600">{errors.password}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={formValues.rememberMe}
                onChange={(event) =>
                  onInputChange("rememberMe", event.target.checked)
                }
                className="h-4 w-4 rounded border-zinc-300"
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-sm font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition hover:text-zinc-900"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Login
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-zinc-200" />
          <span>OR</span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {socialProviders.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => onSocialLogin(provider.id)}
              className="rounded-md border border-zinc-300 px-2 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              {provider.label}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link className="font-medium text-zinc-900 underline" href="/register">
            Register
          </Link>
        </p>

        <p aria-live="polite" className="mt-4 text-sm text-zinc-700">
          {toast}
        </p>
      </div>
    </div>
  );
}
