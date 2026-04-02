"use client";

import { useEffect, useState } from "react";
import { Link, useTransitionRouter } from "next-view-transitions";

import { AuthCardShell } from "@/components/auth/AuthCardShell";
import { PasswordField } from "@/components/auth/PasswordField";
import {
  type FormErrors,
  type RegisterInput,
  mapZodErrors,
  registerSchema,
} from "@/lib/validation/auth";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useTransitionRouter();
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
    <AuthCardShell
      title="Register"
      subtitle="Create your account to continue."
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-medium text-zinc-900 underline" href="/login">
            Login
          </Link>
        </>
      }
    >
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

          <PasswordField
            id="password"
            label="Password"
            value={formValues.password}
            autoComplete="new-password"
            isVisible={showPassword}
            error={errors.password}
            onChange={(value) => onInputChange("password", value)}
            onToggleVisibility={() => setShowPassword((prev) => !prev)}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            value={formValues.confirmPassword}
            autoComplete="new-password"
            isVisible={showConfirmPassword}
            error={errors.confirmPassword}
            onChange={(value) => onInputChange("confirmPassword", value)}
            onToggleVisibility={() => setShowConfirmPassword((prev) => !prev)}
          />

          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Create account
          </button>
        </form>

    </AuthCardShell>
  );
}
