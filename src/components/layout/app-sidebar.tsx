"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { getUserInitials, useAuthStore } from "@/store/auth-store";

const navItems: Array<{ href: string; label: string }> = [
    { href: "/discovery", label: "Discovery" },
    { href: "/saved", label: "Saved" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/bookings", label: "Bookings" },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-4 py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Telohive
                </p>
                <p className="mt-1 text-lg font-semibold text-zinc-900">Workspace</p>
            </div>

            <nav className="flex-1 space-y-1 p-3">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block rounded-md px-3 py-2 text-sm font-medium transition ${isActive
                                    ? "bg-zinc-900 text-white"
                                    : "text-zinc-700 hover:bg-zinc-100"
                                }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-zinc-200 p-3">
                <div className="mb-3 flex items-center gap-3 rounded-md bg-zinc-100 p-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                        {getUserInitials(user)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-900">
                            {user ? `${user.firstName} ${user.lastName}`.trim() : "Guest User"}
                        </p>
                        <p className="text-xs text-zinc-600">{user?.email ?? "-"}</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        logout();
                        router.push("/login");
                    }}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}
