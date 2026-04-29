"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, FileText, Settings, LogOut } from "lucide-react";
import clsx from "clsx";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
        { name: "Produits", href: "/admin/products", icon: Package },
        { name: "Devis Sur Mesure", href: "/admin/quotes", icon: FileText },
        { name: "Devis Cuisine", href: "/admin/quotes-cuisine", icon: FileText },
        { name: "Paramètres", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-muted/20 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/daricraft-mark.svg"
                            alt="DariCraft"
                            width={44}
                            height={44}
                            unoptimized
                            className="h-10 w-auto"
                        />
                        <span className="text-lg font-bold tracking-tight text-primary">
                            DariCraft<span className="text-secondary">.</span>
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-foreground/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                        <LogOut size={18} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
