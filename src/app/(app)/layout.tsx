import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function ProtectedAppLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex min-h-screen bg-zinc-50">
                <AppSidebar />
                <main className="h-screen flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </AuthGuard>
    );
}
