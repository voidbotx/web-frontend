import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Navbar from "@/components/Navbar";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MemedIn",
    description: "A social media platform for memes",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <Navbar />
            <div className="flex min-h-screen">
                <LeftSidebar />
                <main className="flex-1 max-w-2xl mx-auto p-6">
                    {children}
                </main>
                <RightSidebar />
            </div>
        </AuthProvider>
    );
}
