"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  type FormErrors,
  type RegisterInput,
  mapZodErrors,
  registerSchema,
} from "@/lib/validation/auth";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const initialize = useAuthStore((state) => state.initialize);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const registerAndLogin = useAuthStore((state) => state.registerAndLogin);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValues, setFormValues] = useState<RegisterInput>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors<RegisterInput>>({});

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/discovery");
    }
  }, [isAuthenticated, isHydrated, router]);

  function onInputChange<Key extends keyof RegisterInput>(
    key: Key,
    value: RegisterInput[Key],
  ): void {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const result = registerSchema.safeParse(formValues);
    if (!result.success) {
      setErrors(mapZodErrors(result.error));
      return;
    }

    registerAndLogin(result.data);
    router.push("/discovery");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Register</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Create your account to continue.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-zinc-900"
              >
                First name
              </label>
              <input
                id="firstName"
                value={formValues.firstName}
                onChange={(event) => onInputChange("firstName", event.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 transition focus:border-zinc-400 focus:ring-2"
                autoComplete="given-name"
              />
              {errors.firstName ? (
                <p className="text-xs text-red-600">{errors.firstName}</p>
              ) : null}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-zinc-900"
              >
                Last name
              </label>
              <input
                id="lastName"
                value={formValues.lastName}
                onChange={(event) => onInputChange("lastName", event.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 transition focus:border-zinc-400 focus:ring-2"
                autoComplete="family-name"
              />
              {errors.lastName ? (
                <p className="text-xs text-red-600">{errors.lastName}</p>
              ) : null}
            </div>
          </div>

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
              autoComplete="email"
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="text-sm font-medium text-zinc-900">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={formValues.phone}
              onChange={(event) => onInputChange("phone", event.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 transition focus:border-zinc-400 focus:ring-2"
              autoComplete="tel"
            />
            {errors.phone ? (
              <p className="text-xs text-red-600">{errors.phone}</p>
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
                autoComplete="new-password"
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

          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-zinc-900"
            >
              Confirm password
            </label>
            <div className="flex gap-2">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formValues.confirmPassword}
                onChange={(event) =>
                  onInputChange("confirmPassword", event.target.value)
                }
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 transition focus:border-zinc-400 focus:ring-2"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p className="text-xs text-red-600">{errors.confirmPassword}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Create account
          </button>
        </form>

        <p className="mt-5 text-sm text-zinc-600">
          Already have an account?{" "}
          <Link className="font-medium text-zinc-900 underline" href="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
