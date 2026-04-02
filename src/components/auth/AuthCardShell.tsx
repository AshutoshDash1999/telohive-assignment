import type { ReactNode } from "react";

interface AuthCardShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCardShell({ title, subtitle, children, footer }: AuthCardShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
        <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>
        {children}
        {footer ? <div className="mt-5 text-sm text-zinc-600">{footer}</div> : null}
      </div>
    </div>
  );
}
