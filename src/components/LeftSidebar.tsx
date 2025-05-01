"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageCircle, Settings, User } from "lucide-react";

const LeftSidebar = () => {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/profile", label: "Profile", icon: User },
        { href: "/explore", label: "Explore", icon: Search },
        { href: "/chats", label: "Chats", icon: MessageCircle },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-96 bg-white dark:bg-zinc-900 shadow-sm hidden md:flex flex-col">
            <div className="flex items-center justify-center h-16 border-b dark:border-zinc-800 px-6">
                <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-white">
                    Memed<span className="text-indigo-500">In</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-white"
                                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t dark:border-zinc-800 px-4 py-4">
                {/* Optional footer or profile settings here */}
                <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                    © 2025 MemedIn
                </div>
            </div>
        </aside>
    );
};

export default LeftSidebar;
