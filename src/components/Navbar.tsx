"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";

// Define the AuthContextType interface
interface AuthContextType {
    user: {
        _id: string;
        username: string;
        avatar?: string;
    } | null;
    logout: () => void;
}
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Compass, Home, Menu, User, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function Navbar() {
    const authContext = useContext(AuthContext) as AuthContextType;

    if (!authContext) {
        throw new Error("AuthContext is undefined. Make sure you are using AuthContextProvider.");
    }

    const { user, logout } = authContext;
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/auth");
    };

    // Get initials for avatar fallback
    const getInitials = (name: string | undefined) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
                {/* Logo and Nav Links */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold text-primary hover:opacity-90 transition">
                        MemedIn
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Link
                            href="/"
                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                        <Link
                            href="/explore"
                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors"
                        >
                            <Compass className="h-4 w-4" />
                            Explore
                        </Link>
                    </nav>
                </div>

                {/* Desktop User Menu */}
                <div className="hidden md:flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative rounded-full p-0 h-10 w-10">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user?.avatar} alt={user?.username} />
                                    <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        @{user?.username?.toLowerCase().replace(/\s/g, "")}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/profile/${user?._id}`}
                                    className="cursor-pointer w-full flex items-center"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-500 focus:text-red-500 cursor-pointer"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile Hamburger */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[80%] sm:w-[300px] p-0">
                        <div className="flex flex-col h-full">
                            {/* User Info */}
                            <div className="flex items-center gap-3 p-4 border-b">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user?.avatar} alt={user?.username} />
                                    <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{user?.username}</p>
                                    <p className="text-xs text-muted-foreground">
                                        @{user?.username?.toLowerCase().replace(/\s/g, "")}
                                    </p>
                                </div>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex flex-col p-4 gap-2">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition"
                                    onClick={() => setOpen(false)}
                                >
                                    <Home className="h-4 w-4" />
                                    Home
                                </Link>
                                <Link
                                    href="/explore"
                                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition"
                                    onClick={() => setOpen(false)}
                                >
                                    <Compass className="h-4 w-4" />
                                    Explore
                                </Link>
                                <Link
                                    href={`/profile/${user?._id}`}
                                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition"
                                    onClick={() => setOpen(false)}
                                >
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                            </nav>

                            {/* Log out */}
                            <div className="mt-auto p-4 border-t">
                                <Button
                                    variant="destructive"
                                    className="w-full justify-start"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}

export default Navbar;