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
                <main className="flex-1 p-6 h-screen overflow-y-auto">{children}</main>
            </div>
        </AuthGuard>
    );
}
